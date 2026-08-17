"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsRepository = void 0;
const prisma_1 = require("../lib/prisma");
class GroupsRepository {
    async getUserGroups(userId) {
        const groups = await prisma_1.prisma.groups.findMany({
            where: {
                users_groups: {
                    some: {
                        user_id: userId,
                    },
                },
            },
            select: {
                id: true,
                name: true,
                code: true,
                users: {
                    select: {
                        name: true,
                        surname: true,
                    },
                },
                _count: {
                    select: { users_groups: true }
                }
            },
        });
        const mappedGroups = groups.map(group => ({
            id: group.id,
            name: group.name,
            code: group.code,
            author: {
                name: group.users.name,
                surname: group.users.surname
            },
            membersCount: group._count.users_groups
        }));
        return mappedGroups;
    }
}
exports.GroupsRepository = GroupsRepository;
