import { Static, Type } from "@sinclair/typebox";

export const ProfileQuery = Type.Object({
  userId: Type.String({ format: "uuid" }),
  role: Type.String(),
});

export const UpdateProfileBody = Type.Object({
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

export type ProfileQuery = Static<typeof ProfileQuery>;
export type UpdateProfileBody = Static<typeof UpdateProfileBody>;
