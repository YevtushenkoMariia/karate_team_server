import type { DbClient } from "../../shared";
import type { UpdateUserData, UserSummary } from "./identity.types";
import { UsersRepository } from "./users.repository";

export type { UpdateUserData, UserSummary } from "./identity.types";

// Public contract of the identity module. Other modules use it instead of
// touching the users table.
export interface IdentityApi {
  withTransaction(tx: DbClient): IdentityApi;
  findUserById(id: string): Promise<UserSummary | null>;
  /** Returns users in the same order as `ids`; unknown ids are skipped. */
  findUsersByIds(ids: string[]): Promise<UserSummary[]>;
  updateUser(id: string, data: UpdateUserData): Promise<void>;
}

export function createIdentityApi(users: UsersRepository): IdentityApi {
  return {
    withTransaction: (tx) =>
      createIdentityApi(new UsersRepository(tx)),
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
