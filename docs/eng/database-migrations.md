# Database migrations

The migration baseline is generated from `prisma/schema.prisma`. Keep the
schema and baseline in sync; the previous migration chain created `SERIAL`
keys while the current schema uses UUIDs.

Set `SHADOW_DATABASE_URL` to a separate, disposable PostgreSQL database for
`prisma migrate dev`. It must not point to the application or production
database. `prisma.config.ts` reads this variable when Prisma creates and resets
the shadow schema.

## Production re-baseline

Back up production and compare its schema with the baseline and all subsequent
migrations before changing migration history. A baseline is recorded, not
executed, on an existing database:

```powershell
npx prisma migrate resolve --applied 0_init
```

Afterward, `prisma migrate status` can report successful historical migrations
that are no longer present in the squashed local migrations directory. Keep
those database history records; do not delete them. If the baseline is the last
common migration and the only pending migrations are the intended new changes,
apply them with:

```powershell
npx prisma migrate deploy
```

Do not run the baseline SQL or old migration SQL against an existing database.
Use a backup and review the schema diff before resolving or deploying.
