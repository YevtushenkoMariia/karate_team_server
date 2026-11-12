import type { Db } from "../../shared";
import type {
  karate_level_type,
  sportsman_role_type,
} from "../../../generated/prisma/client";

export type SportsmanData = {
  city_id: string | null;
  club_id: string | null;
  karate_level?: karate_level_type;
  status?: sportsman_role_type;
};

export class SportsmenRepository {
  constructor(private readonly db: Db) {}

  async ensureExists(userId: string) {
    await this.db.sportsmen.upsert({
      where: { user_id: userId },
      update: {},
      create: { user_id: userId },
    });
  }

  async upsert(userId: string, data: SportsmanData) {
    await this.db.sportsmen.upsert({
      where: { user_id: userId },
      update: data,
      create: { user_id: userId, ...data },
    });
  }

  findByUserId(userId: string) {
    return this.db.sportsmen.findUnique({
      where: { user_id: userId },
      select: {
        karate_level: true,
        status: true,
        city_id: true,
        club_id: true,
        coach_sportsman: {
          select: { coach_id: true },
          take: 1,
        },
      },
    });
  }
}
