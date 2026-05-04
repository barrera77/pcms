import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from 'src/user/user-entity';
import { LoginDto } from 'src/auth/dto';
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'crypto';
import { generateSecret, generateURI, verifySync } from 'otplib';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async login(loginDto: LoginDto) {
    const { userName, password } = loginDto;
    const user = await this.userModel.findOne({ userName });

    if (!user || !user.hashedPassword || !user.isActivated) {
      await bcrypt.compare(
        password,
        '$2b$10$invalidhashpadding000000000000000',
      );
      throw new UnauthorizedException(
        'Invalid credentials or account not activated',
      );
    }

    // Check if the account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException(
        'Account is locked. Try again later or contact your admin',
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts ?? 0) + 1;

      if (user.failedLoginAttempts >= 3) {
        user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 min lock
        user.failedLoginAttempts = 0;
        await user.save();
        throw new UnauthorizedException(
          'Account is temporarily locked. Try again later or contact your admin.',
        );
      }

      await user.save();

      const remaining = 3 - user.failedLoginAttempts;
      throw new UnauthorizedException(
        remaining <= 1
          ? `Invalid credentials. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining before your account is locked.`
          : 'Invalid credentials',
      );
    }

    // Successful login — reset lockout counters
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    await user.save();

    if (user.isTwoFactorEnabled) {
      const tempToken = this.jwtService.sign(
        {
          sub: user._id.toString(),
          userName: user.userName,
          role: user.role,
          type: '2fa-challenge',
        },
        { expiresIn: 300 }, //5 mikes
      );
      return { requiresTwoFactor: true, tempToken };
    }

    const tokens = this.generateTokens(
      user._id.toString(),
      user.userName,
      user.role,
    );

    return {
      message: 'Login successful',
      requiresTwoFactor: false,
      ...tokens,
    };
  }

  // Verify the refresh token
  async verifyRefreshtoken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid refreshToken');
    }
  }

  // Generate tokens
  generateTokens(userId: string, userName: string, role: string) {
    const payload = { sub: userId, userName, role };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: parseInt(
        this.configService.get('JWT_ACCESS_EXPIRY') ?? '900',
        10,
      ),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: parseInt(
        this.configService.get('JWT_REFRESH_EXPIRY') ?? '86400',
        10,
      ),
    });

    return { accessToken, refreshToken };
  }

  // Generate a TOTP secret and QR code for the user to scan
  async setupTwoFactor(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const secret = generateSecret();
    const optauthUrl = generateURI({
      issuer: 'PCMS',
      label: user.userName,
      secret,
    });

    const qrCodeDataUrl = await toDataURL(optauthUrl);

    user.twoFactorSecret = this.encryptSecret(secret);
    await user.save();

    return { secret, qrCodeDataUrl };
  }

  // Verify the code and enable 2FA
  async verifyTwoFactor(userId: string, code: string) {
    const user = await this.userModel.findById(userId);

    if (!user || !user.twoFactorSecret) {
      throw new UnauthorizedException('No 2FA setup in progress');
    }

    const secret = this.decryptSecret(user.twoFactorSecret);
    const result = verifySync({ secret, token: code });

    if (!result.valid) {
      throw new UnauthorizedException('Invalid 2FA code. Please try again.');
    }

    user.isTwoFactorEnabled = true;
    await user.save();

    return { message: '2FA enabled successfully' };
  }

  async validateTwoFactor(userId: string, code: string) {
    const user = await this.userModel.findById(userId);

    if (!user || !user.twoFactorSecret || !user.isTwoFactorEnabled) {
      throw new UnauthorizedException('2FA not configured for this account');
    }

    const secret = this.decryptSecret(user.twoFactorSecret);
    const result = verifySync({ secret, token: code });

    if (!result.valid) {
      throw new UnauthorizedException('Invalid 2FA code. Please try again.');
    }

    return this.generateTokens(user._id.toString(), user.userName, user.role);
  }

  private getEncryptionKey(): Buffer {
    const raw = this.configService.get<string>('JWT_SECRET') ?? '';
    return createHash('sha256').update(raw).digest();
  }

  private encryptSecret(plaintext: string): string {
    const key = this.getEncryptionKey();
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', key, iv);
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  private decryptSecret(encryptedSecret: string): string {
    const [ivHex, encryptedHex] = encryptedSecret.split(':');
    const key = this.getEncryptionKey();
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  }
}
