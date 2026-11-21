import type { DbClient } from "../../shared";
import type { CoachData, CoachProfileRecord } from "./members.types";

export class CoachesRepository {
  constructor(private readonly db: DbClient) {}

  async ensureExists(userId: string): Promise<void> {
    await this.db.coaches.upsert({
      where: { user_id: userId },
      update: {},
      create: { user_id: userId },
    });
  }

  async upsert(userId: string, data: CoachData): Promise<void> {
    await this.db.coaches.upsert({
      where: { user_id: userId },
      update: data,
      create: { user_id: userId, ...data },
    });
  }

  findByUserId(userId: string): Promise<CoachProfileRecord | null> {
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
