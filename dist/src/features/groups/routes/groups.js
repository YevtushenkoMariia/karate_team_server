"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupsRoutes = groupsRoutes;
const types_1 = require("../types");
const controllers_1 = require("../controllers");
const plugins_1 = require("../../../shared/plugins");
const client_1 = require("../../../../generated/prisma/client");
const controller = new controllers_1.GroupsController();
async function groupsRoutes(fastify) {
    fastify.get("/", {
        schema: {
            params: types_1.UserIdParams,
            querystring: types_1.GroupBody,
        },
        preHandler: [
            fastify.authenticate,
            (0, plugins_1.authorize)(client_1.role_type.ADMIN, client_1.role_type.COACH, client_1.role_type.SPORTSMAN),
        ],
        handler: controller.getUserMemberGroups,
    });
    fastify.post("/join", {
        schema: {
            params: types_1.UserIdParams,
            body: types_1.JoinGroupSchema,
        },
        preHandler: [
            fastify.authenticate,
            (0, plugins_1.authorize)(client_1.role_type.ADMIN, client_1.role_type.COACH, client_1.role_type.SPORTSMAN),
        ],
        handler: controller.joinGroup,
    });
    fastify.get("/:groupId", {
        schema: {
            params: types_1.GroupIdParams,
            querystring: types_1.GetGroupQuery,
        },
        preHandler: [
            fastify.authenticate,
            (0, plugins_1.authorize)(client_1.role_type.ADMIN, client_1.role_type.COACH, client_1.role_type.SPORTSMAN),
        ],
        handler: controller.getGroup,
    });
    fastify.get("/:groupId/members", {
        schema: {
            params: types_1.GroupIdParams,
            UserIdParams: types_1.UserIdParams
        },
        preHandler: [
            fastify.authenticate,
            (0, plugins_1.authorize)(client_1.role_type.ADMIN, client_1.role_type.COACH, client_1.role_type.SPORTSMAN),
        ],
        handler: controller.getGroupMembers,
    });
}
