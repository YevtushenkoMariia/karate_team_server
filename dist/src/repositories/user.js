"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = require("../lib/prisma");
class UserRepository {
    async createUser(data) {
        return prisma_1.prisma.users.create({
            data: {
                name: data.name,
                surname: data.surname,
                email: data.email,
                password: data.password,
                role: data.role,
            }
        });
    }
    async checkUserExists(email) {
        return prisma_1.prisma.users.findUnique({
            where: { email: email }
        });
    }
}
exports.UserRepository = UserRepository;
