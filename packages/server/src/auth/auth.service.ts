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
      throw new UnauthorizedException(
        'Invalid credentials or account not activated',
      );
    }
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

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

  //Verify the refresToken
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

  //Generate tokens
  generateTokens(userId: string, userName: string, role: string) {
    const payload = {
      sub: userId,
      userName,
      role,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<number>('JWT_EXPIRY'),
    });

    return { accessToken, refreshToken };
  }
}
