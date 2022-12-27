import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEnterpriseDto, UpdateEnterpriseDto } from './dto/enterprise.dto';
import { BuildingEntity } from './entities/building.entity';
import { EnterpriseEntity } from './entities/enterprise.entity';

export interface EnterpriseQuery {
  name?: string;
  page: number;
  limit: number;
  buildingId?: number;
}

@Injectable()
export class EnterpriseService {
  constructor(
    @InjectRepository(EnterpriseEntity)
    private enterpriseRepo: Repository<EnterpriseEntity>,
    @InjectRepository(BuildingEntity)
    private buildingRepo: Repository<BuildingEntity>,
  ) {}

  async create({ buildingId, ...rest }: CreateEnterpriseDto) {
    const building = await this.buildingRepo.findOne({
      where: { id: buildingId },
    });

    return this.enterpriseRepo.save({ ...rest, building });
  }

  async update(data: UpdateEnterpriseDto) {
    const { id, buildingId, ...rest } = data;
    const target = await this.enterpriseRepo.findOne({ where: { id } });

    if (target) {
      if (buildingId) {
        const building = await this.buildingRepo.findOne({
          where: { id: buildingId },
        });

        await this.enterpriseRepo.update(id, { ...rest, building });
      } else {
        await this.enterpriseRepo.update(id, rest);
      }

      return true;
    } else {
      throw new BadRequestException('Target not exist');
    }
  }

  async findAll({ name = '%', buildingId, page, limit }: EnterpriseQuery) {
    const selector = this.enterpriseRepo
      .createQueryBuilder('enterprise')
      .where(
        `enterprise.name LIKE :param ${
          typeof buildingId === 'number' && !isNaN(buildingId)
            ? 'AND enterprise.buildingId = :buildingId'
            : ''
        }`,
      )
      .setParameters({ param: '%' + name + '%', buildingId })
      .orderBy('enterprise.id');

    const total = await selector.getCount();
    const enterprises = await selector
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      enterprises,
      total,
      paginator: { page, limit },
    };
  }

  async findOne(id: number) {
    return this.enterpriseRepo.findOne({ where: { id } });
  }

  async remove(id: number): Promise<boolean> {
    const target = await this.enterpriseRepo.findOne({ where: { id } });

    if (target && !target.deletedAt) {
      await this.enterpriseRepo.softDelete({ id });

      return true;
    } else {
      throw new BadRequestException('Target not exist or has been deleted');
    }
  }
}
