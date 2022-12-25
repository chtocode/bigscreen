import { Module } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { MonitorController } from './monitor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitorEntity } from './entities/monitor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorEntity])],
  providers: [MonitorService],
  controllers: [MonitorController],
})
export class MonitorModule {}
