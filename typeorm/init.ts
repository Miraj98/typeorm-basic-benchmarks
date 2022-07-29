import {DataSource} from 'typeorm'
import {User, Post, Comment} from '../typeorm/schema'
import {nanoid} from 'nanoid'
import { performance } from 'perf_hooks'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

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
})

async function initDatabase() {
  await AppDataSource.initialize()
}

export function getRandomId(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export async function createUsers(n: number) {
  const usersData: User[] = []

  for (let i = 0; i < n; i++) {
    const user = new User()
    user.email = `${nanoid()}@hallparty.app`
    user.name =`Name-${nanoid()}`
    usersData.push(user)
  }

  const resp = await AppDataSource.createQueryBuilder().insert().into(User).values(usersData).execute()

  console.log("Created", resp.identifiers.length, "users");
}

export async function createPosts(n: number) {
  const usersCount = 10000
  const postData: QueryDeepPartialEntity<Post>[] = []

  for (let i = 0; i < n; i++) {
    const authorId = getRandomId(1, usersCount);
    postData.push({
      title: `Title-${nanoid()}`,
      content: `Content-${nanoid()}`,
      author: {id: 1}
    })
  }

  const resp = await AppDataSource.createQueryBuilder().insert().into(Post).values(postData).execute()

  console.log("Created", resp.identifiers.length, "posts");
}

export async function createComments(n: number) {
  const usersCount = 10000
  const postsCount = 4600
  const commentData: QueryDeepPartialEntity<Comment>[] = []

  console.log("User count", usersCount)
  console.log("Post count", postsCount);

  for (let i = 0; i < n; i++) {
    let postId = getRandomId(1, postsCount);
    let authorId = getRandomId(1, usersCount);

    commentData.push({
      content: `Comment content-${nanoid()}`,
      author: {id: authorId},
      post: {id: postId},
    })
  }
  
  const resp = await AppDataSource.createQueryBuilder().insert().into(Comment).values(commentData).execute()

  console.log("Created", resp.identifiers.length, "comments");
}


async function main() {
  const start = performance.now()
  await initDatabase()
  const afterInit = performance.now()
  // await createUsers(10000)
  // await createPosts(4600)
  await createComments(4620)
  const fromStart = performance.now() - start
  const onlyInsertTime = performance.now() - afterInit
  
  console.log("Time taken from init", fromStart, "ms");
  console.log("Time taken after init", onlyInsertTime, "ms");
}

// main()


