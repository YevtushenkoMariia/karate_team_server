import { FastifyRequest, FastifyReply } from 'fastify';
// import { UserService } from '../services/user';
import { CreateUserBody } from '../schemas/user';


export class UserController {

    async createUser(
        request: FastifyRequest<{ Body: CreateUserBody }>,
        reply: FastifyReply) {
        // const user = await UserService.createUser(request.body);
        return reply.status(201).send();
    }
    
    async getUserById(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply) {
        // const user = await UserService.getUserById(request.params.id);
        return reply.send();
    }

}