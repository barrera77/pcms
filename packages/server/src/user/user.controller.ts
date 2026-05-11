import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserRoles } from '@pcms/pcms-common';
import { Public } from 'src/auth/public.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { ActivateUserDto } from 'src/user/dto/activate-user.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ResendActivationDto } from 'src/user/dto/resend-user-activation.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { UserDto } from 'src/user/dto/user.output.dto';
import { UserService } from 'src/user/user.service';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRoles.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Add a user' })
  @ApiCreatedResponse({
    description: 'User created and activation email sent',
    type: UserDto,
  })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  //At this moment new users have no password, no account access, no JWT cookie
  @Public()
  @Post('activate')
  @ApiOperation({ summary: 'Activate a user account' })
  @ApiOkResponse({ description: 'Account activated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid or expired token' })
  async activate(@Body() dto: ActivateUserDto) {
    return this.userService.activateUser(dto);
  }

  @Public()
  @Post('resend-activation')
  @ApiOperation({ summary: 'Resend activation email' })
  @ApiOkResponse({ description: 'Activation email resent successfully' })
  @ApiBadRequestResponse({
    description: 'Invalid or already activated account',
  })
  async resendActivation(@Body() dto: ResendActivationDto) {
    return this.userService.resendActivation(dto.email);
  }

  @Roles(
    UserRoles.ADMIN,
    UserRoles.EXECUTIVE,
    UserRoles.MANAGER,
    UserRoles.SUPERVISOR,
  )
  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiOkResponse({
    description: 'List of users returned succesfully',
    type: [UserDto],
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  findAll() {
    return this.userService.findAll();
  }

  @Roles(
    UserRoles.ADMIN,
    UserRoles.EXECUTIVE,
    UserRoles.MANAGER,
    UserRoles.SUPERVISOR,
  )
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Roles(UserRoles.ADMIN)
  @Patch(':id/unlock')
  @ApiOperation({ summary: 'Unlock a locked user account' })
  @ApiOkResponse({ description: 'User account unlocked successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  unlock(@Param('id') id: string) {
    console.log('unlock called', id);
    return this.userService.unlockUser(id);
  }

  @Roles(UserRoles.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: UserDto,
  })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  @ApiOperation({ description: 'Deactivate user' })
  @ApiOkResponse({ description: 'User marked as inactive succesfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
