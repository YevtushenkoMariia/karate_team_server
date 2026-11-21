import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import type { Prisma } from "../../generated/prisma/client";

export type Db = PrismaClient;
export type DbClient = Prisma.TransactionClient;

export function createDb(connectionString: string): Db {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export function runInTransaction<T>(
  db: Db,
  operation: (tx: DbClient) => Promise<T>,
): Promise<T> {
  return db.$transaction(operation);
}
