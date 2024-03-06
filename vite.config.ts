import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import { flatRoutes } from "remix-flat-routes";
import tsconfigPaths from "vite-tsconfig-paths";
import million from "million/compiler";
import { nodePolyfills } from "vite-plugin-node-polyfills";
installGlobals();

export default defineConfig({
  plugins: [
    million.vite({ auto: true }),
    remix({
      ignoredRouteFiles: ["**/.*"],
      routes: async (defineRoutes) => {
        return flatRoutes("routes", defineRoutes, {
          ignoredRouteFiles: [
            ".*",
            "**/*.css",
            "**/*.test.{js,jsx,ts,tsx}",
            "**/__*.*",
          ],
        });
      },
    }),
    tsconfigPaths(),
  ],
  build: {
    target: "ES2022",
  },
});
