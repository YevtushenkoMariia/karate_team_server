import { role_type } from '../../generated/prisma/client';
import { prisma } from '../lib/prisma';

export class UserRepository {

    async createUser(data: { 
        name: string,
        surname: string,
        email: string, 
        password: string, 
        role: role_type }) {
            return prisma.users.create({
                data: {
                    name: data.name,
                    surname: data.surname,
                    email: data.email,
                    password: data.password,
                    role: data.role,
                }
            });
        }


        async checkUserExists(email: string) {
            return prisma.users.findUnique({
                where: { email: email }
            });
        }



}
