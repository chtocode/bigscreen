import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './utils/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiskModule } from './risk/risk.module';
import { RescueModule } from './rescue/rescue.module';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { MonitorModule } from './monitor/monitor.module';

const isProd = process.env.NODE_ENV === 'production';

const envFilePath: string | string[] = isProd ? '.env' : '.dev.env';
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
      password: isProd ? 'honey_badger' : '123456',
      database: 'bigscreen',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      cache: true,
      logging: ['error'],
      logger: 'file',
    }),
    RiskModule,
    RescueModule,
    EnterpriseModule,
    MonitorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
