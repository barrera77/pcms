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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(loginDto);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 1,
    });

    return { message: 'Login successful' };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
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
