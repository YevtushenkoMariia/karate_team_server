import type { Db } from "../../shared";
import type { role_type } from "../../../generated/prisma/client";

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

export type UpdateUserData = {
  name?: string;
  surname?: string;
  email?: string;
  gender?: string;
  phone_number?: string;
  birth_date?: Date;
};

export class UsersRepository {
  constructor(private readonly db: Db) {}

  create(data: {
    name: string;
    surname: string;
    email: string;
    password: string;
    role: role_type;
  }) {
    return this.db.users.create({ data });
  }

  findByEmail(email: string) {
    return this.db.users.findUnique({ where: { email } });
  }

  findSummaryById(id: string) {
    return this.db.users.findUnique({
      where: { id },
      select: userSummarySelect,
    });
  }

  findSummariesByIds(ids: string[]) {
    return this.db.users.findMany({
      where: { id: { in: ids } },
      select: userSummarySelect,
    });
  }

  async update(id: string, data: UpdateUserData) {
    if (Object.keys(data).length === 0) {
      return;
    }

    await this.db.users.update({ where: { id }, data });
  }
}
