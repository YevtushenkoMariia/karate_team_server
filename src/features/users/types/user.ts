import { Type, Static } from '@sinclair/typebox';
import {
  karate_level_type,
  role_type,
} from "../../../../generated/prisma/client";

export const CreateUserSchema = Type.Object({
  birthday: Type.String(),
  name: Type.String(),
  surname: Type.String(),
  email: Type.String(),
  gender: Type.String(),
  password: Type.String(),
  phone_number: Type.String(),
  role: Type.String(),
});

export const UserParamsSchema = Type.Object({
  id: Type.String(),
});

export const UserProfileSchema = Type.Object({
  userId: Type.String(),
  role: Type.String(),
});

export const UpdateUserProfileSchema = Type.Object({
  name: Type.Optional(Type.String()),
  surname: Type.Optional(Type.String()),
  email: Type.Optional(Type.String()),
  gender: Type.Optional(Type.String()),
  phone_number: Type.Optional(Type.String()),
  birth_date: Type.Optional(Type.String()),
  city: Type.Optional(Type.String()),
  club: Type.Optional(Type.String()),
  karate_level: Type.Optional(Type.String()),
  position: Type.Optional(Type.String()),
  specialization: Type.Optional(Type.String()),
  status: Type.Optional(Type.String()),
});

export type CreateUserBody = Static<typeof CreateUserSchema>;
export type UserParams = Static<typeof UserParamsSchema>;
export type ProfileBody = Static<typeof UserProfileSchema>;
export type UpdateUserBody = Static<typeof UpdateUserProfileSchema>;

export type GetUserProfileRequest = {
  userId: string;
  role: string;
};

export type UpdateUserProfileRequest = {
  userId: string;
  role: role_type;
  name?: string;
  surname?: string;
  email?: string;
  gender?: string;
  phone_number?: string;
  birth_date?: string;
  city?: string;
  club?: string;
  karate_level?: string;
  position?: string;
  specialization?: string;
  status?: string;
};

export type CreateUserRequest = {
  name: string;
  surname: string;
  email: string;
  password: string;
  role: role_type;
};

export type UpdateUserProfileData = {
  userId: string;
  role: role_type;
  name?: string;
  surname?: string;
  email?: string;
  gender?: string;
  phone_number?: string;
  birth_date?: Date;
};

export type UserIdRequest = {
  userId: string;
};

export type EmailRequest = {
  email: string;
};

export type UpsertCoachRequest = {
  userId: string;
  city_id: string | null;
  club_id: string | null;
  karate_level?: karate_level_type;
  position?: string;
  specialization?: string;
};
