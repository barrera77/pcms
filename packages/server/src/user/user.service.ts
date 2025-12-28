import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmployeeService } from 'src/employee/employee.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { User, UserDocument } from 'src/user/user-entity';
import * as bcrypt from 'bcrypt';
import { Employee, EmployeeDocument } from 'src/employee/employee.entity';
import { ActivateUserDto } from 'src/user/dto/activate-user.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mailer/mailer.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Employee.name)
    private employeeModel: Model<EmployeeDocument>,
    private employeeService: EmployeeService,
  ) {}

  private generateActivationToken(userId: string, email: string): string {
    const expiresIn = this.configService.get('JWT_ACTIVATION_EXPIRY') || '48h';
    const secret = this.configService.get('JWT_ACTIVATION_SECRET');

    return this.jwtService.sign(
      {
        sub: userId,
        email: email,
        purpose: 'account-activation',
      },
      {
        expiresIn,
        secret,
      },
    );
  }

  async create(dto: CreateUserDto): Promise<{
    user: User;
  }> {
    const employee = await this.employeeService.findByEmail(dto.userName);

    //Check if the employee exists
    if (!employee) {
      throw new NotFoundException(
        'No employee found with this email. Employee must exist in the system first.',
      );
    }

    //Check if user already exists for this email
    const existingUser = await this.userModel
      .findOne({
        userName: dto.userName.toLocaleLowerCase(),
      })
      .exec();

    if (existingUser) {
      throw new ConflictException(
        'A user account already exists for this employee',
      );
    }

    //Validate corporate email domain
    const allowedDomains = process.env.ALLOWED_EMAIL_DOMAIN?.split(',') || [
      '@hotmail.com',
    ];

    const emailDomain = dto.userName.substring(dto.userName.indexOf('@'));

    if (!allowedDomains.some((domain) => emailDomain === domain)) {
      throw new BadRequestException(
        `Email must be from corporate domain: ${allowedDomains.join(', ')}`,
      );
    }

    //Generate activation token (48 hours validity)
    const activationToken = this.generateActivationToken(
      employee._id.toString(),
      employee.email,
    );

    //Create user
    const user = await this.userModel.create({
      userName: dto.userName.toLowerCase(),
      hashedPassword: null,
      role: dto.role,
      isActivated: false,
    });

    await this.employeeModel.findByIdAndUpdate(employee._id, {
      userId: user._id,
    });

    await this.mailService.sendActivationEmail(employee.email, activationToken);

    return { user };
  }

  async activateUser(dto: ActivateUserDto) {
    const secret = this.configService.get('JWT_ACTIVATION_SECRET');

    let payload;
    try {
      payload = this.jwtService.verify(dto.token, {
        secret: secret,
      });
    } catch (err) {
      throw new BadRequestException('Invalid or expired token');
    }

    if (payload.purpose !== 'account-activation') {
      throw new BadRequestException('Invalid token purpose');
    }

    const user = await this.userModel.findOne({ userName: payload.email });

    if (!user || user.isActivated) {
      throw new BadRequestException('Invalid or already activated account');
    }

    user.hashedPassword = await bcrypt.hash(dto.password, 10);
    user.isActivated = true;

    await user.save();

    return { message: 'Account activated successfully' };
  }

  async resendActivation(email: string) {
    const user = await this.userModel.findOne({ userName: email });

    if (!user || user.isActivated) {
      throw new BadRequestException('Invalid or already activated account');
    }

    const activationToken = this.generateActivationToken(
      user._id.toString(),
      email,
    );

    //Resend the email
    await this.mailService.sendActivationEmail(email, activationToken);
    return { message: 'Activation email resent' };
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ email })
      .populate({ path: 'departmentId', select: 'name' })
      .exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const updated = await this.userModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException('User not found');
    }
    return updated;
  }

  async remove(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      { _id: id, isInactive: false },
      { isInactive: true, inactiveAt: new Date() },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found or already inactive');
    }

    return user;
  }
}
