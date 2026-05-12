import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockMetadata } from 'jest-mock';
import { Types } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/user-entity';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

jest.mock('otplib', () => ({
  ...jest.requireActual('otplib'),
  verify: jest.fn(),
}));

import * as otplib from 'otplib';

const moduleMocker = new ModuleMocker(global);

describe('AuthService #', () => {
  let service: AuthService;
  let mockUserModel: { findOne: jest.Mock; findById: jest.Mock };
  let mockUser: any;
  let configService: ConfigService;

  beforeEach(async () => {
    mockUser = {
      userName: 'testUser',
      hashedPassword: await bcrypt.hash('correctPassword', 10),
      isActivated: true,
      failedLoginAttempts: 0,
      lockedUntil: null,
      isTwoFactorEnabled: false,
      role: 'admin',
      _id: new Types.ObjectId(),
      save: jest.fn(),
    };

    mockUserModel = {
      findOne: jest.fn().mockResolvedValue(mockUser),
      findById: jest.fn().mockResolvedValue(mockUser),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    })
      .useMocker((token) => {
        if (typeof token === 'function') {
          const mockMetaData = moduleMocker.getMetadata(token) as MockMetadata<
            any,
            any
          >;
          const Mock = moduleMocker.generateFromMetadata(mockMetaData);
          return new Mock();
        }
      })
      .compile();

    service = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
    jest.spyOn(configService, 'get').mockReturnValue('test-secret');
  });

  describe('login() #', () => {
    describe('sad-path #', () => {
      it('should throw UnauthorizedException when user is not found', async () => {
        mockUserModel.findOne.mockResolvedValue(null);

        await expect(
          service.login({ userName: 'nobody', password: 'anything' }),
        ).rejects.toThrow(UnauthorizedException);
      });

      it('should throw UnauthorizedException when account is not activated', async () => {
        mockUser.isActivated = false;

        await expect(
          service.login({ userName: 'testUser', password: 'correctPassword' }),
        ).rejects.toThrow(UnauthorizedException);
      });

      it('should throw UnauthorizedException  when account is locked', async () => {
        mockUser.lockedUntil = new Date(Date.now() + 60 * 1000);

        await expect(
          service.login({ userName: 'testUser', password: 'correctPassword' }),
        ).rejects.toThrow(UnauthorizedException);
      });

      it('should throw UnauthorizedException and incrment failedLoginAttempts on wrong  password', async () => {
        await expect(
          service.login({ userName: 'testUser', password: 'wrongPassword' }),
        ).rejects.toThrow(UnauthorizedException);

        expect(mockUser.save).toHaveBeenCalled();
        expect(mockUser.failedLoginAttempts).toBe(1);
      });

      it('should lock account and throw UnauthorizedException on thrid failed attempt', async () => {
        mockUser.failedLoginAttempts = 2;

        await expect(
          service.login({ userName: 'testUser', password: 'wrongPassword' }),
        ).rejects.toThrow(UnauthorizedException);

        expect(mockUser.save).toHaveBeenCalled();
        expect(mockUser.lockedUntil).not.toBeNull();
        expect(mockUser.failedLoginAttempts).toBe(0);
      });
    });
  });

  describe('verifyTwoFactor() #', () => {
    let plainSecret: string;

    beforeEach(async () => {
      const setup = await service.setupTwoFactor(mockUser._id.toString());
      plainSecret = setup.secret;
    });

    describe('sad-path #', () => {
      it('should throw UnauthorizedException when twoFactorSecret is missing', async () => {
        mockUser.twoFactorSecret = null;

        await expect(
          service.verifyTwoFactor(mockUser._id.toString(), '123456'),
        ).rejects.toThrow(UnauthorizedException);
      });

      it('should throw UnauthorizedException on invalid TOTP code', async () => {
        (otplib.verify as jest.Mock).mockReturnValue(false);

        await expect(
          service.verifyTwoFactor(mockUser._id.toString(), '000000'),
        ).rejects.toThrow(UnauthorizedException);
      });
    });

    describe('happy-path #', () => {
      it('should enable 2FA and return success message on valid code', async () => {
        (otplib.verify as jest.Mock).mockReturnValue(true);

        const result = await service.verifyTwoFactor(
          mockUser._id.toString(),
          '123456',
        );

        expect(mockUser.isTwoFactorEnabled).toBe(true);
        expect(mockUser.save).toHaveBeenCalled();
        expect(result).toEqual({ message: '2FA enabled successfully' });
      });
    });
  });

  describe('validateTwoFactor() #', () => {
    beforeEach(async () => {
      await service.setupTwoFactor(mockUser._id.toString());
      mockUser.isTwoFactorEnabled = true;
    });

    describe('sad-path #', () => {
      it('should throw UnauthorizedException when 2FA is not configured', async () => {
        mockUser.isTwoFactorEnabled = false;
        mockUser.twoFactorSecret = null;

        await expect(
          service.validateTwoFactor(mockUser._id.toString(), '123456'),
        ).rejects.toThrow(UnauthorizedException);
      });

      it('should throw UnauthorizedException on invalid TOTP code', async () => {
        (otplib.verify as jest.Mock).mockReturnValue(false);

        await expect(
          service.validateTwoFactor(mockUser._id.toString(), '000000'),
        ).rejects.toThrow(UnauthorizedException);
      });
    });

    describe('happy-path #', () => {
      it('should return accessToken and refreshToken on valid code', async () => {
        (otplib.verify as jest.Mock).mockReturnValue(true);

        const result = await service.validateTwoFactor(
          mockUser._id.toString(),
          '123456',
        );

        expect(result).toHaveProperty('accessToken');
        expect(result).toHaveProperty('refreshToken');
      });
    });
  });

  describe('happy-path #', () => {
    it('should return requiresTwoFactorSetup when 2FA is not enabled', async () => {
      const result = await service.login({
        userName: 'testUser',
        password: 'correctPassword',
      });

      expect(mockUser.save).toHaveBeenCalled();
      expect(mockUser.failedLoginAttempts).toBe(0);
      expect(result).toHaveProperty('requiresTwoFactorSetup', true);
      expect(result).toHaveProperty('setupToken');
    });

    it('should return requiresTwoFactor when 2FA is enabled', async () => {
      mockUser.isTwoFactorEnabled = true;

      const result = await service.login({
        userName: 'testUser',
        password: 'correctPassword',
      });

      expect(result).toHaveProperty('requiresTwoFactor', true);
      expect(result).toHaveProperty('tempToken');
    });
  });
});
