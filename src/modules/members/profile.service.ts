import { role_type } from "../../../generated/prisma/client";
import { ForbiddenError, JwtUser, NotFoundError } from "../../shared";
import type { IdentityApi, UserSummary } from "../identity";
import type { LocationsApi } from "../locations";
import { SportsmenRepository } from "./sportsmen.repository";
import { CoachesRepository } from "./coaches.repository";
import { toKarateLevel, toSportsmanStatus } from "./karate";
import { ProfileQuery, UpdateProfileBody } from "./profile.schemas";

export class ProfileService {
  constructor(
    private readonly identity: IdentityApi,
    private readonly locations: LocationsApi,
    private readonly sportsmen: SportsmenRepository,
    private readonly coaches: CoachesRepository,
  ) {}

  async getProfile(query: ProfileQuery) {
    const user = await this.identity.findUserById(query.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.role !== query.role) {
      throw new ForbiddenError("User role does not match");
    }

    return this.buildProfile(user);
  }

  async updateProfile(authUser: JwtUser, body: UpdateProfileBody) {
    const user = await this.identity.findUserById(authUser.id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.role !== authUser.role) {
      throw new ForbiddenError("User role does not match");
    }

    // Validate enum-like input before writing anything.
    const karateLevel = toKarateLevel(body.karate_level);
    const sportsmanStatus = toSportsmanStatus(body.status);

    await this.identity.updateUser(user.id, {
      name: body.name,
      surname: body.surname,
      email: body.email,
      gender: body.gender,
      phone_number: body.phone_number,
      birth_date: body.birth_date ? new Date(body.birth_date) : undefined,
    });

    const cityId = body.city?.trim()
      ? await this.locations.findOrCreateCity(body.city.trim())
      : null;

    const clubId = body.club?.trim()
      ? await this.locations.findOrCreateClub(body.club.trim(), cityId)
      : null;

    if (user.role === role_type.COACH) {
      await this.coaches.upsert(user.id, {
        city_id: cityId,
        club_id: clubId,
        karate_level: karateLevel,
        position: body.position,
        specialization: body.specialization,
      });
    } else if (user.role === role_type.SPORTSMAN) {
      await this.sportsmen.upsert(user.id, {
        city_id: cityId,
        club_id: clubId,
        karate_level: karateLevel,
        status: sportsmanStatus,
      });
    }

    const updatedUser = await this.identity.findUserById(user.id);
    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    return this.buildProfile(updatedUser);
  }

  private async buildProfile(user: UserSummary) {
    const base = {
      id: user.id,
      name: user.name,
      surname: user.surname,
      role: user.role,
      email: user.email,
      gender: user.gender,
      phone_number: user.phone_number,
      birth_date: user.birth_date,
    };

    if (user.role === role_type.COACH) {
      const coach = await this.coaches.findByUserId(user.id);

      return {
        ...base,
        karate_level: coach?.karate_level ?? null,
        ...(await this.resolvePlaces(coach?.city_id, coach?.club_id)),
        position: coach?.position ?? null,
        specialization: coach?.specialization ?? null,
      };
    }

    if (user.role === role_type.SPORTSMAN) {
      const sportsman = await this.sportsmen.findByUserId(user.id);
      const coachId = sportsman?.coach_sportsman[0]?.coach_id;
      const coach = coachId ? await this.identity.findUserById(coachId) : null;

      return {
        ...base,
        karate_level: sportsman?.karate_level ?? null,
        ...(await this.resolvePlaces(sportsman?.city_id, sportsman?.club_id)),
        status: sportsman?.status ?? null,
        coach: coach
          ? { id: coach.id, name: coach.name, surname: coach.surname }
          : null,
      };
    }

    return base;
  }

  private async resolvePlaces(cityId?: string | null, clubId?: string | null) {
    const [city, club] = await Promise.all([
      cityId ? this.locations.findCityById(cityId) : null,
      clubId ? this.locations.findClubById(clubId) : null,
    ]);

    return { city, club };
  }
}
