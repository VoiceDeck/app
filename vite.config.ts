import million from "million/compiler";
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [million.vite({auto: true}), remix(), tsconfigPaths()],
  test: {
    include: ["./app/**/*.test.ts"],
    reporters: ["verbose"],
  },
});
