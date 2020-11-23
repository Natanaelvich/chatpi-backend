import upload from '@config/upload';
import { Exclude, Expose } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  avatar: string;

  @Column()
  @Exclude()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar_url' })
  getAvatar_url(): string | null {
    if (!this.avatar) {
      return null;
    }

    switch (upload.driver) {
      case 'disk':
        return this.avatar
          ? `${process.env.APP_API_URL}/files/${this.avatar}`
          : null;
        break;
      case 's3':
        return this.avatar
          ? `https://${upload.config.aws.bucket}.s3.amazonaws.com/${this.avatar}`
          : null;
        break;
      default:
        return null;
        break;
    }
  }
}

export default User;
