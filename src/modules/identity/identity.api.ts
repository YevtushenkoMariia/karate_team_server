import type { role_type } from "../../../generated/prisma/client";
import { UpdateUserData, UsersRepository } from "./users.repository";

export type UserSummary = {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: role_type;
  gender: string | null;
  phone_number: string | null;
  birth_date: Date | null;
};

export type { UpdateUserData };

// Public contract of the identity module. Other modules use it instead of
// touching the users table.
export interface IdentityApi {
  findUserById(id: string): Promise<UserSummary | null>;
  /** Returns users in the same order as `ids`; unknown ids are skipped. */
  findUsersByIds(ids: string[]): Promise<UserSummary[]>;
  updateUser(id: string, data: UpdateUserData): Promise<void>;
}

export function createIdentityApi(users: UsersRepository): IdentityApi {
  return {
    findUserById: (id) => users.findSummaryById(id),

    async findUsersByIds(ids) {
      if (ids.length === 0) {
        return [];
      }

      const found = await users.findSummariesByIds(ids);
      const byId = new Map(found.map((user) => [user.id, user]));

      return ids
        .map((id) => byId.get(id))
        .filter((user): user is UserSummary => user !== undefined);
    },

    updateUser: (id, data) => users.update(id, data),
  };
}
