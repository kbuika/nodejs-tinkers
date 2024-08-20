import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { dbName, dbPassword, dbUsername } from "./config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: dbUsername,
  password: dbPassword,
  database: dbName,
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
