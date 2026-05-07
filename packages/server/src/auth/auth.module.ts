import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAccessTokenStrategy } from './strategies/jwtAccessToken.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshTokenStrategy } from './strategies/jwtRefreshToken.strategy';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthService } from 'src/auth/auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtTwoFactorStrategy } from 'src/auth/strategies/jwtTwoFactor.strategy';
import { JwtTwoFactorSetupStrategy } from 'src/auth/strategies/jwtTwoFactorSetup.strategy';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    JwtTwoFactorStrategy,
    JwtTwoFactorSetupStrategy,
    RolesGuard,
  ],
})
export class AuthModule {}
