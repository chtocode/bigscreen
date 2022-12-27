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
    private rescueRepo: Repository<RescueEntity>,
  ) {}

  async create(data: CreateRescueDto) {
    return this.rescueRepo.save(data);
  }

  async update(data: UpdateRescueDto) {
    const { id, ...rest } = data;
    const target = await this.rescueRepo.findOne({ where: { id } });

    if (target) {
      await this.rescueRepo.update(id, rest);

      return true;
    } else {
      throw new BadRequestException('Target not exist');
    }
  }

  async findAll({ name = '%', category = '', page, limit }: RescueQuery) {
    const selector = this.rescueRepo
      .createQueryBuilder('rescue')
      .where(
        `rescue.name LIKE :param ${
          category ? 'AND rescue.category = :type' : ''
        } `,
      )
      .setParameters({ param: '%' + name + '%', type: category })
      .orderBy('rescue.id');

    const total = await selector.getCount();
    const rescues = await selector
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      rescues,
      total,
      paginator: { page, limit },
    };
  }

  async findOne(id: number) {
    return this.rescueRepo.findOne({ where: { id } });
  }

  async remove(id: number): Promise<boolean> {
    const target = await this.rescueRepo.findOne({ where: { id } });

    if (target && !target.deletedAt) {
      await this.rescueRepo.softDelete({ id });

      return true;
    } else {
      throw new BadRequestException('Target not exist or has been deleted');
    }
  }
}
