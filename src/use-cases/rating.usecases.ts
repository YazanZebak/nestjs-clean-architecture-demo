import { IException } from 'src/domain/adapters/exceptions.interface';
import { AbstractListPresenter } from 'src/domain/models/abstracts/abstract-list.presenter';
import { CreateRatingDTO } from 'src/domain/models/rating/dtos/create-rating.dto';
import { UpdateRatingDTO } from 'src/domain/models/rating/dtos/update-rating.dto';
import { RatingPresenter } from 'src/domain/models/rating/presenter/rating.presenter';
import { IRatingRepository } from 'src/domain/repositories/rating-repository.interface';
import { ITrainingRepository } from 'src/domain/repositories/training-repository.interface';

export class RatingUseCases {
  constructor(
    private readonly ratingRepository: IRatingRepository,
    private readonly trainingRepository: ITrainingRepository,
    private readonly exceptionService: IException,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<AbstractListPresenter<RatingPresenter>> {
    const response = await this.ratingRepository.findAll(
      page,
      limit,
      filter,
      search,
    );

    const ratings = response.ratings.map(
      (rating) => new RatingPresenter(rating),
    );

    return { data: ratings, count: response.count };
  }

  async count(): Promise<{ count: number }> {
    const count = await this.ratingRepository.getTotalCount();
    return { count };
  }

  async findOneById(id: number): Promise<RatingPresenter> {
    const rating = await this.ratingRepository.findOneById(id);
    return new RatingPresenter(rating);
  }

  async create(ratingData: CreateRatingDTO): Promise<RatingPresenter> {
    const newRating = await this.ratingRepository.create(ratingData);
    return new RatingPresenter(newRating);
  }

  async update(
    id: number,
    ratingData: UpdateRatingDTO,
  ): Promise<RatingPresenter> {
    const rating = await this.ratingRepository.update(id, ratingData);
    return new RatingPresenter(rating);
  }

  async delete(id: number): Promise<void> {
    await this.ratingRepository.remove(id);
  }
}
