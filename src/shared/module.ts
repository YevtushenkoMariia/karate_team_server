import type { FastifyPluginAsync } from "fastify";

// What every module hands to the composition root (app.ts).
export type AppModule = {
  name: string;
  prefix: string;
  routes: FastifyPluginAsync;
};
