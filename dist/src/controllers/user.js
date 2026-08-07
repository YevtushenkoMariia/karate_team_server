"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const users_1 = require("../services/users");
const service = new users_1.UsersService();
class UserController {
    async getUserProfile(request, reply) {
        try {
            const userProfileData = await service.getUserProfile(request.query);
            return reply.status(200).send(userProfileData);
        }
        catch (error) {
            return reply.status(404).send({
                message: "User not found",
                error: error.message,
            });
        }
    }
    async updateUserProfile(request, reply) {
        try {
            const result = await service.updateUserProfile(request.user, request.body);
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
exports.UserController = UserController;
