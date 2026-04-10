// USER TYPES

export type User = {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
};

export type CreateUserInput = {
  username: string;
  firstName?: string;
  lastName?: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  year: number | null;
  coverId: number | null;
};
