import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingService } from './building.service';
import {
  BuildingController,
  EnterpriseController,
} from './enterprise.controller';
import { EnterpriseService } from './enterprise.service';
import { BuildingEntity } from './entities/building.entity';
import { EnterpriseEntity } from './entities/enterprise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EnterpriseEntity, BuildingEntity])],
  controllers: [EnterpriseController, BuildingController],
  providers: [EnterpriseService, BuildingService],
})
export class EnterpriseModule {}
