import type {
  role_type,
  user_status_type,
} from "../../../generated/prisma/client";

export type UserSummary = {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: role_type;
  gender: string | null;
  phone_number: string | null;
  birth_date: Date | null;
};

export type UserRecord = UserSummary & {
  password: string;
  status: user_status_type;
  created_at: Date;
  updated_at: Date;
  email_verified: boolean;
};

export type CreateUserData = {
  name: string;
  surname: string;
  email: string;
  password: string;
  role: role_type;
};

export type UpdateUserData = {
  name?: string;
  surname?: string;
  email?: string;
  gender?: string;
  phone_number?: string;
  birth_date?: Date;
};

export type AuthUserStore = {
  findByEmail(email: string): Promise<UserRecord | null>;
  create(data: CreateUserData): Promise<UserRecord>;
};

export type PublicUser = Omit<UserRecord, "password">;

export type RegisterResult = {
  success: true;
  message: "User registered successfully";
  code: 201;
  user: PublicUser;
  token: string;
};

export type LoginResult = {
  success: true;
  message: "User logged in successfully";
  code: 200;
  user: PublicUser;
  token: string;
};
