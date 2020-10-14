import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import Image from './Image';

@Entity('orphanages')
class Orphanage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  about: string;

  @Column()
  instructions: string;

  @Column()
  open_on_weekends: boolean;

  @Column()
  open_hours: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @OneToMany(() => Image, image => image.orphanage, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'orphanage_id' })
  images: Image[];
}

export default Orphanage;
