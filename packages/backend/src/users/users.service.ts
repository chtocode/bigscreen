import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { encryptPwd } from '../utils/crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findOne(
    condition: Partial<Pick<UserEntity, 'id' | 'name'>>,
  ): Promise<UserEntity | undefined> {
    return this.userRepo.findOne({ where: condition });
  }

  async create({
    name,
    password,
  }: CreateUserDto): Promise<Partial<UserEntity>> {
    const salt = Math.random().toString(32).slice(2);
    const { result, key, iv } = encryptPwd(password, salt);

    await this.userRepo.save({
      name,
      password: result,
      key,
      iv,
    });

    return { name };
  }
}
