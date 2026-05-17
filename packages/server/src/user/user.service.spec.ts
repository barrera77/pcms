import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRoles } from '@pcms/pcms-common';
import { MockMetadata, ModuleMocker } from 'jest-mock';
import { Types } from 'mongoose';
import { Employee } from 'src/employee/employee.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { MailService } from 'src/mailer/mailer.service';
import { User } from 'src/user/user-entity';
import { UserService } from 'src/user/user.service';

const moduleMocker = new ModuleMocker(global);

describe('UserService #', () => {
  let service: UserService;
  let mockUserModel: {
    findOne: jest.Mock;
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    create: jest.Mock;
    find: jest.Mock;
  };
  let mockEmployeeModel: { findByIdAndUpdate: jest.Mock };
  let mockUser: any;
  let mockEmployee: any;
  let jwtService: JwtService;
  let mailService: MailService;
  let configService: ConfigService;
  let employeeService: EmployeeService;

  beforeEach(async () => {
    mockEmployee = {
      _id: new Types.ObjectId(),
      name: 'Test Employee',
      email: 'employee@hotmail.com',
      phone: '1234567890',
      departmentId: new Types.ObjectId().toString(),
      role: 'TECHNICIAN',
      userId: null,
    };

    mockUser = {
      _id: new Types.ObjectId(),
      userName: 'employee@hotmail.com',
      hashedPassword: null,
      role: 'TECHNICIAN',
      isActivated: false,
      failedLoginAttempts: 0,
      lockedUntil: null,
      twoFactorSecret: null,
      isTwoFactorEnabled: false,
      save: jest.fn(),
    };

    mockUserModel = {
      findOne: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUser) }),
      findById: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUser) }),
      find: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue([mockUser]) }),

      findByIdAndUpdate: jest.fn().mockResolvedValue(mockUser),
      create: jest.fn().mockResolvedValue(mockUser),
    };

    mockEmployeeModel = {
      findByIdAndUpdate: jest.fn().mockResolvedValue(mockEmployee),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: getModelToken(Employee.name), useValue: mockEmployeeModel },
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

    service = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    mailService = module.get<MailService>(MailService);
    configService = module.get<ConfigService>(ConfigService);
    employeeService = module.get<EmployeeService>(EmployeeService);

    //Default happy-path behaviour - individual tests override as needed
    jest.spyOn(configService, 'get').mockReturnValue('test-secret');
    jest.spyOn(jwtService, 'sign').mockReturnValue('mock-token' as any);
    jest.spyOn(jwtService, 'verify').mockReturnValue({
      sub: mockEmployee._id.toString(),
      email: mockEmployee.email,
      purpose: 'account-activation',
    } as any);
    jest
      .spyOn(employeeService, 'findByEmail')
      .mockResolvedValue(mockEmployee as any);
    jest
      .spyOn(mailService, 'sendActivationEmail')
      .mockResolvedValue(undefined as any);
  });

  //Create User
  describe('create() #', () => {
    const dto = {
      userName: 'employee@hotmail.com',
      role: UserRoles.TECHNICIAN,
    };

    describe('sad-path #', () => {
      it('should throw NotFoundException  when no employee exists with the given email', async () => {
        jest.spyOn(employeeService, 'findByEmail').mockResolvedValue(null);

        await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      });

      it('should throw ConflictException when a user already exists for his email', async () => {
        mockUserModel.findOne.mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
        });

        await expect(service.create(dto)).rejects.toThrow(ConflictException);
      });

      it('should throw BadRequestException when the email domain is not allowed', async () => {
        const badDto = {
          userName: 'employee@gmail.com',
          role: UserRoles.TECHNICIAN,
        };
        jest
          .spyOn(employeeService, 'findByEmail')
          .mockResolvedValue(mockEmployee as any);
        mockUserModel.findOne.mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        });

        await expect(service.create(badDto)).rejects.toThrow(
          BadRequestException,
        );
      });
    });
    describe('happy-path #', () => {
      it('should create user, link employee, send activation email, and return user', async () => {
        mockUserModel.findOne.mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        });

        const result = await service.create(dto);

        expect(mockUserModel.create).toHaveBeenCalledWith(
          expect.objectContaining({ userName: 'employee@hotmail.com' }),
        );
        expect(mockEmployeeModel.findByIdAndUpdate).toHaveBeenCalledWith(
          mockEmployee._id,
          { userId: mockUser._id },
        );
        expect(mailService.sendActivationEmail).toHaveBeenCalledWith(
          mockEmployee.email,
          'mock-token',
        );
        expect(result).toEqual({ user: mockUser });
      });
    });
  });

  //Activate User
  describe('activateuser() #', () => {
    const dto = { token: 'mock-token', password: 'newPassword123' };

    describe('sad- path #', () => {
      it('should throw BadRequestException when the token is incvalid or expired', async () => {
        jest.spyOn(jwtService, 'verify').mockImplementation(() => {
          throw new Error('jwt expired');
        });

        await expect(service.activateUser(dto)).rejects.toThrow(
          BadRequestException,
        );
      });

      it('should throw BadRequestException when purpose token is not account-activation', async () => {
        jest.spyOn(jwtService, 'verify').mockReturnValue({
          sub: mockUser._id.toString(),
          email: mockUser.userName,
          purpose: 'something-else',
        } as any);

        await expect(service.activateUser(dto)).rejects.toThrow(
          BadRequestException,
        );
      });

      it('should throw BadRequestException  when account is already activated', async () => {
        mockUser.isActivated = true;

        await expect(service.activateUser(dto)).rejects.toThrow(
          BadRequestException,
        );
      });
    });

    describe('happy-path #', () => {
      it('should hash password, activate user, and return a success message', async () => {
        mockUser.isActivated = false;
        mockUserModel.findOne.mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
        });

        const result = await service.activateUser(dto);
        expect(mockUser.hashedPassword).not.toBeNull();
        expect(mockUser.isActivated).toBe(true);
        expect(mockUser.save).toHaveBeenCalled();
        expect(result).toEqual({ message: 'Account activated successfully' });
      });
    });
  });

  describe('resendActivation() #', () => {
    describe('sad-path #', () => {
      it('should throw BadRequestException when user is not found', async () => {
        mockUserModel.findOne.mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        });

        await expect(
          service.resendActivation('employee@hotmail.com'),
        ).rejects.toThrow(BadRequestException);
      });

      it('should throw BadRequestException when account is already activated', async () => {
        mockUser.isActivated = true;

        await expect(
          service.resendActivation('employee@hotmail.com'),
        ).rejects.toThrow(BadRequestException);
      });
    });

    describe('happy-path #', () => {
      it('should genrate a new token and resend activation email', async () => {
        mockUser.isActivated = false;

        const result = await service.resendActivation('employee@hotmail.com');

        expect(jwtService.sign).toHaveBeenCalled();
        expect(mailService.sendActivationEmail).toHaveBeenCalledWith(
          'employee@hotmail.com',
          'mock-token',
        );
        expect(result).toEqual({ message: 'Activation email resent' });
      });
    });
  });

  describe('unlockUser() #', () => {
    describe('sad-path #', () => {
      it('should throw NotFoundException when user is not found', async () => {
        mockUserModel.findById.mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        });

        await expect(service.unlockUser('some-id')).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('happy-path #', () => {
      it('should reset login attempts and lockedUntil then save', async () => {
        mockUser.failedLoginAttempts = 3;
        mockUser.lockedUntil = new Date();

        const result = await service.unlockUser(mockUser._id.toString());

        expect(mockUser.failedLoginAttempts).toBe(0);
        expect(mockUser.lockedUntil).toBeNull();
        expect(mockUser.save).toHaveBeenCalled();
        expect(result).toEqual({
          message: 'User account unlocked successfully',
        });
      });
    });
  });

  describe('FindById() #', () => {
    describe('sad-path #', () => {
      it('should throw NotFoundException  when user is not found', async () => {
        mockUserModel.findById.mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        });

        await expect(service.findById('some-id')).rejects.toThrow(
          NotFoundException,
        );
      });
    });
    describe('happy-path #', () => {
      it('should return the user when found', async () => {
        const result = await service.findById(mockUser._id.toString());

        expect(result).toEqual(mockUser);
      });
    });
  });

  describe('findAll() #', () => {
    describe('happy-path #', () => {
      it('should return an array of users', async () => {
        mockUserModel.find = jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue([mockUser]) });

        const result = await service.findAll();

        expect(result).toEqual([mockUser]);
      });
    });
  });

  describe('update() #', () => {
    const dto = { role: UserRoles.ADMIN };

    describe('sad-path #', () => {
      it('should throw NotFoundException when user is not found', async () => {
        mockUserModel.findByIdAndUpdate.mockResolvedValue(null);

        await expect(service.update('some-id', dto)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('happy-path #', () => {
      it('should return the updated user', async () => {
        const result = await service.update(mockUser._id.toString(), dto);

        expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
          mockUser._id.toString(),
          dto,
          { new: true },
        );
        expect(result).toEqual(mockUser);
      });
    });
  });

  describe('remove() #', () => {
    describe('sad-path #', () => {
      it('should throw NotFoundException when user is not found or already active', async () => {
        mockUserModel.findByIdAndUpdate.mockResolvedValue(null);

        await expect(service.remove('some-id')).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('happy-path #', () => {
      it('should soft-delete the user and return the updated document', async () => {
        const result = await service.remove(mockUser._id.toString());

        expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
          {
            _id: mockUser._id.toString(),
            isInactive: false,
          },

          { isInactive: true, inactiveAt: expect.any(Date) },
          { new: true },
        );
        expect(result).toEqual(mockUser);
      });
    });
  });
});
