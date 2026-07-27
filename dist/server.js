"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const startServer = async () => {
    const app = (0, index_1.buildApp)();
    try {
        await app.listen({ port: 4000 });
        console.log("Server is running on http://localhost:4000");
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};
startServer();
