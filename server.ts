import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

// Initialize Firebase Admin
const configPath = path.resolve(process.cwd(), "firebase-applet-config.json");
let projectId = "gen-lang-client-0791564266";
let databaseId = "(default)";
if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  projectId = config.projectId;
  if (config.firestoreDatabaseId) {
    databaseId = config.firestoreDatabaseId;
  }
}

const appAdmin = admin.initializeApp({
  projectId: projectId,
});

const db = getFirestore(appAdmin, databaseId);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Middleware to verify Firebase Auth token
  const verifyToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split("Bearer ")[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      (req as any).user = decodedToken;
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ error: "Unauthorized" });
    }
  };

  // Middleware to verify Admin role
  const verifyAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = (req as any).user;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }
    next();
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // POST /auth/set-role
  // Admin only: Update Firestore role AND set Custom Claim atomically
  app.post("/api/auth/set-role", verifyToken, verifyAdmin, async (req, res) => {
    const { targetUid, role } = req.body;
    if (!targetUid || !role || !["citizen", "moderator", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid parameters" });
    }

    try {
      // Set custom claim
      await admin.auth().setCustomUserClaims(targetUid, { role });
      
      // Update Firestore
      await db.collection("users").doc(targetUid).update({ role });

      res.json({ success: true, message: `Role updated to ${role} for user ${targetUid}` });
    } catch (error) {
      console.error("Error setting role:", error);
      res.status(500).json({ error: "Failed to set role" });
    }
  });

  // POST /auth/suspend
  // Admin only: Set isSuspended: true in Firestore and revoke refresh tokens
  app.post("/api/auth/suspend", verifyToken, verifyAdmin, async (req, res) => {
    const { targetUid, suspend } = req.body;
    if (!targetUid || typeof suspend !== "boolean") {
      return res.status(400).json({ error: "Invalid parameters" });
    }

    try {
      await db.collection("users").doc(targetUid).update({ isSuspended: suspend });

      if (suspend) {
        await admin.auth().revokeRefreshTokens(targetUid);
      }

      res.json({ success: true, message: `User ${targetUid} suspension status set to ${suspend}` });
    } catch (error) {
      console.error("Error suspending user:", error);
      res.status(500).json({ error: "Failed to suspend user" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
