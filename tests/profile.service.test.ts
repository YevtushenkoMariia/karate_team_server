import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Value } from "@sinclair/typebox/value";
import { role_type } from "../generated/prisma/client";
import type { IdentityApi, UserSummary } from "../src/modules/identity";
import type { LocationsApi } from "../src/modules/locations";
import { ProfileService } from "../src/modules/members/profile.service";
import type { SportsmanData } from "../src/modules/members/sportsmen.repository";
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
  const createdCities: string[] = [];
  const createdClubs: Array<{ name: string; cityId: string | null }> = [];

  const identity: IdentityApi = {
    findUserById: async () => user,
    findUsersByIds: async () => [],
    updateUser: async () => {},
  };
  const locations: LocationsApi = {
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

  return {
    service: new ProfileService(identity, locations, sportsmen, coaches),
    updates,
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

    assert.deepEqual(
      { city_id: updates[0]?.city_id, club_id: updates[0]?.club_id },
      { city_id: "city-existing", club_id: "club-existing" },
    );
    assert.deepEqual(createdCities, []);
    assert.deepEqual(createdClubs, []);
  });

  it("accepts null and clears city and club", async () => {
    const { service, updates } = createService();
    const body = { city: null, club: null };

    assert.equal(Value.Check(UpdateProfileBody, body), true);

    await service.updateProfile(
      { id: user.id, email: user.email, role: user.role },
      body,
    );

    assert.deepEqual(
      { city_id: updates[0]?.city_id, club_id: updates[0]?.club_id },
      { city_id: null, club_id: null },
    );
  });

  it("uses the current city when updating only the club", async () => {
    const { service, updates, createdCities, createdClubs } = createService();

    await service.updateProfile(
      { id: user.id, email: user.email, role: user.role },
      { club: "New club" },
    );

    assert.deepEqual(
      { city_id: updates[0]?.city_id, club_id: updates[0]?.club_id },
      { city_id: "city-existing", club_id: "club-created" },
    );
    assert.deepEqual(createdCities, []);
    assert.deepEqual(createdClubs, [
      { name: "New club", cityId: "city-existing" },
    ]);
  });
});
