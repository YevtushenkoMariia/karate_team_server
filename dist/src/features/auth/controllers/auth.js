"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const services_1 = require("../services");
const service = new services_1.AuthService();
class AuthController {
    async registerUser(request, reply) {
        try {
            const result = await service.registerUser(request.body);
            return reply.status(201).send(result);
        }
        catch (error) {
            return reply.status(400).send({
                message: "Registration error",
                error: error.message,
            });
        }
    }
    async loginUser(request, reply) {
        try {
            const result = await service.loginUser(request.body);
            console.log(result);
            return reply.status(200).send(result);
        }
        catch (error) {
            return reply.status(401).send({
                message: "Invalid email or password",
                error: error.message,
            });
        }
    }
}
exports.AuthController = AuthController;
