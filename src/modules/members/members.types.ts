import type {
  gender_type,
  karate_level_type,
  sportsman_role_type,
} from "../../../generated/prisma/client";
import type { Place } from "../locations";

export type SportsmanData = {
  city_id: string | null;
  club_id: string | null;
  karate_level?: karate_level_type;
  status?: sportsman_role_type;
};

export type CoachData = {
  city_id: string | null;
  club_id: string | null;
  karate_level?: karate_level_type;
  position?: string;
  specialization?: string;
};

export type SportsmanProfileRecord = {
  karate_level: karate_level_type | null;
  status: sportsman_role_type | null;
  city_id: string | null;
  club_id: string | null;
  coach_sportsman: { coach_id: string }[];
};

export type CoachProfileRecord = {
  karate_level: karate_level_type | null;
  position: string | null;
  specialization: string | null;
  city_id: string | null;
  club_id: string | null;
};

export type ProfileIdentityDto = {
  id: string;
  name: string;
  surname: string;
  email: string;
  gender: gender_type | null;
  phone_number: string | null;
  birth_date: Date | null;
};

export type CoachSummaryDto = {
  id: string;
  name: string;
  surname: string;
};

export type AdminProfileDto = ProfileIdentityDto & { role: "ADMIN" };

export type CoachProfileDto = ProfileIdentityDto & {
  role: "COACH";
  karate_level: karate_level_type | null;
  city: Place | null;
  club: Place | null;
  position: string | null;
  specialization: string | null;
};

export type SportsmanProfileDto = ProfileIdentityDto & {
  role: "SPORTSMAN";
  karate_level: karate_level_type | null;
  city: Place | null;
  club: Place | null;
  status: sportsman_role_type | null;
  coach: CoachSummaryDto | null;
};

export type MemberProfileDto =
  | AdminProfileDto
  | CoachProfileDto
  | SportsmanProfileDto;
