"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const users_1 = require("../services/users");
const service = new users_1.UsersService();
class UserController {
    async createUser(request, reply) {
        return reply.status(201).send();
    }
    async getUserById(request, reply) {
        return reply.send();
    }
    async getUserProfile(request, reply) {
        const result = await service.getUserProfile(request.query);
        return reply.status(200).send(result);
    }
    async updateUserProfile(request, reply) {
        const result = await service.updateUserProfile(request.user, request.body);
        return reply.status(200).send(result);
    }
}
exports.UserController = UserController;
