import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityWithTimeStamp } from '../../base/entity';
import { EnterpriseEntity } from './enterprise.entity';

@Entity()
export class BuildingEntity extends EntityWithTimeStamp {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => EnterpriseEntity, (enterprise) => enterprise.building)
  enterprises: EnterpriseEntity[];

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
  totalFloors: number;

  @Column()
  subsurfaceFloors: number;

  @Column({ type: 'simple-json' })
  floors: JSON;
}
