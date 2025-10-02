import { Rating } from '../entities/rating.entity';
import { CreateRatingDTO } from '../models/rating/dtos/create-rating.dto';
import { UpdateRatingDTO } from '../models/rating/dtos/update-rating.dto';

export interface IRatingRepository {
  findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ ratings: Rating[]; count: number }>;

  getTotalCount(): Promise<number>;

  findOneById(id: number): Promise<Rating>;

  findOneBy(property: keyof Rating, value: any): Promise<Rating | undefined>;

  create(ratingData: CreateRatingDTO): Promise<Rating>;

  update(id: number, ratingData: UpdateRatingDTO): Promise<Rating>;

  remove(id: number): Promise<void>;
}
