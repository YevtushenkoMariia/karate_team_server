import {
  gender_type,
  role_type,
} from "../../generated/prisma/client";
import type { Db } from "../../src/shared";

type TestUser = {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: role_type;
  gender: gender_type | null;
  phone_number: string | null;
  birth_date: Date | null;
};

type TestGroup = {
  id: string;
  name: string;
  description: string | null;
  code: string;
  author_id: string;
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
  const groupsById = new Map<string, TestGroup>();
  const memberships = new Set<string>();
  let nextUserId = 3;
  let nextGroupId = 1;
  let db: Db;

  const membershipKey = (userId: string, groupId: string) =>
    `${userId}:${groupId}`;
  const withMemberCount = (group: TestGroup) => ({
    ...group,
    _count: {
      users_groups: [...memberships].filter((membership) =>
        membership.endsWith(`:${group.id}`),
      ).length,
    },
  });

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
    groups: {
      findMany: async ({
        where,
      }: {
        where: { users_groups: { some: { user_id: string } } };
      }) =>
        [...groupsById.values()]
          .filter((group) =>
            memberships.has(membershipKey(where.users_groups.some.user_id, group.id)),
          )
          .map(withMemberCount),
      findUnique: async ({
        where,
      }: {
        where: { id?: string; code?: string };
      }) => {
        const group = where.id
          ? groupsById.get(where.id)
          : [...groupsById.values()].find((item) => item.code === where.code);
        return group ? withMemberCount(group) : null;
      },
      create: async ({
        data,
      }: {
        data: {
          name: string;
          description?: string;
          code: string;
          author_id: string;
          users_groups: { create: { user_id: string } };
        };
      }) => {
        const group: TestGroup = {
          id: `00000000-0000-4000-8000-${String(nextGroupId++).padStart(12, "0")}`,
          name: data.name,
          description: data.description ?? null,
          code: data.code,
          author_id: data.author_id,
        };
        groupsById.set(group.id, group);
        memberships.add(
          membershipKey(data.users_groups.create.user_id, group.id),
        );
        return withMemberCount(group);
      },
      update: async ({
        where,
        data,
      }: {
        where: { id: string };
        data: { name?: string; description?: string | null };
      }) => {
        const group = groupsById.get(where.id);
        if (!group) {
          throw new Error("Test group not found");
        }
        Object.assign(group, data);
        return withMemberCount(group);
      },
      delete: async ({ where }: { where: { id: string } }) => {
        const group = groupsById.get(where.id);
        if (!group) {
          throw new Error("Test group not found");
        }
        groupsById.delete(where.id);
        for (const membership of memberships) {
          if (membership.endsWith(`:${where.id}`)) {
            memberships.delete(membership);
          }
        }
        return group;
      },
    },
    users_groups: {
      findUnique: async ({
        where,
      }: {
        where: { user_id_group_id: { user_id: string; group_id: string } };
      }) => {
        const { user_id, group_id } = where.user_id_group_id;
        return memberships.has(membershipKey(user_id, group_id))
          ? { user_id }
          : null;
      },
      create: async ({
        data,
      }: {
        data: { user_id: string; group_id: string };
      }) => {
        memberships.add(membershipKey(data.user_id, data.group_id));
        return data;
      },
      findMany: async ({ where }: { where: { group_id: string } }) =>
        [...memberships]
          .filter((membership) => membership.endsWith(`:${where.group_id}`))
          .map((membership) => ({ user_id: membership.split(":")[0]! })),
      delete: async ({
        where,
      }: {
        where: { user_id_group_id: { user_id: string; group_id: string } };
      }) => {
        const { user_id, group_id } = where.user_id_group_id;
        memberships.delete(membershipKey(user_id, group_id));
        return { user_id, group_id };
      },
    },
  };

  db = testDb as unknown as Db;
  return db;
}

export { existingMemberId };
