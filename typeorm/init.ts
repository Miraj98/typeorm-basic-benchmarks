import { nanoid } from "nanoid";
import { performance } from "perf_hooks";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { AppDataSource } from "../datasource";
import { getRandomId } from "../utils";
import { Comment, Post, User } from "./schema";

async function initDatabase() {
  await AppDataSource.initialize();
}

export async function createUsers(n: number) {
  const usersData: User[] = [];

  for (let i = 0; i < n; i++) {
    const user = new User();
    user.email = `${nanoid()}@hallparty.app`;
    user.name = `Name-${nanoid()}`;
    usersData.push(user);
  }

  const resp = await AppDataSource.createQueryBuilder()
    .insert()
    .into(User)
    .values(usersData)
    .execute();

  console.log("Created", resp.identifiers.length, "users");
}

export async function createPosts(n: number) {
  const usersCount = 10000;
  const postData: QueryDeepPartialEntity<Post>[] = [];

  for (let i = 0; i < n; i++) {
    const authorId = getRandomId(1, usersCount);
    postData.push({
      title: `Title-${nanoid()}`,
      content: `Content-${nanoid()}`,
      author: { id: authorId },
    });
  }

  const resp = await AppDataSource.createQueryBuilder()
    .insert()
    .into(Post)
    .values(postData)
    .execute();

  console.log("Created", resp.identifiers.length, "posts");
}

export async function createComments(n: number) {
  const usersCount = 10000;
  const postsCount = 10000;
  const commentData: QueryDeepPartialEntity<Comment>[] = [];

  console.log("User count", usersCount);
  console.log("Post count", postsCount);

  for (let i = 0; i < n; i++) {
    let postId = getRandomId(1, postsCount);
    let authorId = getRandomId(1, usersCount);

    commentData.push({
      content: `Comment content-${nanoid()}`,
      author: { id: authorId },
      post: { id: postId },
    });
  }

  const resp = await AppDataSource.createQueryBuilder()
    .insert()
    .into(Comment)
    .values(commentData)
    .execute();

  console.log("Created", resp.identifiers.length, "comments");
}

async function main() {
  const start = performance.now();
  await initDatabase();
  const afterInit = performance.now();
  await createUsers(10000);
  await createPosts(10000);
  await createComments(10000);
  const fromStart = performance.now() - start;
  const onlyInsertTime = performance.now() - afterInit;

  console.log("Time taken from init", fromStart, "ms");
  console.log("Time taken after init", onlyInsertTime, "ms");
}

main();
