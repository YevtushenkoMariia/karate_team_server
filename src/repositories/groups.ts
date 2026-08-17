
import { prisma } from "../lib/prisma";

export class GroupsRepository {

    async getUserGroups(userId: number) {
  const groups = await prisma.groups.findMany({
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

    async getGroupById(groupId: number) {
        const group = await prisma.groups.findUnique({
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
                name: group.users.name,
                surname: group.users.surname,
            },
            membersCount: group._count.users_groups,
        };
    }

    async getGroupByCode(code: string) {
        return prisma.groups.findUnique({
            where: { code },
            select: {
                id: true,
            },
        });
    }

    async isUserInGroup(userId: number, groupId: number) {
        return prisma.users_groups.findUnique({
            where: {
                user_id_group_id: {
                    user_id: userId,
                    group_id: groupId,
                },
            },
        });
    }

    async joinGroup(userId: number, groupId: number) {
        return prisma.users_groups.create({
            data: {
                user_id: userId,
                group_id: groupId,
            },
        });
    }

}

