import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Account } from 'src/domain/entities/account.entity';
import { Category } from 'src/domain/entities/category.entity';
import { Coach } from 'src/domain/entities/coach.entity';
import { Enrollment } from 'src/domain/entities/enrollment.entity';
import { AccountRole } from 'src/domain/entities/enums/account-role.enum';
import { Gender } from 'src/domain/entities/enums/gender.enum';
import { MuscleName } from 'src/domain/entities/enums/muscle-name.enum';
import { Status } from 'src/domain/entities/enums/status.enum';
import { Exercise } from 'src/domain/entities/exercise.entity';
import { Gym } from 'src/domain/entities/gym.entity';
import { Membership } from 'src/domain/entities/membership.entity';
import { Player } from 'src/domain/entities/player.entity';
import { Training } from 'src/domain/entities/training.entity';
import { BcryptService } from 'src/infrastructure/services/bcrypt/bcrypt.service';
import { EntityManager } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    private bcrypt: BcryptService,
  ) {}

  private dateAftetOneMonth(current: Date): Date {
    const afterOneMonth = new Date(current);
    afterOneMonth.setMonth(current.getMonth() + 1);
    return afterOneMonth;
  }

  async seed() {
    const password = await this.bcrypt.hash('00aaBB##');
    const accounts = await this.entityManager.save(Account, [
      {
        password,
        email: 'account0@player.com',
        role: AccountRole.PLAYER,
        active: Status.ACTIVE,
        phoneNumber: '0912345678',
        profileImage: 'public/profile.jpg',
        coins: 100,
      },
      {
        password,
        email: 'account1@player.com',
        role: AccountRole.PLAYER,
        active: Status.ACTIVE,
        phoneNumber: '0912345678',
        profileImage: 'public/profile.jpg',
        coins: 100,
      },
      {
        password,
        email: 'account0@coach.com',
        role: AccountRole.COACH,
        active: Status.ACTIVE,
        phoneNumber: '0912345678',
        profileImage: 'public/profile.jpg',
        coins: 200,
      },
      {
        password,
        email: 'account1@coach.com',
        role: AccountRole.COACH,
        active: Status.ACTIVE,
        phoneNumber: '0912345678',
        profileImage: 'public/profile.jpg',
        coins: 200,
      },
      {
        password,
        email: 'account0@gymadmin.com',
        role: AccountRole.GYM_ADMIN,
        active: Status.ACTIVE,
        phoneNumber: '0912345678',
        profileImage: 'public/profile.jpg',
        coins: 111,
      },
      {
        password,
        email: 'account1@gymadmin.com',
        role: AccountRole.GYM_ADMIN,
        active: Status.ACTIVE,
        phoneNumber: '0912345678',
        profileImage: 'public/profile.jpg',
        coins: 200,
      },
    ]);
    const categories = await this.entityManager.save(Category, [
      {
        name: 'Body Building',
        icon: 'public/category.jpg',
      },
      {
        name: 'Crossfit',
        icon: 'public/category.jpg',
      },
    ]);
    const players = await this.entityManager.save(Player, [
      {
        firstName: 'John',
        lastName: 'Doe',
        age: 22,
        gender: Gender.MALE,
        weight: 70,
        height: 180,
        yearsOfPlaying: 5,
        about: 'Passionate about sports and a team player.',
        account: accounts[0],
      },
      {
        firstName: 'Emma',
        lastName: 'Johnson',
        age: 25,
        gender: Gender.FEMALE,
        weight: 60,
        height: 165,
        yearsOfPlaying: 7,
        about: 'Enjoys playing various sports and staying active.',
        account: accounts[1],
      },
    ]);
    const coaches = await this.entityManager.save(Coach, [
      {
        firstName: 'Sarah',
        lastName: 'Williams',
        age: 25,
        gender: Gender.FEMALE,
        yearsOfExperience: 3,
        certificatePath: 'public/certificate.pdf',
        about:
          'Passionate about fitness and helping others achieve their goals.',
        category: categories[0],
        account: accounts[2],
        price: 1000,
      },
      {
        firstName: 'Michael',
        lastName: 'Brown',
        age: 40,
        gender: Gender.MALE,
        yearsOfExperience: 15,
        certificatePath: 'public/certificate.pdf',
        about:
          'Former athlete with expertise in strength training and nutrition.',
        category: categories[0],
        account: accounts[3],
        price: 2000,
      },
    ]);
    const gyms = await this.entityManager.save(Gym, [
      {
        account: accounts[4],
        name: 'FitZone Gym',
        logo: 'public/logo.png',
        address: '123 Main Street',
        phoneNumber: '0912345678',
        latitude: 40.7128,
        longitude: -74.006,
        categories: [categories[0], categories[1]],
        openingTimes: [
          {
            day: 'Monday',
            startTime: '08:00 AM',
            endTime: '10:00 PM',
          },
          {
            day: 'Tuesday',
            startTime: '08:00 AM',
            endTime: '10:00 PM',
          },
        ],
        price: 3000,
      },
      {
        account: accounts[5],
        name: 'CrossFit Central',
        logo: 'public/logo.png',
        address: '456 Oak Avenue',
        phoneNumber: '0987654321',
        latitude: 34.0522,
        longitude: -118.2437,
        categories: [categories[0]],
        openingTimes: [
          {
            day: 'Monday',
            startTime: '07:00 AM',
            endTime: '09:00 PM',
          },
          {
            day: 'Wednesday',
            startTime: '07:00 AM',
            endTime: '09:00 PM',
          },
        ],
        price: 5000,
      },
    ]);
    const exercises = await this.entityManager.save(Exercise, [
      {
        name: 'Bench Press',
        description:
          'Lay flat on a bench and push a barbell away from your chest.',
        video: 'https://youtu.be/UAdnMPt5i0w',
        muscle: MuscleName.CHEST,
      },
      {
        name: 'Squat',
        description:
          'Stand with a barbell on your shoulders and lower down into a sitting position.',
        video: 'https://youtu.be/UAdnMPt5i0w',
        muscle: MuscleName.LEGS,
      },
      {
        name: 'Pull-up',
        description:
          'Hang from a bar and pull yourself up until your chin is above the bar.',
        video: 'https://youtu.be/UAdnMPt5i0w',
        muscle: MuscleName.BACK,
      },
      {
        name: 'Plank',
        description:
          'Hold a push-up position with your arms straight and body in a straight line.',
        muscle: MuscleName.CORE,
      },
    ]);
    const enrollments = await this.entityManager.save(Enrollment, [
      {
        coach: coaches[0],
        gym: gyms[0],
        status: Status.ACTIVE,
        salary: 10000,
        shiftTimes: [
          {
            day: 'Monday',
            startTime: '08:00 AM',
            endTime: '10:00 PM',
          },
          {
            day: 'Rest of The Week',
            startTime: '09:00 AM',
            endTime: '12:00 PM',
          },
        ],
      },
      {
        coach: coaches[1],
        gym: gyms[1],
        status: Status.DEACTIVE,
        salary: 10000,
        shiftTimes: [
          {
            day: 'Monday',
            startTime: '08:00 AM',
            endTime: '10:00 PM',
          },
          {
            day: 'Rest of The Week',
            startTime: '09:00 AM',
            endTime: '12:00 PM',
          },
        ],
      },
    ]);
    const memberships = await this.entityManager.save(Membership, [
      {
        player: players[0],
        gym: gyms[0],
        status: Status.ACTIVE,
        paid: 1000,
        fee: 2000,
        startDate: new Date(),
        endDate: this.dateAftetOneMonth(new Date()),
      },
      {
        player: players[1],
        gym: gyms[1],
        status: Status.DEACTIVE,
        paid: 2000,
        fee: 2000,
        startDate: new Date(),
        endDate: this.dateAftetOneMonth(new Date()),
      },
    ]);
    const trainings = await this.entityManager.save(Training, [
      {
        player: players[0],
        coach: coaches[0],
        status: Status.PENDING,
        startDate: new Date(),
      },
      {
        player: players[0],
        coach: coaches[1],
        status: Status.ACCEPT,
        startDate: new Date(),
      },
      {
        player: players[1],
        coach: coaches[0],
        status: Status.REJECT,
        startDate: new Date(),
      },
      {
        player: players[1],
        coach: coaches[1],
        status: Status.ACCEPT,
        startDate: new Date(),
      },
    ]);
  }
}
