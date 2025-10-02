import { Gym } from '../entities/gym.entity';
import { CreateGymDTO } from '../models/gym/dtos/create-gym.dto';
import { UpdateGymDTO } from '../models/gym/dtos/update-gym.dto';

export interface IGymRepository {
  findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ gyms: Gym[]; count: number }>;

  getTotalCount(): Promise<number>;

  findOneById(id: number): Promise<Gym>;

  findOneBy(property: keyof Gym, value: any): Promise<Gym | undefined>;

  create(gymData: CreateGymDTO): Promise<Gym>;

  update(id: number, gymData: UpdateGymDTO): Promise<Gym>;

  remove(id: number): Promise<void>;

  statistics(start: Date, end: Date): Promise<{ date: Date; count: number }[]>;
}
