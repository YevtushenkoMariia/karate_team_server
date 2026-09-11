"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsRepository = void 0;
const lib_1 = require("../../../shared/lib");
class GroupsRepository {
    async getGroupMembers(groupId) {
        const members = await lib_1.prisma.users_groups.findMany({
            where: {
                group_id: groupId,
            },
            select: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        role: true,
                    },
                },
            },
        });
        console.log(members);
        return members.map((member) => member.users);
    }
    async getUserGroups(userId) {
        const groups = await lib_1.prisma.groups.findMany({
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
                    select: { users_groups: true },
                },
            },
        });
        const mappedGroups = groups.map((group) => ({
            id: group.id,
            name: group.name,
            code: group.code,
            author: {
                name: group?.users?.name,
                surname: group?.users?.surname,
            },
            membersCount: group._count.users_groups,
        }));
        return mappedGroups;
    }
    async getGroupById(groupId) {
        const group = await lib_1.prisma.groups.findUnique({
            where: { id: groupId },
            select: {
                id: true,
                name: true,
                description: true,
                code: true,
                users: {
                    select: {
                        name: true,
                        surname: true,
                    },
                },
                _count: {
                    select: { users_groups: true },
                },
            },
        });
        if (!group) {
            return null;
        }
        return {
            id: group.id,
            name: group.name,
            description: group.description,
            code: group.code,
            author: {
                name: group?.users?.name,
                surname: group?.users?.surname,
            },
            membersCount: group._count.users_groups,
        };
    }
    async getGroupByCode(code) {
        return lib_1.prisma.groups.findUnique({
            where: { code },
            select: {
                id: true,
            },
        });
    }
    async isUserInGroup(userId, groupId) {
        return lib_1.prisma.users_groups.findUnique({
            where: {
                user_id_group_id: {
                    user_id: userId,
                    group_id: groupId,
                },
            },
        });
    }
    async joinGroup(userId, groupId) {
        return lib_1.prisma.users_groups.create({
            data: {
                user_id: userId,
                group_id: groupId,
            },
        });
    }
}
exports.GroupsRepository = GroupsRepository;
