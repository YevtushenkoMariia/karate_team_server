import { role_type } from "../../../generated/prisma/client";
import {
  BadRequestError,
  ForbiddenError,
  JwtUser,
  NotFoundError,
} from "../../shared";
import type { IdentityApi, UserSummary } from "../identity";
import type { LocationsApi, Place } from "../locations";
import type {
  CoachData,
  CoachProfileRecord,
  MemberProfileDto,
  ProfileIdentityDto,
  SportsmanData,
  SportsmanProfileRecord,
} from "./members.types";
import { toKarateLevel, toSportsmanStatus } from "./karate";
import { UpdateProfileBody } from "./profile.schemas";

export type SportsmanProfileStore = {
  findByUserId(userId: string): Promise<SportsmanProfileRecord | null>;
  upsert(userId: string, data: SportsmanData): Promise<void>;
  isCoachOfSportsman(coachId: string, sportsmanId: string): Promise<boolean>;
};

export type CoachProfileStore = {
  findByUserId(userId: string): Promise<CoachProfileRecord | null>;
  upsert(userId: string, data: CoachData): Promise<void>;
};

export type ProfileUnitOfWork = {
  identity: IdentityApi;
  locations: LocationsApi;
  sportsmen: SportsmanProfileStore;
  coaches: CoachProfileStore;
};

export type ProfileTransactionRunner = <T>(
  operation: (unitOfWork: ProfileUnitOfWork) => Promise<T>,
) => Promise<T>;

function parseBirthDate(value?: string): Date | undefined {
  if (value === undefined) {
    return undefined;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new BadRequestError("birth_date must be a valid date in YYYY-MM-DD format");
  }

  const today = new Date().toISOString().slice(0, 10);
  const earliest = new Date(`${today}T00:00:00.000Z`);
  earliest.setUTCFullYear(earliest.getUTCFullYear() - 120);
  const earliestDate = earliest.toISOString().slice(0, 10);

  if (value < earliestDate || value > today) {
    throw new BadRequestError(
      `birth_date must be between ${earliestDate} and ${today}`,
    );
  }

  return date;
}

export class ProfileService {
  constructor(
    private readonly root: ProfileUnitOfWork,
    private readonly runProfileTransaction: ProfileTransactionRunner,
  ) {}

  async getProfile(authUser: JwtUser): Promise<MemberProfileDto> {
    const user = await this.root.identity.findUserById(authUser.id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.role !== authUser.role) {
      throw new ForbiddenError("User role does not match");
    }

    return this.buildProfile(user);
  }

  async getMemberProfile(
    authUser: JwtUser,
    memberId: string,
  ): Promise<MemberProfileDto> {
    const requester = await this.root.identity.findUserById(authUser.id);
    if (!requester) {
      throw new NotFoundError("User not found");
    }

    if (requester.role !== authUser.role) {
      throw new ForbiddenError("User role does not match");
    }

    const member = await this.root.identity.findUserById(memberId);
    if (!member) {
      throw new NotFoundError("User not found");
    }

    const canView =
      requester.role === role_type.ADMIN ||
      (requester.role === role_type.COACH &&
        member.role === role_type.SPORTSMAN &&
        (await this.root.sportsmen.isCoachOfSportsman(
          requester.id,
          member.id,
        )));

    if (!canView) {
      throw new ForbiddenError("You cannot view this profile");
    }

    return this.buildProfile(member);
  }

  async updateProfile(
    authUser: JwtUser,
    body: UpdateProfileBody,
  ): Promise<MemberProfileDto> {
    return this.runProfileTransaction(async (unitOfWork) => {
      const { identity, locations, sportsmen, coaches } = unitOfWork;
      const user = await identity.findUserById(authUser.id);
      if (!user) {
        throw new NotFoundError("User not found");
      }

      if (user.role !== authUser.role) {
        throw new ForbiddenError("User role does not match");
      }

      // Validate enum-like input before writing anything.
      const karateLevel = toKarateLevel(body.karate_level);
      const sportsmanStatus = toSportsmanStatus(body.status);
      const birthDate = parseBirthDate(body.birth_date);

      const currentProfile = await this.findCurrentMemberProfile(
        user.id,
        user.role,
        unitOfWork,
      );

      await identity.updateUser(user.id, {
        name: body.name,
        surname: body.surname,
        email: body.email,
        gender: body.gender,
        phone_number: body.phone_number,
        birth_date: birthDate,
      });

      const cityId =
        body.city === undefined
          ? (currentProfile?.city_id ?? null)
          : body.city?.trim()
            ? await locations.findOrCreateCity(body.city.trim())
            : null;

      const clubId =
        body.club === undefined
          ? (currentProfile?.club_id ?? null)
          : body.club?.trim()
            ? await locations.findOrCreateClub(body.club.trim(), cityId)
            : null;

      if (user.role === role_type.COACH) {
        await coaches.upsert(user.id, {
          city_id: cityId,
          club_id: clubId,
          karate_level: karateLevel,
          position: body.position,
          specialization: body.specialization,
        });
      } else if (user.role === role_type.SPORTSMAN) {
        await sportsmen.upsert(user.id, {
          city_id: cityId,
          club_id: clubId,
          karate_level: karateLevel,
          status: sportsmanStatus,
        });
      }

      const updatedUser = await identity.findUserById(user.id);
      if (!updatedUser) {
        throw new NotFoundError("User not found");
      }

      return this.buildProfile(updatedUser, unitOfWork);
    });
  }

  private async buildProfile(
    user: UserSummary,
    unitOfWork: ProfileUnitOfWork = this.root,
  ): Promise<MemberProfileDto> {
    const base: ProfileIdentityDto = {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      gender: user.gender,
      phone_number: user.phone_number,
      birth_date: user.birth_date,
    };

    if (user.role === role_type.COACH) {
      const coach = await unitOfWork.coaches.findByUserId(user.id);

      return {
        ...base,
        role: "COACH",
        karate_level: coach?.karate_level ?? null,
        ...(await this.resolvePlaces(coach?.city_id, coach?.club_id, unitOfWork)),
        position: coach?.position ?? null,
        specialization: coach?.specialization ?? null,
      };
    }

    if (user.role === role_type.SPORTSMAN) {
      const sportsman = await unitOfWork.sportsmen.findByUserId(user.id);
      const coachId = sportsman?.coach_sportsman[0]?.coach_id;
      const coach = coachId
        ? await unitOfWork.identity.findUserById(coachId)
        : null;

      return {
        ...base,
        role: "SPORTSMAN",
        karate_level: sportsman?.karate_level ?? null,
        ...(await this.resolvePlaces(
          sportsman?.city_id,
          sportsman?.club_id,
          unitOfWork,
        )),
        status: sportsman?.status ?? null,
        coach: coach
          ? { id: coach.id, name: coach.name, surname: coach.surname }
          : null,
      };
    }

    return { ...base, role: "ADMIN" };
  }

  private async findCurrentMemberProfile(
    userId: string,
    role: role_type,
    unitOfWork: ProfileUnitOfWork = this.root,
  ): Promise<CoachProfileRecord | SportsmanProfileRecord | null> {
    if (role === role_type.COACH) {
      return unitOfWork.coaches.findByUserId(userId);
    }

    if (role === role_type.SPORTSMAN) {
      return unitOfWork.sportsmen.findByUserId(userId);
    }

    return null;
  }

  private async resolvePlaces(
    cityId?: string | null,
    clubId?: string | null,
    unitOfWork: ProfileUnitOfWork = this.root,
  ): Promise<{ city: Place | null; club: Place | null }> {
    const [city, club] = await Promise.all([
      cityId ? unitOfWork.locations.findCityById(cityId) : null,
      clubId ? unitOfWork.locations.findClubById(clubId) : null,
    ]);

    return { city, club };
  }
}
