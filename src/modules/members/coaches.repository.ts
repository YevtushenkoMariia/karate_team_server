import type { Db } from "../../shared";
import type { karate_level_type } from "../../../generated/prisma/client";

export type CoachData = {
  city_id: string | null;
  club_id: string | null;
  karate_level?: karate_level_type;
  position?: string;
  specialization?: string;
};

export class CoachesRepository {
  constructor(private readonly db: Db) {}

  async ensureExists(userId: string) {
    await this.db.coaches.upsert({
      where: { user_id: userId },
      update: {},
      create: { user_id: userId },
    });
  }

  async upsert(userId: string, data: CoachData) {
    await this.db.coaches.upsert({
      where: { user_id: userId },
      update: data,
      create: { user_id: userId, ...data },
    });
  }

  findByUserId(userId: string) {
    return this.db.coaches.findUnique({
      where: { user_id: userId },
      select: {
        karate_level: true,
        position: true,
        specialization: true,
        city_id: true,
        club_id: true,
      },
    });
  }
}
