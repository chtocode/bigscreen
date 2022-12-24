import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityWithTimeStamp } from '../../base/entity';

@Entity()
export class RescueEntity extends EntityWithTimeStamp {
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

  @Column()
  category: string;

  @Column({
    nullable: true,
  })
  address: string;

  @Column()
  coordinate: string;

  @Column({
    nullable: true,
  })
  detail: string;

  @Column({
    nullable: true,
    type: 'simple-array',
  })
  pictures: string[];
}
