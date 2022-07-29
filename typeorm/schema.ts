import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({unique: true})
  email: string

  @Column({nullable: true})
  name: string

  @OneToMany(() => Post, post => post.author)
  posts: Post[]

  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[]
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column({nullable: true, default: false})
  published: boolean

  @Column()
  title: string

  @Column({nullable: true})
  content: string

  @ManyToOne(() => User, user => user.posts)
  author: User

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[]
}

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number

  @Column({nullable: true})
  content: string

  @ManyToOne(() => User, user => user.comments, {cascade: true})
  author: User
  
  @ManyToOne(() => Post, post => post.comments, {cascade: true})
  post: Post
}
