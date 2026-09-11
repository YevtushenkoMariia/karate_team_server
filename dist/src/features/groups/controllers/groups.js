"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsController = void 0;
const services_1 = require("../services");
const service = new services_1.GroupsService();
class GroupsController {
    async getUserMemberGroups(request, reply) {
        try {
            const { userId } = request.params;
            const { role } = request.query;
            if (!userId || !role) {
                return reply.status(400).send({
                    message: "User ID and role are required",
                });
            }
            const result = await service.getUserMemberGroups({
                userId: userId,
                role: role,
            });
            return reply.status(200).send(result);
        }
        catch (error) {
            return reply.status(404).send({
                message: "User not found",
                error: error.message,
            });
        }
    }
    async getGroup(request, reply) {
        try {
            const { userId, groupId } = request.params;
            const { role } = request.query;
            if (!userId || !groupId) {
                return reply.status(400).send({
                    message: "User ID and group ID are required",
                });
            }
            const result = await service.getGroup({
                userId,
                groupId,
                role,
            });
            return reply.status(200).send(result);
        }
        catch (error) {
            return reply.status(error.statusCode || 404).send({
                message: error.message || "Group not found",
                error: error.message,
            });
        }
    }
    async joinGroup(request, reply) {
        try {
            const { userId } = request.params;
            if (!userId) {
                return reply.status(400).send({
                    message: "User ID is required",
                });
            }
            const result = await service.joinGroup({
                userId,
                code: request.body.groupCode,
            });
            return reply.status(200).send(result);
        }
        catch (error) {
            return reply.status(error.statusCode || 400).send({
                message: error.message || "Failed to join group",
                error: error.message,
            });
        }
    }
    async getGroupMembers(request, reply) {
        try {
            const { groupId, userId } = request.params;
            if (!userId) {
                return reply.status(400).send({
                    message: "User ID is required",
                });
            }
            const result = await service.getGroupMembers({ userId, groupId });
            return reply.status(200).send(result);
        }
        catch (error) {
            return reply.status(error.statusCode || 400).send({
                message: error.message || "Failed getting all group members",
                error: error.message,
            });
        }
    }
}
exports.GroupsController = GroupsController;
