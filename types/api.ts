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
