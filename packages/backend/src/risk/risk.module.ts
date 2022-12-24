import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiskEntity } from './entities/risk.entity';
import { RiskController } from './risk.controller';
import { RiskService } from './risk.service';

@Module({
  imports: [TypeOrmModule.forFeature([RiskEntity])],
  controllers: [RiskController],
  providers: [RiskService],
})
export class RiskModule {}
