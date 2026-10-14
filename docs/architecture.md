# Architecture

The server is a **modular monolith**: one deployable Fastify process and one
PostgreSQL database, split into modules with explicit boundaries.

## Layout

```
src/
  index.ts          entry point: load config, start server
  app.ts            composition root: creates modules and wires dependencies
  config.ts         typed, validated environment config
  shared/           shared kernel (no business logic)
    db.ts             Prisma client factory
    errors.ts         AppError + NotFound/Forbidden/... subclasses
    events.ts         in-process EventBus for module-to-module events
    http/auth.ts      authenticate / authorize / requireSelf hooks
    http/error-handler.ts   single error -> HTTP response mapping
  modules/
    identity/       accounts, registration, login        (table: users)
    members/        sportsman & coach profiles           (sportsmen, coaches, coach_sportsman)
    groups/         training groups and membership       (groups, users_groups)
    locations/      cities, clubs, countries             (cities, clubs, countries)
```

Inside a module:

| File                  | Responsibility                                          |
|-----------------------|---------------------------------------------------------|
| `index.ts`            | **Public API** — the only file other modules may import |
| `<m>.module.ts`       | Builds the module from its dependencies, declares routes |
| `<m>.api.ts`          | Interface exposed to other modules (facade)             |
| `*.controller.ts`     | HTTP in/out only                                        |
| `*.service.ts`        | Use cases / business rules                              |
| `*.repository.ts`     | Data access to the module's **own** tables              |
| `*.schemas.ts`        | TypeBox request schemas (validation + OpenAPI)          |

## Rules

1. **Import only through `index.ts`.** `groups` uses `IdentityApi` from
   `../identity`, never `../identity/users.repository`.
2. **A module queries only its own tables.** Data from another module is read
   through that module's API (e.g. group authors via `identity.findUsersByIds`).
3. **`shared/` never depends on `modules/`.**
4. **Dependencies are injected** through `create<Module>Module(deps)`; nothing
   creates singletons at import time, so services can be unit-tested with fakes.
5. **Errors are thrown, not sent.** Services throw `AppError` subclasses; the
   global error handler builds the response
   (`{ statusCode, error, message }`).
6. **Side effects across modules go through events.** Example: `identity`
   publishes `UserRegistered`; `members` subscribes and creates the coach or
   sportsman record. `identity` does not know `members` exists.

Rules 1–3 are checked automatically: `npm run check:boundaries`.
When adding a table, register its owner in `scripts/check-boundaries.mjs`.

## Module dependencies

```
identity  <──  members  ──>  locations
   ^
   └────────  groups
members ··(UserRegistered event)··> identity
```

No cycles: `identity` and `locations` depend on nothing.

## Adding a module (e.g. `training`)

1. `src/modules/training/` with `training.module.ts`, `index.ts`, and the layers.
2. Register its tables in `TABLE_OWNERS` in `scripts/check-boundaries.mjs`.
3. Create it in `app.ts`, passing only the APIs it needs.

## Path to services

Each module already talks to others through an interface and an event bus.
Extracting a module into a separate service means replacing its `*Api`
implementation with an HTTP/RPC client and the `EventBus` with a message
broker; callers do not change.
