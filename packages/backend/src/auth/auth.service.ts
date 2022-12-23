import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { aesEncrypt } from '../utils/crypto';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { UsersService } from './../users/users.service';
import { TokenBlacklistEntity } from './token-blacklist.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(TokenBlacklistEntity)
    private blacklistRepo: Repository<TokenBlacklistEntity>,
  ) {}

  async validateUser(name: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ name });

    if (user && this.validatePwd(pass, user)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(user: CreateUserDto): Promise<{ token: string; userId: number }> {
    const { id } = await this.usersService.findOne({ name: user.name });
    const payload = { name: user.name, id };
    const expiresIn = this.configService.get<boolean>('IS_PROD')
      ? '7 days'
      : '90 days';
    const token = this.jwtService.sign(payload, { expiresIn });

    return { token, userId: id };
  }

  validatePwd(pwd: string, user: UserEntity): boolean {
    const { key, password, iv } = user;
    const result = aesEncrypt(
      pwd,
      Buffer.from(key, 'hex'),
      Buffer.from(iv, 'hex'),
    );

    return password === result;
  }

  async invalidToken(token: string): Promise<boolean> {
    const value = token.split('Bearer ')[1];

    await this.blacklistRepo.save({ token: value });

    return true;
  }

  async isInBlackList(token: string): Promise<boolean> {
    const value = token.split('Bearer ')[1];
    const target = await this.blacklistRepo.findOne({
      where: { token: value },
    });

    return !target;
  }
}
