
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

    export type CreateUserBody = Static<typeof CreateUserSchema>;
export type UserParams = Static<typeof UserParamsSchema>;