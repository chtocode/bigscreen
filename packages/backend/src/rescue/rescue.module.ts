import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RescueEntity } from './entities/rescue.entity';
import { RescueController } from './rescue.controller';
import { RescueService } from './rescue.service';

@Module({
  imports: [TypeOrmModule.forFeature([RescueEntity])],
  controllers: [RescueController],
  providers: [RescueService],
})
export class RescueModule {}
