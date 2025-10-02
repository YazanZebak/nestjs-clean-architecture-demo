import { IException } from 'src/domain/adapters/exceptions.interface';
import { Status } from 'src/domain/entities/enums/status.enum';
import { AbstractListPresenter } from 'src/domain/models/abstracts/abstract-list.presenter';
import { CreateEnrollmentDTO } from 'src/domain/models/enrollment/dtos/create-enrollment.dto';
import { UpdateEnrollmentDTO } from 'src/domain/models/enrollment/dtos/update-enrollment.dto';
import { EnrollmentPresenter } from 'src/domain/models/enrollment/presenters/enrollment.presenter';
import { ICoachRepository } from 'src/domain/repositories/coach-repository.interface';
import { IEnrollmentRepository } from 'src/domain/repositories/enrollment-repository.interface';
import { IGymRepository } from 'src/domain/repositories/gym-repositroy.interface';

export class EnrollmentUseCases {
  constructor(
    private readonly enrollmentRepository: IEnrollmentRepository,
    private readonly gymRepository: IGymRepository,
    private readonly coachRepository: ICoachRepository,
    private readonly exceptionService: IException,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<AbstractListPresenter<EnrollmentPresenter>> {
    const response = await this.enrollmentRepository.findAll(
      page,
      limit,
      filter,
      search,
    );

    const enrollments = response.enrollments.map(
      (enrollment) => new EnrollmentPresenter(enrollment),
    );

    return { data: enrollments, count: response.count };
  }

  async count(): Promise<{ count: number }> {
    const count = await this.enrollmentRepository.getTotalCount();
    return { count };
  }

  async findOneById(id: number): Promise<EnrollmentPresenter> {
    const enrollment = await this.enrollmentRepository.findOneById(id);
    return new EnrollmentPresenter(enrollment);
  }

  async create(
    enrollmentData: CreateEnrollmentDTO,
  ): Promise<EnrollmentPresenter> {
    const newEnrollment = await this.enrollmentRepository.create(
      enrollmentData,
    );
    return new EnrollmentPresenter(newEnrollment);
  }

  async update(
    id: number,
    enrollmentData: UpdateEnrollmentDTO,
  ): Promise<EnrollmentPresenter> {
    const enrollment = await this.enrollmentRepository.update(
      id,
      enrollmentData,
    );
    return new EnrollmentPresenter(enrollment);
  }

  async activate(id: number): Promise<EnrollmentPresenter> {
    const updatedEnrollment = await this.update(id, {
      status: Status.ACTIVE,
    });
    return updatedEnrollment;
  }

  async deactivate(id: number): Promise<EnrollmentPresenter> {
    const updatedEnrollment = await this.update(id, {
      status: Status.DEACTIVE,
    });
    return updatedEnrollment;
  }

  async delete(id: number): Promise<void> {
    await this.enrollmentRepository.remove(id);
  }

  async statistics(
    start: Date,
    end: Date,
  ): Promise<{ date: Date; count: number }[]> {
    return this.enrollmentRepository.statistics(start, end);
  }
}
