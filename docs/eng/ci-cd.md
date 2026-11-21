# CI/CD

`.github/workflows/ci-cd.yml` runs on pull requests to `main` and pushes to
`main`. It installs locked dependencies, generates and validates Prisma Client,
checks module boundaries and TypeScript, runs tests, builds the app, and audits
dependencies. CI uses placeholder database URLs and does not connect to a real
database.

After checks pass on a push to `main`, the workflow triggers Render through the
`RENDER_DEPLOY_HOOK_URL` GitHub Actions secret. Configure this secret with the
service's deploy hook URL in **Settings → Secrets and variables → Actions**.
Disable Render's automatic Git deploy so a commit cannot deploy before CI
finishes.

Configure the Render Web Service:

- Runtime: Node
- Branch: `main`
- Build command: `npm ci && npx prisma generate && npm run build`
- Start command: `npm start`
- Node version: 22
- Environment variables: `DATABASE_URL`, `JWT_SECRET`,
  `ORIGIN_FRONTEND_URL`; optionally `JWT_EXPIRES_IN` (defaults to `1d`)

The workflow intentionally does not run `prisma migrate deploy`. Production
migrations require a separately reviewed release step after migration history
and baseline are reconciled. Add the `Checks` status check as required in the
`main` branch protection rules.
