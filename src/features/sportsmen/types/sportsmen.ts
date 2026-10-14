import { Type, Static } from '@sinclair/typebox';
import {
  karate_level_type,
  sportsman_role_type,
} from "../../../../generated/prisma/client";


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

export type GetSportsmenByIdRequest = {
  id: string;
};

export type CreateSportsmenRequest = {
  city: string;
  club: string;
  karate_level: string;
  role_status: string;
  coach: string;
  user_id: number;
};

export type UpsertSportsmenRequest = {
  userId: string;
  city_id: string | null;
  club_id: string | null;
  karate_level?: karate_level_type;
  status?: sportsman_role_type;
};
