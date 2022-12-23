import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IApiTags } from '../config/api-tags';
import { TransformInterceptor } from '../interceptors/response.interceptors';
import { CreateUserDto } from './dto/create-user.dto';
import { UserValidatePipe } from './pipes/user.pipe';
import { UsersService } from './users.service';

@Controller()
@ApiTags(IApiTags.Users)
@UseInterceptors(TransformInterceptor)
@ApiResponse({})
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  @UsePipes(UserValidatePipe)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
