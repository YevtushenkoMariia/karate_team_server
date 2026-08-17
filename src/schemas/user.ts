
import { Type, Static } from '@sinclair/typebox';

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
