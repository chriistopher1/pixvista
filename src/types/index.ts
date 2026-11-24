import { ReactElement } from "react";

export type INavLink = {
  imgURL: ReactElement;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUser = {
  accountId: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

/** Shared document fields returned by the MySQL API (Appwrite-compatible shape) */
export type ICreator = {
  $id: string;
  accountId: string;
  name: string;
  username: string;
  imageUrl: string;
};

export type IPost = {
  $id: string;
  caption: string;
  location: string;
  tags: string[];
  imageUrl: string;
  imageId: string;
  likes: IUserDocument[];
  creator: ICreator;
  $createdAt: string;
  $updatedAt: string;
};

export type ISaveRecord = {
  $id: string;
  post: IPost;
};

export type IUserDocument = {
  $id: string;
  accountId: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  imageUrl: string;
  imageId: string;
  $createdAt?: string;
  $updatedAt?: string;
  posts?: IPost[];
  save?: ISaveRecord[];
  liked?: IPost[];
};
