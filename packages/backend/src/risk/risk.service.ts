import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRiskDto, UpdateRiskDto } from './dto/risk.dto';
import { RiskEntity } from './entities/risk.entity';

export interface RiskQuery {
  name?: string;
  category?: string;
  page: number;
  limit: number;
}

@Injectable()
export class RiskService {
  constructor(
    @InjectRepository(RiskEntity)
    private riskRepo: Repository<RiskEntity>,
  ) {}

  async create(data: CreateRiskDto) {
    return this.riskRepo.save(data);
  }

  async update(data: UpdateRiskDto) {
    const { id, ...rest } = data;
    const target = await this.riskRepo.findOne({ where: { id } });

    if (target) {
      await this.riskRepo.update(id, rest);

      return true;
    } else {
      throw new BadRequestException('Target not exist');
    }
  }

  async findAll({ name = '%', category = '', page, limit }: RiskQuery) {
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
