import { Type, Static } from '@sinclair/typebox';


export const CreateSportsmenSchema = Type.Object({
  city: Type.String(),
  club: Type.String(),
  karate_level: Type.String(),
  role_status: Type.String(),
  coach: Type.String(),
  user_id: Type.Number(),
});

export const SportsmenParamsSchema = Type.Object({
  id: Type.String(),
});

export type CreateSportsmenBody = Static<typeof CreateSportsmenSchema>;
export type SportsmenParams = Static<typeof SportsmenParamsSchema>;
