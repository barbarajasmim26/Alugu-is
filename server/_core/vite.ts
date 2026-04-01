import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        __dirname,
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
  // Resolve the dist/public directory
  // __dirname is server/_core, so we go up 2 levels to project root, then into dist/public
  const distPath = path.resolve(__dirname, "../..", "dist", "public");
  
  console.log(`[Server] __dirname: ${__dirname}`);
  console.log(`[Server] Resolved distPath: ${distPath}`);
  
  // Try multiple possible paths
  const possiblePaths = [
    distPath,
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve("/opt/render/project/src", "dist", "public"),
    path.resolve("/opt/render/project", "dist", "public"),
  ];
  
  let foundPath: string | null = null;
  
  for (const checkPath of possiblePaths) {
    console.log(`[Server] Checking: ${checkPath}`);
    if (fs.existsSync(checkPath)) {
      console.log(`[Server] ✓ Found at: ${checkPath}`);
      foundPath = checkPath;
      break;
    }
  }
  
  if (!foundPath) {
    console.error(`[Server] ERROR: Could not find dist/public in any of these locations:`);
    possiblePaths.forEach(p => console.error(`  - ${p}`));
    console.error(`[Server] Current working directory: ${process.cwd()}`);
    
    // List what's in the current directory
    try {
      const cwd = process.cwd();
      const files = fs.readdirSync(cwd);
      console.log(`[Server] Files in ${cwd}: ${files.join(", ")}`);
      
      if (fs.existsSync(path.join(cwd, "dist"))) {
        const distFiles = fs.readdirSync(path.join(cwd, "dist"));
        console.log(`[Server] Files in dist/: ${distFiles.join(", ")}`);
      }
    } catch (e) {
      console.error(`[Server] Could not list directory contents:`, e);
    }
  } else {
    console.log(`[Server] Using dist path: ${foundPath}`);
    
    // List files in dist/public for debugging
    try {
      const files = fs.readdirSync(foundPath);
      console.log(`[Server] Files in dist/public: ${files.join(", ")}`);
    } catch (e) {
      console.error(`[Server] Could not list files in dist/public:`, e);
    }
    
    app.use(express.static(foundPath));
  }

  // SPA routing: fall through to index.html for all unmatched routes
  app.use("*", (req, res) => {
    if (!foundPath) {
      console.error(`[Server] ERROR: No dist/public path found`);
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Build Error</title></head>
          <body>
            <h1>Build Error</h1>
            <p>dist/public directory not found</p>
            <p>Please ensure the build completed successfully.</p>
          </body>
        </html>
      `);
      return;
    }
    
    const indexPath = path.resolve(foundPath, "index.html");
    
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
          </body>
        </html>
      `);
    }
  });
}
