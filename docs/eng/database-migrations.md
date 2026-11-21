# Database migrations

The migration baseline is generated from `prisma/schema.prisma`. Keep the
schema and baseline in sync; the previous migration chain created `SERIAL`
keys while the current schema uses UUIDs.

Set `SHADOW_DATABASE_URL` to a separate, disposable PostgreSQL database for
`prisma migrate dev`. It must not point to the application or production
database. `prisma.config.ts` reads this variable when Prisma creates and resets
the shadow schema.

## Production re-baseline

Back up production and verify its tables, columns, enum values, indexes, and
UUID types match the baseline before baselining. The old migrations were
already applied in production, so `prisma migrate resolve --applied 0_init`
alone is not sufficient: it adds a baseline record but does not remove or
reconcile the old records in `_prisma_migrations`. Reconcile that history as a
separate, reviewed production operation before using `migrate deploy`. Do not
run the old migration SQL against the existing database.
