import { FastifyInstance } from "fastify";
import {
    GetGroupQuery,
    GroupBody,
    GroupIdParams,
    JoinGroupSchema,
    UserIdParams,
} from "../types";
import { GroupsController } from "../controllers";
import { authorize } from "../../../shared/plugins";
import { role_type } from "../../../../generated/prisma/client";

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

    fastify.get("/:groupId/members", {
        schema: {
            params: GroupIdParams, UserIdParams
        },
        preHandler: [
            fastify.authenticate,
            authorize(role_type.ADMIN, role_type.COACH, role_type.SPORTSMAN),
        ],
        handler: controller.getGroupMembers,

        

    });
}
