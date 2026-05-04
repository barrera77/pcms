import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from 'src/user/user-entity';
import { LoginDto } from 'src/auth/dto';

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

    const tokens = this.generateTokens(
      user._id.toString(),
      user.userName,
      user.role,
    );

    return {
      message: 'Login successful',
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
}
