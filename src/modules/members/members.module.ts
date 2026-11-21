import { FastifyInstance } from "fastify";
import { role_type } from "../../../generated/prisma/client";
import {
  authorize,
  runInTransaction,
  type AppModule,
  type Db,
  type EventBus,
} from "../../shared";
import { UserRegistered, type IdentityApi } from "../identity";
import type { LocationsApi } from "../locations";
import { SportsmenRepository } from "./sportsmen.repository";
import { CoachesRepository } from "./coaches.repository";
import {
  ProfileService,
  type ProfileTransactionRunner,
  type ProfileUnitOfWork,
} from "./profile.service";
import { ProfileController } from "./profile.controller";
import { MemberProfileParams, UpdateProfileBody } from "./profile.schemas";

type Deps = {
  db: Db;
  events: EventBus;
  identity: IdentityApi;
  locations: LocationsApi;
};

export function createMembersModule(deps: Deps): AppModule {
  const sportsmen = new SportsmenRepository(deps.db);
  const coaches = new CoachesRepository(deps.db);
  const rootUnitOfWork: ProfileUnitOfWork = {
    identity: deps.identity,
    locations: deps.locations,
    sportsmen,
    coaches,
  };

  const runProfileTransaction: ProfileTransactionRunner = (operation) =>
    runInTransaction(deps.db, (tx) =>
      operation({
        identity: deps.identity.withTransaction(tx),
        locations: deps.locations.withTransaction(tx),
        sportsmen: new SportsmenRepository(tx),
        coaches: new CoachesRepository(tx),
      }),
    );
    
  const profileService = new ProfileService(
    rootUnitOfWork,
    runProfileTransaction,
  );
  const controller = new ProfileController(profileService);

  // Every coach / sportsman account gets its member record right after sign-up.
  deps.events.subscribe(UserRegistered, async ({ userId, role }) => {
    if (role === role_type.COACH) {
      await coaches.ensureExists(userId);
    } else if (role === role_type.SPORTSMAN) {
      await sportsmen.ensureExists(userId);
    }
  });

  return {
    name: "members",
    prefix: "/api/user",
    routes: async (fastify: FastifyInstance) => {
      const anyRole = authorize(
        role_type.ADMIN,
        role_type.COACH,
        role_type.SPORTSMAN,
      );

      fastify.get("/profile", {
        schema: {
          security: [{ bearerAuth: [] }],
        },
        onRequest: [fastify.authenticate, anyRole],
        handler: controller.getProfile,
      });

      fastify.get("/profile/:userId", {
        schema: {
          params: MemberProfileParams,
          security: [{ bearerAuth: [] }],
        },
        onRequest: [fastify.authenticate, anyRole],
        handler: controller.getMemberProfile,
      });

      fastify.put("/profile-update", {
        schema: {
          body: UpdateProfileBody,
          security: [{ bearerAuth: [] }],
        },
        onRequest: [fastify.authenticate, anyRole],
        handler: controller.updateProfile,
      });
    },
  };
}
