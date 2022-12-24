import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRescueDto, UpdateRescueDto } from './dto/rescue.dto';
import { RescueEntity } from './entities/rescue.entity';

export interface RescueQuery {
  name?: string;
  category?: string;
  page: number;
  limit: number;
}

@Injectable()
export class RescueService {
  constructor(
    @InjectRepository(RescueEntity)
    private riskRepo: Repository<RescueEntity>,
  ) {}

  async create(data: CreateRescueDto) {
    return this.riskRepo.save(data);
  }

  async update(data: UpdateRescueDto) {
    const { id, ...rest } = data;
    const target = await this.riskRepo.findOne({ where: { id } });

    if (target) {
      await this.riskRepo.update(id, rest);

      return true;
    } else {
      throw new BadRequestException('Target not exist');
    }
  }

  async findAll({ name = '%', category = '', page, limit }: RescueQuery) {
    const selector = this.riskRepo
      .createQueryBuilder('risk')
      .where(
        `risk.name LIKE :param ${category ? 'AND risk.category = :type' : ''} `,
      )
      .setParameters({ param: '%' + name + '%', type: category })
      .orderBy('risk.id');

    const total = await selector.getCount();
    const risks = await selector
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      risks,
      total,
      paginator: { page, limit },
    };
  }

  async remove(id: number): Promise<boolean> {
    const target = await this.riskRepo.findOne({ where: { id } });

    if (target && !target.deletedAt) {
      await this.riskRepo.softDelete({ id });

      return true;
    } else {
      throw new BadRequestException('Target not exist or has been deleted');
    }
  }
}
