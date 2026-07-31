"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
class UserController {
    async createUser(request, reply) {
        // const user = await UserService.createUser(request.body);
        return reply.status(201).send();
    }
    async getUserById(request, reply) {
        // const user = await UserService.getUserById(request.params.id);
        return reply.send();
    }
}
exports.UserController = UserController;
