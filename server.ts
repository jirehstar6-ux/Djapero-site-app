import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import multer from "multer";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

async function startServer() {
  // Configuration
  app.use(cors());

  const UPLOADS_DIR = path.join(__dirname, "uploads");
  const DATA_FILE = path.join(__dirname, "data.json");

  // Ensure directories and files exist
  await fs.ensureDir(UPLOADS_DIR);
  if (!fs.existsSync(DATA_FILE)) {
    await fs.writeJson(DATA_FILE, {
      products: [],
      videos: [],
      services: [],
      reals: [],
      notifications: [],
      marketItems: [],
      settings: {
        whatsapp: "22892052664",
        call: "22892052664",
      },
    });
  }

  // Multer for uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  });
  const upload = multer({
    storage: storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  });

  // Dedicated upload route BEFORE body parsers to avoid interference
  app.post("/api/upload", (req, res, next) => {
    console.log(`[${new Date().toISOString()}] POST /api/upload - Start`);
    next();
  }, upload.single("file"), (req, res) => {
    if (!req.file) {
      console.error(`[${new Date().toISOString()}] POST /api/upload - No file received`);
      return res.status(400).json({ error: "Aucun fichier reçu" });
    }
    console.log(`[${new Date().toISOString()}] POST /api/upload - Success: ${req.file.filename} (${req.file.size} bytes)`);
    res.json({ url: `/uploads/${req.file.filename}` });
  });

  app.use(express.json({ limit: "500mb" }));
  app.use(express.urlencoded({ extended: true, limit: "500mb" }));
  
  // API Routes
  app.get("/api/data", async (req, res) => {
    try {
      const data = await fs.readJson(DATA_FILE);
      // Normalize data with default empty arrays if missing
      const normalizedData = {
        products: data.products || [],
        videos: data.videos || [],
        services: data.services || [],
        reals: data.reals || [],
        notifications: data.notifications || [],
        marketItems: data.marketItems || [],
        settings: data.settings || {
            whatsapp: "22892052664",
            call: "22892052664",
        },
      };
      res.json(normalizedData);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la lecture des données" });
    }
  });

  app.post("/api/save", async (req, res) => {
    try {
      await fs.writeJson(DATA_FILE, req.body, { spaces: 2 });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la sauvegarde des données" });
    }
  });

  app.post("/api/delete-file", async (req, res) => {
    try {
      const { filePath } = req.body;
      if (!filePath) return res.status(400).json({ error: "Chemin du fichier manquant" });
      const fileName = path.basename(filePath);
      const fullPath = path.join(UPLOADS_DIR, fileName);
      if (await fs.pathExists(fullPath)) {
        await fs.remove(fullPath);
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Fichier non trouvé" });
      }
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la suppression du fichier" });
    }
  });

  // Catch-all for API routes to prevent falling through to SPA fallback
  app.all("/api/*", (req, res) => {
    console.warn(`[${new Date().toISOString()}] Unhandled API request: ${req.method} ${req.url}`);
    res.status(404).json({ error: `Route API non trouvée: ${req.method} ${req.url}` });
  });

  // Error handling middleware
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(`[${new Date().toISOString()}] Server Error:`, err);
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ error: "Fichier trop volumineux. La limite est de 500Mo." });
      }
      return res.status(400).json({ error: `Erreur Multer: ${err.message}` });
    }
    res.status(err.status || 500).json({ error: err.message || "Erreur interne du serveur" });
  });

  // Serve static files
  app.use("/uploads", express.static(UPLOADS_DIR));

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

  // Increase timeout for large file uploads (30 minutes)
  server.timeout = 1800000;
  server.headersTimeout = 1800000;
  server.requestTimeout = 1800000;
  server.keepAliveTimeout = 60000;
}

startServer();
