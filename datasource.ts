import { DataSource } from "typeorm";
import { Comment, Post, User } from "./typeorm/schema";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "mirajshah",
  password: "mirajshah",
  database: "typeorm-test",
  synchronize: true,
  entities: [User, Post, Comment],
  subscribers: [],
  migrations: [],
});
