import { role_type } from "../../generated/prisma/client";
import { JwtUser } from "../plugins/auth";
import { ProfileBody, UpdateUserBody } from "../schemas/user";
import { UserRepository } from "../repositories/user";
import { AppError } from "../types/error";
import { coachRepository } from "../repositories/coach";
import { toKarateLevel, toSportsmanStatus } from "../utils/sportsmen";
import { sportsmenRepository } from "../repositories/sportsmen";
import { locationRepository } from "../repositories/locations";

const repository = new UserRepository();

export class UsersService {
  async getUserProfile(body: ProfileBody) {
    const userId = Number(body.userId);

    const isUserExists = await repository.IsUserExistsId(userId);
    const userRole = await repository.getUserRoleById(userId);

    if (!isUserExists) {
      throw new AppError("User not found", 404);
    }

    if (String(userRole) !== body.role) {
      throw new AppError("User role does not match", 403);
    }

    const userProfile = repository.getUserProfileById(userId);

    return userProfile;
  }

  async updateUserProfile(authUser: JwtUser, body: UpdateUserBody) {
    const userId = authUser.id;
    const role = authUser.role;

    const isUserExists = await repository.IsUserExistsId(userId);
    if (!isUserExists) {
      throw new AppError("User not found", 404);
    }

    const currentRole = await repository.getUserRoleById(userId);
    if (currentRole !== role) {
      throw new AppError("User role does not match", 403);
    }

    await repository.updateUserProfile({
      userId,
      role,
      name: body.name,
      surname: body.surname,
      email: body.email,
      gender: body.gender,
      phone_number: body.phone_number,
      birth_date: body.birth_date ? new Date(body.birth_date) : undefined,
    });

    const karateLevel = toKarateLevel(body.karate_level);
    const sportsmanStatus = toSportsmanStatus(body.status);

    let cityId: number | null = null;
    if (body.city?.trim()) {
      cityId = await locationRepository.findOrCreateCity(body.city.trim());
    }

    let clubId: number | null = null;
    if (body.club?.trim()) {
      clubId = await locationRepository.findOrCreateClub(
        body.club.trim(),
        cityId,
      );
    }

    if (role === role_type.COACH) {
      await coachRepository.upsertCoach(userId, {
        city_id: cityId,
        club_id: clubId,
        karate_level: karateLevel,
        position: body.position,
        specialization: body.specialization,
      });
    } else if (role === role_type.SPORTSMAN) {
      await sportsmenRepository.upsertSportsmen(userId, {
        city_id: cityId,
        club_id: clubId,
        karate_level: karateLevel,
        status: sportsmanStatus,
      });
    }

    return repository.getUserProfileById(userId);
  }
}
