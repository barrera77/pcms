import {
  Controller,
  Body,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  Res,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { CurrentUser } from 'src/auth/current-user.decorator';
import type { CurrentUserPayload } from 'src/auth/current-user.decorator';
import { LoginDto } from 'src/auth/dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ auth: { ttl: 900000, limit: 10 } })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    // 2FA required — set challenge cookie, don't issue full tokens yet
    if (result.requiresTwoFactor) {
      res.cookie('twoFactorToken', result.tempToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 5, // 5 minutes
      });
      return { requiresTwoFactor: true, message: '2FA verification required' };
    }

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { message: 'Login successful', requiresTwoFactor: false };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt-access'))
  me(@CurrentUser() user: CurrentUserPayload) {
    return user;
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    const isProd = process.env.NODE_ENV === 'production';

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    const userData = await this.authService.verifyRefreshtoken(refreshToken);

    const newTokens = this.authService.generateTokens(
      userData.sub,
      userData.userName,
      userData.role,
    );
    res.cookie('accessToken', newTokens.accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refreshToken', newTokens.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 1,
    });

    return {
      message: 'Token refreshed succesfully',
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    const isProd = process.env.NODE_ENV === 'production';

    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
    });

    return { message: 'Logged out successfully' };
  }
}
