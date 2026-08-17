import { FastifyInstance } from "fastify";
import {
    GetGroupQuery,
    GroupBody,
    GroupIdParams,
    JoinGroupSchema,
    UserIdParams,
} from "../schemas/groups";
import { GroupsController } from "../controllers/groups";
import { authorize } from "../plugins/auth";
import { role_type } from "../../generated/prisma/client";

const controller = new GroupsController();


export async function groupsRoutes(fastify: FastifyInstance) {
    fastify.get("/", {
        schema: {
            params: UserIdParams,
            querystring: GroupBody,
        },
        preHandler: [
            fastify.authenticate,
            authorize(role_type.ADMIN, role_type.COACH, role_type.SPORTSMAN),
        ],
        handler: controller.getUserMemberGroups,
    });

    fastify.post("/join", {
        schema: {
            params: UserIdParams,
            body: JoinGroupSchema,
        },
        preHandler: [
            fastify.authenticate,
            authorize(role_type.ADMIN, role_type.COACH, role_type.SPORTSMAN),
        ],
        handler: controller.joinGroup,
    });

    fastify.get("/:groupId", {
        schema: {
            params: GroupIdParams,
            querystring: GetGroupQuery,
        },
        preHandler: [
            fastify.authenticate,
            authorize(role_type.ADMIN, role_type.COACH, role_type.SPORTSMAN),
        ],
        handler: controller.getGroup,
    });
}
