"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupsRoutes = groupsRoutes;
const groups_1 = require("../schemas/groups");
const groups_2 = require("../controllers/groups");
const auth_1 = require("../plugins/auth");
const client_1 = require("../../generated/prisma/client");
const controller = new groups_2.GroupsController();
async function groupsRoutes(fastify) {
    fastify.get("/", {
        schema: {
            params: groups_1.UserIdParams,
            querystring: groups_1.GroupBody,
        },
        preHandler: [
            fastify.authenticate,
            (0, auth_1.authorize)(client_1.role_type.ADMIN, client_1.role_type.COACH, client_1.role_type.SPORTSMAN),
        ],
        handler: controller.getUserMemberGroups,
    });
    fastify.post("/join", {
        schema: {
            params: groups_1.UserIdParams,
            body: groups_1.JoinGroupSchema,
        },
        preHandler: [
            fastify.authenticate,
            (0, auth_1.authorize)(client_1.role_type.ADMIN, client_1.role_type.COACH, client_1.role_type.SPORTSMAN),
        ],
        handler: controller.joinGroup,
    });
    fastify.get("/:groupId", {
        schema: {
            params: groups_1.GroupIdParams,
            querystring: groups_1.GetGroupQuery,
        },
        preHandler: [
            fastify.authenticate,
            (0, auth_1.authorize)(client_1.role_type.ADMIN, client_1.role_type.COACH, client_1.role_type.SPORTSMAN),
        ],
        handler: controller.getGroup,
    });
    fastify.get("/:groupId/members", {
        schema: {
            params: groups_1.GroupIdParams,
            UserIdParams: groups_1.UserIdParams
        },
        preHandler: [
            fastify.authenticate,
            (0, auth_1.authorize)(client_1.role_type.ADMIN, client_1.role_type.COACH, client_1.role_type.SPORTSMAN),
        ],
        handler: controller.getGroupMembers,
    });
}
