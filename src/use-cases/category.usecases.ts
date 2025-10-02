import { IException } from 'src/domain/adapters/exceptions.interface';
import { AbstractListPresenter } from 'src/domain/models/abstracts/abstract-list.presenter';
import { CreateCategoryDTO } from 'src/domain/models/category/dtos/create-category.dto';
import { UpdateCategoryDTO } from 'src/domain/models/category/dtos/update-category.dto';
import { CategoryPresenter } from 'src/domain/models/category/presenters/category.presenter';
import { ICategoryRepository } from 'src/domain/repositories/category-repository.interface';

export class CategoryUseCases {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly exceptionService: IException,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<AbstractListPresenter<CategoryPresenter>> {
    const response = await this.categoryRepository.findAll(
      page,
      limit,
      filter,
      search,
    );

    const categories = response.categories.map(
      (category) => new CategoryPresenter(category),
    );

    return { data: categories, count: response.count };
  }

  async count(): Promise<{ count: number }> {
    const count = await this.categoryRepository.getTotalCount();
    return { count };
  }

  async findOneById(id: number): Promise<CategoryPresenter> {
    const category = await this.categoryRepository.findOneById(id);
    return new CategoryPresenter(category);
  }

  async create(categoryData: CreateCategoryDTO): Promise<CategoryPresenter> {
    const newCategory = await this.categoryRepository.create(categoryData);
    return new CategoryPresenter(newCategory);
  }

  async update(
    id: number,
    categoryData: UpdateCategoryDTO,
  ): Promise<CategoryPresenter> {
    const category = await this.categoryRepository.update(id, categoryData);
    return new CategoryPresenter(category);
  }

  async delete(id: number): Promise<void> {
    await this.categoryRepository.remove(id);
  }
}
