import { DataSource } from 'typeorm';

export const config = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: 'password',
  database: 'my-coach-db',
  url: 'postgres://root:password@localhost:5432/my-coach-db',
  entities: [__dirname + './../../../**/*.entity{.ts,.js}'],
  synchronize: false,
  schema: 'public',
});
