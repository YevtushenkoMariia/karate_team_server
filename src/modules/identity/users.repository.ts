import type { DbClient } from "../../shared";
import type {
  CreateUserData,
  UpdateUserData,
  UserRecord,
  UserSummary,
} from "./identity.types";

const userSummarySelect = {
  id: true,
  name: true,
  surname: true,
  email: true,
  role: true,
  gender: true,
  phone_number: true,
  birth_date: true,
} as const;

export class UsersRepository {
  constructor(private readonly db: DbClient) {}

  create(data: CreateUserData): Promise<UserRecord> {
    return this.db.users.create({ data });
  }

  findByEmail(email: string): Promise<UserRecord | null> {
    return this.db.users.findUnique({ where: { email } });
  }

  findSummaryById(id: string): Promise<UserSummary | null> {
    return this.db.users.findUnique({
      where: { id },
      select: userSummarySelect,
    });
  }

  findSummariesByIds(ids: string[]): Promise<UserSummary[]> {
    return this.db.users.findMany({
      where: { id: { in: ids } },
      select: userSummarySelect,
    });
  }

  async update(id: string, data: UpdateUserData): Promise<void> {
    if (Object.keys(data).length === 0) {
      return;
    }

    await this.db.users.update({ where: { id }, data });
  }
}
