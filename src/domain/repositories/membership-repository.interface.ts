import { Membership } from '../entities/membership.entity';
import { CreateMembershipDTO } from '../models/membership/dtos/create-membership.dto';
import { UpdateMembershipDTO } from '../models/membership/dtos/update-membership.dto';

export interface IMembershipRepository {
  findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ memberships: Membership[]; count: number }>;

  getTotalCount(): Promise<number>;

  findOneById(id: number): Promise<Membership>;

  findOneBy(
    property: keyof Membership,
    value: any,
  ): Promise<Membership | undefined>;

  create(membershipData: CreateMembershipDTO): Promise<Membership>;

  update(id: number, membershipData: UpdateMembershipDTO): Promise<Membership>;

  remove(id: number): Promise<void>;

  statistics(start: Date, end: Date): Promise<{ date: Date; count: number }[]>;
}
