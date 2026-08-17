"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsController = void 0;
const groups_1 = require("../services/groups");
const service = new groups_1.GroupsService();
class GroupsController {
    async getUserMemberGroups(request, reply) {
        try {
            const result = await service.getUserMemberGroups(request.query);
            return reply.status(200).send(result);
        }
        catch (error) {
            return reply.status(404).send({
                message: "User not found",
                error: error.message,
            });
        }
    }
}
exports.GroupsController = GroupsController;
