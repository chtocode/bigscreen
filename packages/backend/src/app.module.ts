import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './utils/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';

const envFilePath: string | string[] =
  process.env.NODE_ENV === 'production' ? '.env' : '.dev.env';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath,
      validate,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'bigscreen',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      cache: true,
      logging: ['error'],
      logger: 'file',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
