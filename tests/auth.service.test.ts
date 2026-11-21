import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  role_type,
  user_status_type,
} from "../generated/prisma/client";
import { AuthService } from "../src/modules/identity/auth.service";
import { RegisterBody } from "../src/modules/identity/auth.schemas";
import { UserRegistered } from "../src/modules/identity/identity.events";
import type {
  AuthUserStore,
  CreateUserData,
} from "../src/modules/identity/identity.types";
import { BadRequestError, EventBus, logger, UnauthorizedError } from "../src/shared";

const secret = "unit-test-secret";
const registration: RegisterBody = {
  role: "SPORTSMAN",
  name: "Test",
  surname: "Athlete",
  email: "athlete@example.com",
  password: "password123",
  confirmPassword: "password123",
};

function createService() {
  let savedUser: Awaited<ReturnType<AuthUserStore["findByEmail"]>> = null;
  let createdPassword: string | undefined;
  const create = vi.fn(async (data: CreateUserData) => {
    createdPassword = data.password;
    savedUser = {
      ...data,
      id: "00000000-0000-4000-8000-000000000001",
      gender: null,
      phone_number: null,
      birth_date: null,
      status: user_status_type.VERIFYING,
      created_at: new Date(),
      updated_at: new Date(),
      email_verified: false,
    };
    return savedUser;
  });
  const store: AuthUserStore = {
    findByEmail: vi.fn(async () => savedUser),
    create,
  };
  const events = new EventBus(logger);
  const service = new AuthService(store, events, {
    secret,
    expiresIn: "1h",
  });

  return { service, store, events, create, getCreatedPassword: () => createdPassword };
}

describe("AuthService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("registers a user with a hashed password and publishes the event", async () => {
    const { service, events, create, getCreatedPassword } = createService();
    const published: Array<{ userId: string; role: role_type }> = [];
    events.subscribe(UserRegistered, (event) => {
      published.push(event);
    });

    const result = await service.register(registration);

    expect(create).toHaveBeenCalledOnce();
    const storedPassword = getCreatedPassword();
    if (!storedPassword) {
      throw new Error("User was created without a password hash");
    }
    expect(await bcrypt.compare(registration.password, storedPassword)).toBe(true);
    expect(result.user).not.toHaveProperty("password");
    expect(jwt.verify(result.token, secret)).toMatchObject({
      id: result.user.id,
      email: registration.email,
      role: role_type.SPORTSMAN,
    });
    expect(published).toEqual([
      { userId: result.user.id, role: role_type.SPORTSMAN },
    ]);
  });

  it("rejects mismatched passwords without creating an account", async () => {
    const { service, create } = createService();

    await expect(
      service.register({ ...registration, confirmPassword: "different123" }),
    ).rejects.toBeInstanceOf(BadRequestError);

    expect(create).not.toHaveBeenCalled();
  });

  it("returns the same authentication error for an unknown email", async () => {
    const { service } = createService();

    await expect(
      service.login({ email: registration.email, password: registration.password }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
