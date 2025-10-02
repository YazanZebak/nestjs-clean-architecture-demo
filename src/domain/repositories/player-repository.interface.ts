import { Player } from '../entities/player.entity';
import { CreatePlayerDTO } from '../models/player/dtos/create-player.dto';
import { UpdatePlayerDTO } from '../models/player/dtos/update-player.dto';

export interface IPlayerRepository {
  findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ players: Player[]; count: number }>;

  getTotalCount(): Promise<number>;

  findOneById(id: number): Promise<Player>;

  findOneBy(property: keyof Player, value: any): Promise<Player | undefined>;

  create(playerData: CreatePlayerDTO): Promise<Player>;

  update(id: number, playerData: UpdatePlayerDTO): Promise<Player>;

  remove(id: number): Promise<void>;

  statistics(start: Date, end: Date): Promise<{ date: Date; count: number }[]>;
}
