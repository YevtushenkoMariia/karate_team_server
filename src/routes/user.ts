import { FastifyInstance } from 'fastify';
import { CreateUserSchema } from '../schemas/user';
import { UserController } from '../controllers/user';

const controller = new UserController();

export async function userRoutes(fastify: FastifyInstance) {

    fastify.post('/', 
        {
            schema: {
                body: CreateUserSchema
            },
            handler: controller.createUser,
        }
    )

    fastify.get('/:id', {
        schema: {
            params: {   
                id: { type: 'string' }
            }
        },
        handler: controller.getUserById,
    });



}