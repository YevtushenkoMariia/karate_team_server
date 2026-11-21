export type AppConfig = {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  corsOrigin: string | undefined;
};

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Read and validate env once at startup, so a missing secret fails fast
// instead of on the first request.
export function loadConfig(): AppConfig {
  return {
    port: Number(process.env.PORT ?? 4000),
    databaseUrl: required("DATABASE_URL"),
    jwtSecret: required("JWT_SECRET"),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
    corsOrigin: process.env.ORIGIN_FRONTEND_URL,
  };
}
