import { role_type } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { toKarateLevel, toSportsmanStatus } from "../utils/sportsmen";
import { adminRepository } from "./admin";
import { coachRepository } from "./coach";
import { locationRepository } from "./locations";
import { sportsmenRepository } from "./sportsmen";

export class UserRepository {
  async createUser(data: {
    name: string;
    surname: string;
    email: string;
    password: string;
    role: role_type;
  }) {
    return prisma.$transaction(async (tx) => {
      // creating default user
      const user = await tx.users.create({
        data: {
          name: data.name,
          surname: data.surname,
          email: data.email,
          password: data.password,
          role: data.role,
        },
      });

      // create in db additional field in table according to the role
      if (data.role === "COACH") {
        await tx.coaches.create({
          data: {
            user_id: user.id,
          },
        });
      }

      if (data.role === "SPORTSMAN") {
        await tx.sportsmen.create({
          data: {
            user_id: user.id,
          },
        });
      }

      return user;
    });
  }

  async updateUserProfile(data: {
    userId: number;
    role: role_type;
    name?: string;
    surname?: string;
    email?: string;
    gender?: string;
    phone_number?: string;
    birth_date?: Date;
  }) {
    const { userId, ...updateData } = data;

    if (Object.keys(updateData).length > 0) {
      await prisma.users.update({
        where: { id: userId },
        data: updateData,
      });
    }
  }

  async IsUserExistsEmail(email: string) {
    return prisma.users.findUnique({
      where: { email: email },
    });
  }

  async IsUserExistsId(id: number) {
    return prisma.users.findUnique({
      where: { id: id },
    });
  }

  async getUserRoleById(id: number) {
    const user = await prisma.users.findUnique({
      where: { id: id },
      select: { role: true },
    });
    return user?.role;
  }

  private async getUserWithProfileRelations(id: number) {
    return prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        role: true,
        gender: true,
        phone_number: true,
        birth_date: true,
        sportsmen: {
          select: {
            karate_level: true,
            status: true,
            cities: {
              select: {
                id: true,
                name: true,
              },
            },
            clubs: {
              select: {
                id: true,
                name: true,
              },
            },
            coach_sportsman: {
              select: {
                coaches: {
                  select: {
                    users: {
                      select: {
                        id: true,
                        name: true,
                        surname: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        coaches: {
          select: {
            karate_level: true,
            position: true,
            specialization: true,
            cities: {
              select: {
                id: true,
                name: true,
              },
            },
            clubs: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async getUserProfileById(id: number) {
    const user = await this.getUserWithProfileRelations(id);

    if (!user) {
      return null;
    }

    if (user.role === "COACH") {
      return coachRepository.buildCoachProfile(user);
    }

    if (user.role === "SPORTSMAN") {
      return sportsmenRepository.buildSportsmenProfile(user);
    }

    return adminRepository.buildAdminProfile(user);
  }
}
