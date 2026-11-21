import { describe, expect, it } from "vitest";
import { role_type } from "../generated/prisma/client";
import type { IdentityApi, UserSummary } from "../src/modules/identity";
import type { LocationsApi } from "../src/modules/locations";
import { ForbiddenError } from "../src/shared";
import { ProfileService } from "../src/modules/members/profile.service";
import type { SportsmanData } from "../src/modules/members/sportsmen.repository";
import type {
  ProfileTransactionRunner,
  ProfileUnitOfWork,
} from "../src/modules/members/profile.service";

const makeUser = (id: string, role: role_type): UserSummary => ({
  id,
  name: "First",
  surname: "Last",
  email: `${id}@example.com`,
  role,
  gender: null,
  phone_number: null,
  birth_date: null,
});

function createService(
  requester: UserSummary,
  member: UserSummary,
  isAssignedCoach = false,
) {
  const users = new Map([
    [requester.id, requester],
    [member.id, member],
  ]);
  const userLookups: string[] = [];

  const identity: IdentityApi = {
    withTransaction: () => identity,
    findUserById: async (id) => {
      userLookups.push(id);
      return users.get(id) ?? null;
    },
    findUsersByIds: async () => [],
    updateUser: async () => {},
  };
  const locations: LocationsApi = {
    withTransaction: () => locations,
    findCityById: async () => null,
    findClubById: async () => null,
    findOrCreateCity: async () => "city-id",
    findOrCreateClub: async () => "club-id",
  };
  const sportsmen = {
    findByUserId: async () => ({
      karate_level: null,
      status: null,
      city_id: null,
      club_id: null,
      coach_sportsman: [],
    }),
    isCoachOfSportsman: async (coachId: string, sportsmanId: string) =>
      isAssignedCoach &&
      coachId === requester.id &&
      sportsmanId === member.id,
    upsert: async (_userId: string, _data: SportsmanData) => {},
  };
  const coaches = {
    findByUserId: async () => null,
    upsert: async () => {},
  };
  const unitOfWork: ProfileUnitOfWork = {
    identity,
    locations,
    sportsmen,
    coaches,
  };
  const runProfileTransaction: ProfileTransactionRunner = async (operation) =>
    operation(unitOfWork);

  return {
    service: new ProfileService(unitOfWork, runProfileTransaction),
    userLookups,
  };
}

describe("ProfileService profile access", () => {
  const coachId = "00000000-0000-4000-8000-000000000001";
  const sportsmanId = "00000000-0000-4000-8000-000000000002";

  it("returns only the authenticated user's profile on the self endpoint", async () => {
    const requester = makeUser(sportsmanId, role_type.SPORTSMAN);
    const member = makeUser(coachId, role_type.COACH);
    const { service, userLookups } = createService(requester, member);

    const profile = await service.getProfile({
      id: requester.id,
      email: requester.email,
      role: requester.role,
    });

    expect(profile.id).toBe(requester.id);
    expect(userLookups).toEqual([requester.id]);
  });

  it("allows a coach to view an assigned sportsman", async () => {
    const coach = makeUser(coachId, role_type.COACH);
    const sportsman = makeUser(sportsmanId, role_type.SPORTSMAN);
    const { service } = createService(coach, sportsman, true);

    const profile = await service.getMemberProfile(
      { id: coach.id, email: coach.email, role: coach.role },
      sportsman.id,
    );

    expect(profile.id).toBe(sportsman.id);
  });

  it("denies a coach access to an unassigned sportsman", async () => {
    const coach = makeUser(coachId, role_type.COACH);
    const sportsman = makeUser(sportsmanId, role_type.SPORTSMAN);
    const { service } = createService(coach, sportsman);

    await expect(
      service.getMemberProfile(
        { id: coach.id, email: coach.email, role: coach.role },
        sportsman.id,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("allows an admin to view any member profile", async () => {
    const admin = makeUser(coachId, role_type.ADMIN);
    const member = makeUser(sportsmanId, role_type.SPORTSMAN);
    const { service } = createService(admin, member);

    const profile = await service.getMemberProfile(
      { id: admin.id, email: admin.email, role: admin.role },
      member.id,
    );

    expect(profile.id).toBe(member.id);
  });

  it("denies a sportsman access to other member profiles", async () => {
    const sportsman = makeUser(sportsmanId, role_type.SPORTSMAN);
    const otherMember = makeUser(coachId, role_type.COACH);
    const { service } = createService(sportsman, otherMember);

    await expect(
      service.getMemberProfile(
        {
          id: sportsman.id,
          email: sportsman.email,
          role: sportsman.role,
        },
        otherMember.id,
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});
