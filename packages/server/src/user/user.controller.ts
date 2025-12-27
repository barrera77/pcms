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
import { ActivateUserDto } from 'src/user/dto/activate-user.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { UserDto } from 'src/user/dto/user.output.dto';
import { UserService } from 'src/user/user.service';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Add a user' })
  @ApiCreatedResponse({
    description: 'User created and activation email sent',
    type: UserDto,
  })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Post('activate')
  @ApiOperation({ summary: 'Activate a user account' })
  @ApiOkResponse({ description: 'Account activated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid or expired token' })
  async activate(@Body() dto: ActivateUserDto) {
    return this.userService.activateUser(dto);
  }

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: UserDto,
  })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Deactivate user' })
  @ApiOkResponse({ description: 'User marked as inactive succesfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
