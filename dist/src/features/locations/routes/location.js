"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationRoutes = locationRoutes;
const controllers_1 = require("../controllers");
const controller = new controllers_1.LocationController();
async function locationRoutes(fastify) {
    fastify.get("/cities", {
        handler: controller.getCities
    });
    fastify.get("/clubs", {
        handler: controller.getClubs
    });
}
