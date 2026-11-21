import { Static, Type } from "@sinclair/typebox";

export const MemberProfileParams = Type.Object({
  userId: Type.String({ format: "uuid" }),
});

export const UpdateProfileBody = Type.Object({
  name: Type.Optional(Type.String()),
  surname: Type.Optional(Type.String()),
  email: Type.Optional(Type.String()),
  gender: Type.Optional(Type.String()),
  phone_number: Type.Optional(Type.String()),
  birth_date: Type.Optional(Type.String({ format: "date" })),
  city: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  club: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  karate_level: Type.Optional(Type.String()),
  position: Type.Optional(Type.String()),
  specialization: Type.Optional(Type.String()),
  status: Type.Optional(Type.String()),
});

export type MemberProfileParams = Static<typeof MemberProfileParams>;
export type UpdateProfileBody = Static<typeof UpdateProfileBody>;
