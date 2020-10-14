import upload from '@config/upload';
import { Expose } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Orphanage from './Orphanage';

@Entity('images')
class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;

  @ManyToOne(() => Orphanage, orphanage => orphanage.images)
  @JoinColumn({ name: 'orphanage_id' })
  orphanage: Orphanage;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar_url' })
  getAvatar_url(): string | null {
    if (!this.path) {
      return null;
    }

    switch (upload.driver) {
      case 'disk':
        return this.path
          ? `${process.env.APP_API_URL}/files/${this.path}`
          : null;
        break;
      case 's3':
        return this.path
          ? `https://${upload.config.aws.bucket}.s3.amazonaws.com/${this.path}`
          : null;
        break;
      default:
        return null;
        break;
    }
  }
}

export default Image;
