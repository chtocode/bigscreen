import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserValidatePipe implements PipeTransform {
  transform(value: CreateUserDto) {
    const { name, password } = value;

    if (name.length > 10 || name.length < 3) {
      throw new BadRequestException('name invalid!');
    }

    if (this.isPasswordInvalid(password)) {
      throw new BadRequestException('Password invalid!');
    }

    return value;
  }

  /**
   * 验证密码
   */
  private isPasswordInvalid(pwd: string): boolean {
    return pwd.length < 4 || pwd.length > 60;
  }
}
