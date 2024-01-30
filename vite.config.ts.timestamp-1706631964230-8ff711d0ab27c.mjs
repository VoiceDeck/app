// vite.config.ts
import million from "file:///Users/cjrose/Documents/VoiceDeck/app/node_modules/.pnpm/million@2.6.4/node_modules/million/dist/packages/compiler.mjs";
import { unstable_vitePlugin as remix } from "file:///Users/cjrose/Documents/VoiceDeck/app/node_modules/.pnpm/@remix-run+dev@2.5.0_@remix-run+serve@2.5.0_typescript@5.3.3_vite@5.0.11/node_modules/@remix-run/dev/dist/index.js";
import { defineConfig } from "file:///Users/cjrose/Documents/VoiceDeck/app/node_modules/.pnpm/vite@5.0.11/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///Users/cjrose/Documents/VoiceDeck/app/node_modules/.pnpm/vite-tsconfig-paths@4.2.3_typescript@5.3.3_vite@5.0.11/node_modules/vite-tsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [million.vite({ auto: true }), remix(), tsconfigPaths()],
  test: {
    include: ["./app/**/*.test.ts"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvY2pyb3NlL0RvY3VtZW50cy9Wb2ljZURlY2svYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvY2pyb3NlL0RvY3VtZW50cy9Wb2ljZURlY2svYXBwL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9janJvc2UvRG9jdW1lbnRzL1ZvaWNlRGVjay9hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgbWlsbGlvbiBmcm9tICdtaWxsaW9uL2NvbXBpbGVyJztcbmltcG9ydCB7IHVuc3RhYmxlX3ZpdGVQbHVnaW4gYXMgcmVtaXggfSBmcm9tIFwiQHJlbWl4LXJ1bi9kZXZcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbbWlsbGlvbi52aXRlKHsgYXV0bzogdHJ1ZSB9KSwgcmVtaXgoKSwgdHNjb25maWdQYXRocygpXSxcbiAgdGVzdDoge1xuICAgICAgICAgIGluY2x1ZGU6IFtcIi4vYXBwLyoqLyoudGVzdC50c1wiXSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFpUyxPQUFPLGFBQWE7QUFDclQsU0FBUyx1QkFBdUIsYUFBYTtBQUM3QyxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLG1CQUFtQjtBQUUxQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsUUFBUSxLQUFLLEVBQUUsTUFBTSxLQUFLLENBQUMsR0FBRyxNQUFNLEdBQUcsY0FBYyxDQUFDO0FBQUEsRUFDaEUsTUFBTTtBQUFBLElBQ0UsU0FBUyxDQUFDLG9CQUFvQjtBQUFBLEVBQ3RDO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
