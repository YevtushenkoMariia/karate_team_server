import { FastifyInstance } from "fastify";
import { LocationController } from "../controllers";


const controller = new LocationController();

export async function locationRoutes(fastify: FastifyInstance){

    fastify.get("/cities", {
        handler: controller.getCities
    });

    fastify.get("/clubs", {
        handler: controller.getClubs
    });


}
