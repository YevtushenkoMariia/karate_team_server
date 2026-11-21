import { role_type } from "../../generated/prisma/client";
import type { Db } from "../../src/shared";

type TestUser = {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: role_type;
  gender: string | null;
  phone_number: string | null;
  birth_date: Date | null;
};

const existingMemberId = "00000000-0000-4000-8000-000000000002";

export function createTestDb(): Db {
  const usersById = new Map<string, TestUser>([
    [
      existingMemberId,
      {
        id: existingMemberId,
        name: "Existing",
        surname: "Member",
        email: "existing@example.com",
        password: "unused",
        role: role_type.COACH,
        gender: null,
        phone_number: null,
        birth_date: null,
      },
    ],
  ]);
  const sportsmenByUserId = new Map<string, Record<string, unknown>>();
  let nextUserId = 3;
  let db: Db;

  const testDb = {
    $disconnect: async () => {},
    $transaction: async <T>(operation: (transaction: Db) => Promise<T>) =>
      operation(db),
    users: {
      findUnique: async ({ where }: { where: { id?: string; email?: string } }) =>
        [...usersById.values()].find(
          (user) =>
            (where.id !== undefined && user.id === where.id) ||
            (where.email !== undefined && user.email === where.email),
        ) ?? null,
      findMany: async ({ where }: { where: { id: { in: string[] } } }) =>
        where.id.in.flatMap((id) => {
          const user = usersById.get(id);
          return user ? [user] : [];
        }),
      create: async ({
        data,
      }: {
        data: Omit<TestUser, "id" | "gender" | "phone_number" | "birth_date">;
      }) => {
        const user: TestUser = {
          ...data,
          id: `00000000-0000-4000-8000-${String(nextUserId++).padStart(12, "0")}`,
          gender: null,
          phone_number: null,
          birth_date: null,
        };
        usersById.set(user.id, user);
        return user;
      },
      update: async ({
        where,
        data,
      }: {
        where: { id: string };
        data: Partial<TestUser>;
      }) => {
        const user = usersById.get(where.id);
        if (!user) {
          throw new Error("Test user not found");
        }
        Object.assign(user, data);
        return user;
      },
    },
    sportsmen: {
      upsert: async ({
        where,
        create,
        update,
      }: {
        where: { user_id: string };
        create: Record<string, unknown>;
        update: Record<string, unknown>;
      }) => {
        const current = sportsmenByUserId.get(where.user_id);
        const member = current
          ? { ...current, ...update }
          : {
              ...create,
              karate_level: null,
              status: null,
              city_id: null,
              club_id: null,
              coach_sportsman: [],
            };
        sportsmenByUserId.set(where.user_id, member);
        return member;
      },
      findUnique: async ({ where }: { where: { user_id: string } }) =>
        sportsmenByUserId.get(where.user_id) ?? null,
    },
    coaches: {
      upsert: async () => ({}),
      findUnique: async () => null,
    },
    coach_sportsman: {
      findFirst: async () => null,
    },
  };

  db = testDb as unknown as Db;
  return db;
}

export { existingMemberId };
