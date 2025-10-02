import { Enrollment } from '../entities/enrollment.entity';
import { CreateEnrollmentDTO } from '../models/enrollment/dtos/create-enrollment.dto';
import { UpdateEnrollmentDTO } from '../models/enrollment/dtos/update-enrollment.dto';

export interface IEnrollmentRepository {
  findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ enrollments: Enrollment[]; count: number }>;

  getTotalCount(): Promise<number>;

  findOneById(id: number): Promise<Enrollment>;

  findOneBy(
    property: keyof Enrollment,
    value: any,
  ): Promise<Enrollment | undefined>;

  create(enrollmentData: CreateEnrollmentDTO): Promise<Enrollment>;

  update(id: number, enrollmentData: UpdateEnrollmentDTO): Promise<Enrollment>;

  remove(id: number): Promise<void>;

  statistics(start: Date, end: Date): Promise<{ date: Date; count: number }[]>;
}
