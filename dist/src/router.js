"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const user_1 = require("./routes/user");
const location_1 = require("./routes/location");
const auth_1 = require("./routes/auth");
function registerRoutes(app) {
    app.register(auth_1.authRoutes, { prefix: "/api/auth" });
    app.register(user_1.userRoutes, { prefix: "/api/user" });
    app.register(location_1.locationRoutes, { prefix: "/api/location" });
}
