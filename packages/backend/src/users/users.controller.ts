import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IApiTags } from '../config/api-tags';
import { CreateUserDto } from './dto/create-user.dto';
import { UserValidatePipe } from './pipes/user.pipe';
import { UsersService } from './users.service';

@Controller()
@ApiTags(IApiTags.Users)
@ApiResponse({})
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  @UsePipes(UserValidatePipe)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.findOne({ name: createUserDto.name });

    if (user) {
      throw new BadRequestException('user exist');
    }

    return this.usersService.create(createUserDto);
  }
}
