import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // Build output directory - Vite outputs to dist/public
  const distPath = path.resolve(import.meta.dirname, "..", "..", "dist", "public");
  
  console.log(`[Server] Attempting to serve static files from: ${distPath}`);
  
  if (!fs.existsSync(distPath)) {
    console.error(`[Server] ERROR: Build directory not found at: ${distPath}`);
    console.error(`[Server] This usually means the build process didn't complete successfully`);
    console.error(`[Server] Make sure to run: pnpm build`);
    
    // Fallback: Try to serve from current directory structure
    const fallbackPath = path.resolve(import.meta.dirname, "..", "..", "dist");
    if (fs.existsSync(fallbackPath)) {
      console.log(`[Server] Found fallback dist directory at: ${fallbackPath}`);
      app.use(express.static(fallbackPath));
    }
  } else {
    console.log(`[Server] ✓ Build directory found`);
    
    // List files in dist/public for debugging
    try {
      const files = fs.readdirSync(distPath);
      console.log(`[Server] Files in dist/public: ${files.join(", ")}`);
    } catch (e) {
      console.error(`[Server] Could not list files in dist/public:`, e);
    }
    
    app.use(express.static(distPath));
  }

  // SPA routing: fall through to index.html for all unmatched routes
  app.use("*", (req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    
    if (fs.existsSync(indexPath)) {
      console.log(`[Server] Serving index.html for route: ${req.path}`);
      res.sendFile(indexPath);
    } else {
      console.error(`[Server] ERROR: index.html not found at: ${indexPath}`);
      res.status(404).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Build Error</title></head>
          <body>
            <h1>Build Error</h1>
            <p>index.html not found at: ${indexPath}</p>
            <p>Please ensure the build completed successfully.</p>
            <p>Run: pnpm build</p>
          </body>
        </html>
      `);
    }
  });
}
