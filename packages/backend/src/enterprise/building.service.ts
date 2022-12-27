import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBuildingDto, UpdateBuildingDto } from './dto/building.dto';
import { BuildingEntity } from './entities/building.entity';
import { EnterpriseEntity } from './entities/enterprise.entity';

export interface BuildingQuery {
  name?: string;
  page: number;
  limit: number;
}

@Injectable()
export class BuildingService {
  constructor(
    @InjectRepository(BuildingEntity)
    private buildingRepo: Repository<BuildingEntity>,
    @InjectRepository(EnterpriseEntity)
    private enterpriseRepo: Repository<EnterpriseEntity>,
  ) {}

  async create(data: CreateBuildingDto) {
    return this.buildingRepo.save(data);
  }

  async update(data: UpdateBuildingDto) {
    const { id, ...rest } = data;
    const target = await this.buildingRepo.findOne({ where: { id } });

    if (target) {
      await this.buildingRepo.update(id, rest);

      return true;
    } else {
      throw new BadRequestException('Target not exist');
    }
  }

  async findAll({ name = '%', page, limit }: BuildingQuery) {
    const selector = this.buildingRepo
      .createQueryBuilder('building')
      .where(`building.name LIKE :param`)
      .setParameters({ param: '%' + name + '%' })
      .leftJoinAndSelect('building.enterprises', 'enterprise')
      .loadRelationCountAndMap(
        'building.enterpriseCount',
        'building.enterprises',
      )
      .orderBy('building.id');

    const total = await selector.getCount();
    const buildings = await selector
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      buildings: buildings.map(({ enterprises, ...rest }) => rest),
      total,
      paginator: { page, limit },
    };
  }

  async findOne(id: number) {
    return this.buildingRepo.findOne({ where: { id } });
  }

  async remove(id: number): Promise<boolean> {
    const target = await this.buildingRepo.findOne({ where: { id } });

    if (target && !target.deletedAt) {
      await this.buildingRepo.softDelete({ id });

      return true;
    } else {
      throw new BadRequestException('Target not exist or has been deleted');
    }
  }
}
