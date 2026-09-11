"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const features_1 = require("./features");
function registerRoutes(app) {
    app.register(features_1.authRoutes, { prefix: "/api/auth" });
    app.register(features_1.userRoutes, { prefix: "/api/user" });
    app.register(features_1.locationRoutes, { prefix: "/api/location" });
    app.register(features_1.groupsRoutes, { prefix: "/api/:userId/groups" });
}
