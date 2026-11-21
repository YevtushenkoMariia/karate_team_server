import type { DbClient } from "../../shared";
import type {
  SportsmanData,
  SportsmanProfileRecord,
} from "./members.types";

export class SportsmenRepository {
  constructor(private readonly db: DbClient) {}

  async ensureExists(userId: string): Promise<void> {
    await this.db.sportsmen.upsert({
      where: { user_id: userId },
      update: {},
      create: { user_id: userId },
    });
  }

  async upsert(userId: string, data: SportsmanData): Promise<void> {
    await this.db.sportsmen.upsert({
      where: { user_id: userId },
      update: data,
      create: { user_id: userId, ...data },
    });
  }

  async isCoachOfSportsman(
    coachId: string,
    sportsmanId: string,
  ): Promise<boolean> {
    const assignment = await this.db.coach_sportsman.findFirst({
      where: { coach_id: coachId, sportsman_id: sportsmanId },
      select: { coach_id: true },
    });

    return assignment !== null;
  }

  findByUserId(userId: string): Promise<SportsmanProfileRecord | null> {
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
