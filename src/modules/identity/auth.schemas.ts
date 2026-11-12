import { Static, Type } from "@sinclair/typebox";

export const RegisterBody = Type.Object({
  role: Type.Union([
    Type.Literal("ADMIN"),
    Type.Literal("COACH"),
    Type.Literal("SPORTSMAN"),
  ]),
  name: Type.String({ minLength: 1 }),
  surname: Type.String({ minLength: 1 }),
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 8 }),
  confirmPassword: Type.String({ minLength: 8 }),
});

export const LoginBody = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 8 }),
});

export type RegisterBody = Static<typeof RegisterBody>;
export type LoginBody = Static<typeof LoginBody>;
