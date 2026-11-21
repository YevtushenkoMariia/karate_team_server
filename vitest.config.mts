import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    {
      name: "prisma-generated-typescript",
      enforce: "pre",
      resolveId(source, importer) {
        if (
          !importer?.includes("/generated/prisma/") ||
          !source.endsWith(".js")
        ) {
          return null;
        }

        return this.resolve(`${source.slice(0, -3)}.ts`, importer, {
          skipSelf: true,
        });
      },
    },
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
