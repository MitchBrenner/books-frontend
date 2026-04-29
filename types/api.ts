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
  coverUrl: string | null;
  pages: number | null;
};

export type UserBookStatus = "want_to_read" | "reading" | "read" | "dnf";

export type UserBook = {
  id: string;
  userId: string;
  bookId: string;
  status: UserBookStatus;
  rating?: number | null;
  review?: string | null;
  startedAt?: string | null;
  finishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  book?: Book;
};

export type CreateUserBookInput = {
  bookId: string;
  status: UserBookStatus;
  rating?: number | null;
  review?: string | null;
  startedAt?: string | null;
  finishedAt?: string | null;
};

export type UpdateUserBookInput = {
  status?: UserBookStatus;
  rating?: number | null;
  review?: string | null;
  startedAt?: string | null;
  finishedAt?: string | null;
};
