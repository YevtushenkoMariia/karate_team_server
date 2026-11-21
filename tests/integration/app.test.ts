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
});
