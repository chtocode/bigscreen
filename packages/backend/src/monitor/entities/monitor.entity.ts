import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityWithTimeStamp } from '../../base/entity';

@Entity()
export class MonitorEntity extends EntityWithTimeStamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  address: string;

  @Column()
  coordinate: string;

  @Column()
  url: string;
}
