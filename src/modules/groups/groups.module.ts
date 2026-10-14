import { FastifyInstance } from "fastify";
import { role_type } from "../../../generated/prisma/client";
import { authorize, requireSelf, type AppModule, type Db } from "../../shared";
import type { IdentityApi } from "../identity";
import { GroupsRepository } from "./groups.repository";
import { GroupsService } from "./groups.service";
import { GroupsController } from "./groups.controller";
import {
  GetGroupQuery,
  GroupParams,
  JoinGroupBody,
  ListGroupsQuery,
  UserParams,
} from "./groups.schemas";

type Deps = {
  db: Db;
  identity: IdentityApi;
};

export function createGroupsModule(deps: Deps): AppModule {
  const service = new GroupsService(new GroupsRepository(deps.db), deps.identity);
  const controller = new GroupsController(service);

  return {
    name: "groups",
    prefix: "/api/:userId/groups",
    routes: async (fastify: FastifyInstance) => {
      const onRequest = [
        fastify.authenticate,
        authorize(role_type.ADMIN, role_type.COACH, role_type.SPORTSMAN),
        requireSelf("userId"),
      ];
      const security = [{ bearerAuth: [] }];

      fastify.get("/", {
        schema: { params: UserParams, querystring: ListGroupsQuery, security },
        onRequest,
        handler: controller.getUserGroups,
      });

      fastify.post("/join", {
        schema: { params: UserParams, body: JoinGroupBody, security },
        onRequest,
        handler: controller.joinGroup,
      });

      fastify.get("/:groupId", {
        schema: { params: GroupParams, querystring: GetGroupQuery, security },
        onRequest,
        handler: controller.getGroup,
      });

      fastify.get("/:groupId/members", {
        schema: { params: GroupParams, security },
        onRequest,
        handler: controller.getGroupMembers,
      });
    },
  };
}
