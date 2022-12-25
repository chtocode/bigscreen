import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMonitorDto, UpdateMonitorDto } from './dto/monitor.dto';
import { MonitorEntity } from './entities/monitor.entity';

export interface MonitorQuery {
  name?: string;
  page: number;
  limit: number;
}

@Injectable()
export class MonitorService {
  constructor(
    @InjectRepository(MonitorEntity)
    private monitorRepo: Repository<MonitorEntity>,
  ) {}

  async create(data: CreateMonitorDto) {
    return this.monitorRepo.save(data);
  }

  async update(data: UpdateMonitorDto) {
    const { id, ...rest } = data;
    const target = await this.monitorRepo.findOne({ where: { id } });

    if (target) {
      await this.monitorRepo.update(id, rest);

      return true;
    } else {
      throw new BadRequestException('Target not exist');
    }
  }

  async findAll({ name = '%', page, limit }: MonitorQuery) {
    const selector = this.monitorRepo
      .createQueryBuilder('monitor')
      .where(`monitor.name LIKE :param`)
      .setParameters({ param: '%' + name + '%' })
      .orderBy('monitor.id');

    const total = await selector.getCount();
    const monitors = await selector
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      monitors,
      total,
      paginator: { page, limit },
    };
  }

  async remove(id: number): Promise<boolean> {
    const target = await this.monitorRepo.findOne({ where: { id } });

    if (target && !target.deletedAt) {
      await this.monitorRepo.softDelete({ id });

      return true;
    } else {
      throw new BadRequestException('Target not exist or has been deleted');
    }
  }
}
