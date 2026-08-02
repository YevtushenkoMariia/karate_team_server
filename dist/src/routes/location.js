"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationRoutes = locationRoutes;
const location_1 = require("../controllers/location");
const controller = new location_1.LocationController();
async function locationRoutes(fastify) {
    fastify.get("/cities", {
        handler: controller.getCities
    });
    fastify.get("/clubs", {
        handler: controller.getClubs
    });
}
