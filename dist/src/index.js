"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const logger_1 = require("./utils/logger");
const startServer = async () => {
    const app = await (0, app_1.buildApp)();
    const portValue = process.env.PORT || '4000';
    try {
        await app.listen({
            port: parseInt(portValue), host: '0.0.0.0'
        });
        console.log(`Server is running on http://localhost:${portValue}`);
        logger_1.logger.info(`Server is running on http://localhost:${portValue}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
startServer();
