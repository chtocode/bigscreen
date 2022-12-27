import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityWithTimeStamp } from '../../base/entity';
import { BuildingEntity } from './building.entity';

@Entity()
export class EnterpriseEntity extends EntityWithTimeStamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  person: string;

  @Column({
    nullable: true,
  })
  tel: string;

  @Column({
    nullable: true,
  })
  address: string;

  @Column()
  floor: string;

  @Column({
    nullable: true,
  })
  detail: string;

  @Column({
    nullable: true,
    type: 'simple-array',
  })
  pictures: string[];

  @ManyToOne(() => BuildingEntity, (building) => building.enterprises)
  building: BuildingEntity;
}
