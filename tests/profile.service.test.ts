import { describe, expect, it } from "vitest";
import { Value } from "@sinclair/typebox/value";
import { role_type } from "../generated/prisma/client";
import type {
  IdentityApi,
  UpdateUserData,
  UserSummary,
} from "../src/modules/identity";
import type { LocationsApi } from "../src/modules/locations";
import { BadRequestError } from "../src/shared";
import { ProfileService } from "../src/modules/members/profile.service";
import type {
  ProfileTransactionRunner,
  ProfileUnitOfWork,
} from "../src/modules/members/profile.service";
import type { SportsmanData } from "../src/modules/members/members.types";
import { UpdateProfileBody } from "../src/modules/members/profile.schemas";

const user: UserSummary = {
  id: "user-id",
  name: "First",
  surname: "Last",
  email: "user@example.com",
  role: role_type.SPORTSMAN,
  gender: null,
  phone_number: null,
  birth_date: null,
};

function createService() {
  let savedPlaces: { city_id: string | null; club_id: string | null } = {
    city_id: "city-existing",
    club_id: "club-existing",
  };
  const updates: SportsmanData[] = [];
  const userUpdates: UpdateUserData[] = [];
  const createdCities: string[] = [];
  const createdClubs: Array<{ name: string; cityId: string | null }> = [];

  const identity: IdentityApi = {
    withTransaction: () => identity,
    findUserById: async () => user,
    findUsersByIds: async () => [],
    updateUser: async (_userId, data) => {
      userUpdates.push(data);
    },
  };
  const locations: LocationsApi = {
    withTransaction: () => locations,
    findCityById: async (id) => ({ id, name: id }),
    findClubById: async (id) => ({ id, name: id }),
    findOrCreateCity: async (name) => {
      createdCities.push(name);
      return "city-created";
    },
    findOrCreateClub: async (name, cityId) => {
      createdClubs.push({ name, cityId });
      return "club-created";
    },
  };
  const sportsmen = {
    findByUserId: async () => ({
      karate_level: null,
      status: null,
      city_id: savedPlaces.city_id,
      club_id: savedPlaces.club_id,
      coach_sportsman: [],
    }),
    isCoachOfSportsman: async () => false,
    upsert: async (_userId: string, data: SportsmanData) => {
      updates.push(data);
      savedPlaces = { city_id: data.city_id, club_id: data.club_id };
    },
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
    updates,
    userUpdates,
    createdCities,
    createdClubs,
  };
}

describe("ProfileService.updateProfile locations", () => {
  it("preserves city and club when omitted", async () => {
    const { service, updates, createdCities, createdClubs } = createService();

    await service.updateProfile(
      { id: user.id, email: user.email, role: user.role },
      {},
    );

    expect(
      { city_id: updates[0]?.city_id, club_id: updates[0]?.club_id },
    ).toEqual({ city_id: "city-existing", club_id: "club-existing" });
    expect(createdCities).toEqual([]);
    expect(createdClubs).toEqual([]);
  });

  it("accepts null and clears city and club", async () => {
    const { service, updates } = createService();
    const body = { city: null, club: null };

    expect(Value.Check(UpdateProfileBody, body)).toBe(true);

    await service.updateProfile(
      { id: user.id, email: user.email, role: user.role },
      body,
    );

    expect(
      { city_id: updates[0]?.city_id, club_id: updates[0]?.club_id },
    ).toEqual({ city_id: null, club_id: null });
  });

  it("uses the current city when updating only the club", async () => {
    const { service, updates, createdCities, createdClubs } = createService();

    await service.updateProfile(
      { id: user.id, email: user.email, role: user.role },
      { club: "New club" },
    );

    expect(
      { city_id: updates[0]?.city_id, club_id: updates[0]?.club_id },
    ).toEqual({ city_id: "city-existing", club_id: "club-created" });
    expect(createdCities).toEqual([]);
    expect(createdClubs).toEqual([
      { name: "New club", cityId: "city-existing" },
    ]);
  });
});

describe("ProfileService.updateProfile birth_date", () => {
  it("accepts a valid date within the allowed range", async () => {
    const { service, userUpdates } = createService();
    const today = new Date().toISOString().slice(0, 10);
    const earliest = new Date(`${today}T00:00:00.000Z`);
    earliest.setUTCFullYear(earliest.getUTCFullYear() - 120);
    const earliestDate = earliest.toISOString().slice(0, 10);

    await service.updateProfile(
      { id: user.id, email: user.email, role: user.role },
      { birth_date: today },
    );
    await service.updateProfile(
      { id: user.id, email: user.email, role: user.role },
      { birth_date: earliestDate },
    );

    expect(
      userUpdates.map((update) => update.birth_date?.toISOString().slice(0, 10)),
    ).toEqual([today, earliestDate]);
  });

  it("rejects impossible calendar dates", async () => {
    const { service } = createService();

    await expect(
      service.updateProfile(
        { id: user.id, email: user.email, role: user.role },
        { birth_date: "2024-02-30" },
      ),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it("rejects future dates", async () => {
    const { service } = createService();
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    await expect(
      service.updateProfile(
        { id: user.id, email: user.email, role: user.role },
        { birth_date: tomorrow.toISOString().slice(0, 10) },
      ),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it("rejects dates more than 120 years ago", async () => {
    const { service } = createService();
    const today = new Date().toISOString().slice(0, 10);
    const earliest = new Date(`${today}T00:00:00.000Z`);
    earliest.setUTCFullYear(earliest.getUTCFullYear() - 120);
    earliest.setUTCDate(earliest.getUTCDate() - 1);

    await expect(
      service.updateProfile(
        { id: user.id, email: user.email, role: user.role },
        { birth_date: earliest.toISOString().slice(0, 10) },
      ),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
