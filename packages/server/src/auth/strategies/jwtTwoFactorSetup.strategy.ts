import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtTwoFactorSetupStrategy extends PassportStrategy(
  Strategy,
  'jwt-2fa-setup',
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.['twoFactorSetupToken'] ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    if (payload.type !== '2fa-setup') {
      throw new UnauthorizedException('Invalid Token type');
    }
    return {
      sub: payload.sub,
      userName: payload.userName,
      role: payload.role,
    };
  }
}
