import { prisma } from "../lib/prisma";

export class SportsmenRepository {
  async upsertSportsmen(userId: number, sportsmenData: object) {
    await prisma.sportsmen.upsert({
      where: {
        user_id: userId,
      },
      update: sportsmenData,
      create: {
        user_id: userId,
        ...sportsmenData,
      },
    });
  }

  async buildSportsmenProfile(user: any) {
    if (!user || user.role !== "SPORTSMAN") {
      return null;
    }

    const coach = user.sportsmen?.coach_sportsman?.[0]?.coaches?.users ?? null;

    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      role: user.role,
      email: user.email,
      gender: user.gender,
      phone_number: user.phone_number,
      birth_date: user.birth_date,
      karate_level: user.sportsmen?.karate_level ?? null,
      city: user.sportsmen?.cities ?? null,
      club: user.sportsmen?.clubs ?? null,
      status: user.sportsmen?.status ?? null,
      coach,
    };
  }

  async findAll() {
    return prisma.sportsmen.findMany({
      
    });
  }

  async findById(id: number) {
    return prisma.sportsmen.findUnique({
      where: { user_id: id },
    });
  }
}



export const sportsmenRepository = new SportsmenRepository();
