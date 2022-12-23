import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityWithTimeStamp } from '../../base/entity';

@Entity()
export class UserEntity extends EntityWithTimeStamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  key: string;

  @Column()
  iv: string;
}
