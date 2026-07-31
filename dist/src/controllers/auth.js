"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_1 = require("../services/auth");
const service = new auth_1.AuthService();
class AuthController {
    async registerUser(request, reply) {
        const result = await service.registerUser(request.body);
        return reply.status(201).send(result);
    }
    async loginUser(request, reply) {
        const result = await service.loginUser(request.body);
        return reply.status(200).send(result);
    }
}
exports.AuthController = AuthController;
