import { AppDataSource } from "./datasource";
import { performance } from "perf_hooks";
import { Post, Comment } from "./typeorm/schema";
import { getRandomId } from "./utils";
import { In } from "typeorm";

async function fetchPosts() {
  const start = performance.now();
  const repo = AppDataSource.getRepository(Post);

  /*
  const posts = await repo.find({
    relations: {
      author: true,
      comments: true,
    },
    where: {
      author: {id: 1},
    }
  });
  */

  const posts = await repo
    .createQueryBuilder("post")
    .leftJoinAndSelect("post.author", "author")
    .leftJoinAndSelect("post.comments", "comments")
    .leftJoinAndSelect("comments.author", "comment_author")
    .where("post.id IN (:...ids)", {
      ids: [
        123, 420, 690, 6969, 6942, 1000, 3689, 3000, 2000, 2421, 23, 42, 96,
        101, 201, 301, 401, 501,
      ],
    })
    .getMany();
  // const posts = await repo.find({
  //   where: {
  //     id: In([
  //       123, 420, 690, 6969, 6942, 1000, 3689, 3000, 2000, 2421, 23, 42, 96,
  //       101, 201, 301, 401, 501,
  //     ]),
  //   },
  //   relations: ["author", "comments", "comments.author"],
  // });

  const timeTaken = performance.now() - start;

  console.log(
    "Time taken to fetch user posts with author and comments",
    timeTaken
  );
  console.log("Number of Posts fetched", posts.length);
}

async function fetchPostComments() {
  const postId = getRandomId(1, 4600);

  const start = performance.now();
  const repo = AppDataSource.getRepository(Comment);

  const comments = await repo.find({
    relations: {
      post: true,
      author: true,
    },
    where: {
      post: { id: postId },
    },
  });

  const timeTaken = performance.now() - start;

  console.log(
    "Time taken to fetch comments with post and author populated",
    timeTaken
  );
  console.log("comments fetched", comments.length);
}

async function main(n: number) {
  await AppDataSource.initialize();
  for (let i = 0; i < n; i++) {
    await fetchPosts();
  }
  console.log("\n-----------------------\n");
  for (let i = 0; i < n; i++) {
    await fetchPostComments();
  }
}

main(10);
