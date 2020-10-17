import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('locations')
class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
}

export default Location;
