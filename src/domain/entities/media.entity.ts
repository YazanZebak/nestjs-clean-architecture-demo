import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MediaType } from './enums/media-type.enum';

@Entity({ name: 'media' })
export class Media {
  @PrimaryGeneratedColumn({ name: 'mediaID' })
  mediaID: number;

  @Column()
  path: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ enum: MediaType })
  type: MediaType;
}
