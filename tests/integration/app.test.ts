import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildApp } from "../../src/app";
import type { AppConfig } from "../../src/config";
import { createTestDb, existingMemberId } from "../helpers/test-db";

const config: AppConfig = {
  port: 4000,
  databaseUrl: "postgresql://unused:unused@localhost/test",
  jwtSecret: "integration-test-secret",
  jwtExpiresIn: "1h",
  corsOrigin: "http://localhost:3000",
};

describe("HTTP integration via app.inject()", () => {
  const app = buildApp(config, createTestDb());

  beforeAll(async () => {
    await app;
  });

  afterAll(async () => {
    await (await app).close();
  });

  it("registers, logs in, returns the caller's profile, and blocks another profile", async () => {
    const server = await app;
    const registration = await server.inject({
      method: "POST",
      url: "/api/auth/register",
      remoteAddress: "192.0.2.1",
      payload: {
        role: "SPORTSMAN",
        name: "Test",
        surname: "Athlete",
        email: "integration@example.com",
        password: "password123",
        confirmPassword: "password123",
      },
    });

    expect(registration.statusCode).toBe(201);
    const registered = registration.json<{
      user: { id: string; password?: string };
      token: string;
    }>();
    expect(registered.user.password).toBeUndefined();

    const login = await server.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: { email: "integration@example.com", password: "password123" },
    });
    expect(login.statusCode).toBe(200);
    const loggedIn = login.json<{ token: string }>();

    const unauthorized = await server.inject({
      method: "GET",
      url: "/api/user/profile",
    });
    expect(unauthorized.statusCode).toBe(401);

    const profile = await server.inject({
      method: "GET",
      url: `/api/user/profile?userId=${existingMemberId}`,
      headers: { authorization: `Bearer ${loggedIn.token}` },
    });
    expect(profile.statusCode).toBe(200);
    expect(profile.json<{ id: string }>().id).toBe(registered.user.id);

    const otherProfile = await server.inject({
      method: "GET",
      url: `/api/user/profile/${existingMemberId}`,
      headers: { authorization: `Bearer ${loggedIn.token}` },
    });
    expect(otherProfile.statusCode).toBe(403);
  });

  it("supports group CRUD, joining, leaving, and author-managed membership", async () => {
    const server = await app;
    const register = async (role: string, email: string) => {
      const response = await server.inject({
        method: "POST",
        url: "/api/auth/register",
        remoteAddress: "192.0.2.2",
        payload: {
          role,
          name: role,
          surname: "Test",
          email,
          password: "password123",
          confirmPassword: "password123",
        },
      });
      expect(response.statusCode).toBe(201);
      return response.json<{ user: { id: string }; token: string }>();
    };

    const coach = await register("COACH", "groups-coach@example.com");
    const athlete = await register("SPORTSMAN", "groups-athlete@example.com");
    const admin = await register("ADMIN", "groups-admin@example.com");
    const coachHeaders = { authorization: `Bearer ${coach.token}` };
    const athleteHeaders = { authorization: `Bearer ${athlete.token}` };
    const adminHeaders = { authorization: `Bearer ${admin.token}` };
    const groupUrl = `/api/${coach.user.id}/groups`;

    const forbiddenCreate = await server.inject({
      method: "POST",
      url: `/api/${athlete.user.id}/groups`,
      headers: athleteHeaders,
      payload: { name: "Not allowed" },
    });
    expect(forbiddenCreate.statusCode).toBe(403);

    const created = await server.inject({
      method: "POST",
      url: groupUrl,
      headers: coachHeaders,
      payload: { name: "Morning training", description: "Beginners" },
    });
    expect(created.statusCode).toBe(201);
    const group = created.json<{
      id: string;
      name: string;
      code: string;
      membersCount: number;
    }>();
    expect(group.code).toMatch(/^[A-F0-9]{16}$/);
    expect(group.membersCount).toBe(1);

    const join = await server.inject({
      method: "POST",
      url: `/api/${athlete.user.id}/groups/join`,
      headers: athleteHeaders,
      payload: { groupCode: group.code.toLowerCase() },
    });
    expect(join.statusCode).toBe(200);
    expect(join.json<{ membersCount: number }>().membersCount).toBe(2);

    const adminUpdate = await server.inject({
      method: "PUT",
      url: `${groupUrl}/${group.id}`,
      headers: adminHeaders,
      payload: { name: "Updated training" },
    });
    expect(adminUpdate.statusCode).toBe(200);
    expect(adminUpdate.json<{ name: string }>().name).toBe("Updated training");

    const forbiddenRemoval = await server.inject({
      method: "DELETE",
      url: `${groupUrl}/${group.id}/members/${coach.user.id}`,
      headers: athleteHeaders,
    });
    expect(forbiddenRemoval.statusCode).toBe(403);

    const authorRemoval = await server.inject({
      method: "DELETE",
      url: `${groupUrl}/${group.id}/members/${athlete.user.id}`,
      headers: coachHeaders,
    });
    expect(authorRemoval.statusCode).toBe(204);

    const rejoin = await server.inject({
      method: "POST",
      url: `/api/${athlete.user.id}/groups/join`,
      headers: athleteHeaders,
      payload: { groupCode: group.code },
    });
    expect(rejoin.statusCode).toBe(200);

    const leave = await server.inject({
      method: "DELETE",
      url: `/api/${athlete.user.id}/groups/${group.id}/members/${athlete.user.id}`,
      headers: athleteHeaders,
    });
    expect(leave.statusCode).toBe(204);

    const deleted = await server.inject({
      method: "DELETE",
      url: `${groupUrl}/${group.id}`,
      headers: coachHeaders,
    });
    expect(deleted.statusCode).toBe(204);

    const missing = await server.inject({
      method: "GET",
      url: `${groupUrl}/${group.id}`,
      headers: coachHeaders,
    });
    expect(missing.statusCode).toBe(404);
  });

  it("applies separate per-IP limits to login and registration", async () => {
    const server = await app;
    const loginAttempt = () =>
      server.inject({
        method: "POST",
        url: "/api/auth/login",
        remoteAddress: "192.0.2.3",
        payload: {
          email: "missing@example.com",
          password: "password123",
        },
      });

    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect((await loginAttempt()).statusCode).toBe(401);
    }
    expect((await loginAttempt()).statusCode).toBe(429);

    const registrationPayload = (email: string) => ({
      role: "ADMIN",
      name: "Rate",
      surname: "Limited",
      email,
      password: "password123",
      confirmPassword: "password123",
    });
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const response = await server.inject({
        method: "POST",
        url: "/api/auth/register",
        remoteAddress: "192.0.2.4",
        payload: registrationPayload(`ratelimit-${attempt}@example.com`),
      });
      expect(response.statusCode).toBe(201);
    }

    const blockedRegistration = await server.inject({
      method: "POST",
      url: "/api/auth/register",
      remoteAddress: "192.0.2.4",
      payload: registrationPayload("ratelimit-blocked@example.com"),
    });
    expect(blockedRegistration.statusCode).toBe(429);
  });
});
