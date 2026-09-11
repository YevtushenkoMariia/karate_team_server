import { role_type } from "../../../../generated/prisma/client";
import { prisma } from "../../../shared/lib";
import { adminRepository } from "./admin";
import { coachRepository } from "./coach";
import { sportsmenRepository } from "../../sportsmen/repositories";

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
    userId: string;
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
    if (!email) {
      return null;
    }

    return prisma.users.findUnique({
      where: { email: email },
    });
  }

  async IsUserExistsId(userId: string) {
    if (!userId) {
      return null;
    }
    return prisma.users.findUnique({
      where: { id: userId },
    });
  }

  async getUserRoleById(userId: string) {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    return user?.role;
  }

  private async getUserWithProfileRelations(userId: string) {
    return prisma.users.findUnique({
      where: { id: userId },
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

  async getUserProfileById(userId: string) {
    const user = await this.getUserWithProfileRelations(userId);

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
