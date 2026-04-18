import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
// Built assets are emitted into the Python package so they ship in the wheel.
// All asset URLs are rewritten to `/dashboard/_static/...` which is served by
// `fast_dashboards.core.spa.SpaDashboardRouter`.
export default defineConfig({
    plugins: [react()],
    base: "/dashboard/_static/",
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    build: {
        outDir: path.resolve(__dirname, "../src/fast_dashboards/static"),
        emptyOutDir: true,
        assetsDir: "assets",
        sourcemap: false,
    },
    server: {
        port: 5174,
        proxy: {
            // During `npm run dev`, proxy JSON endpoints to a locally running FastAPI.
            "/dashboard/api/endpoints": "http://localhost:8000",
            "/dashboard/api/test": "http://localhost:8000",
            "/dashboard/health/state": "http://localhost:8000",
            "/dashboard/queues/state": "http://localhost:8000",
            "/dashboard/secrets/state": "http://localhost:8000",
            "/dashboard/tenants/state": "http://localhost:8000",
            "/dashboard/workflows/state": "http://localhost:8000",
        },
    },
});
