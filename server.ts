import express from "express";
import path from "node:path";
import { createServer as createViteServer } from "vite";
import intakeRouter from "./backend/routers/intake.ts";
import evidenceRouter from "./backend/routers/evidence.ts";
import ngoRouter from "./backend/routers/ngo.ts";
import { getCases, saveCase, getReminders, saveReminder } from "./backend/services/persistence.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", platform: "BailBridge / Namma Nyaya Agent" });
  });

  // Mount Ported Routers
  app.use("/api", intakeRouter);
  app.use("/api", evidenceRouter);
  app.use("/api", ngoRouter);

  // Persistence Routes (Firestore)
  app.get("/api/cases", async (req, res) => {
    try {
      const cases = await getCases();
      res.json(cases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cases" });
    }
  });

  app.post("/api/cases", async (req, res) => {
    try {
      const newCase = await saveCase(req.body);
      res.json(newCase);
    } catch (error) {
      res.status(500).json({ error: "Failed to save case" });
    }
  });

  app.get("/api/reminders", async (req, res) => {
    try {
      const reminders = await getReminders();
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reminders" });
    }
  });

  app.post("/api/reminders", async (req, res) => {
    try {
      const newReminder = await saveReminder(req.body);
      res.json(newReminder);
    } catch (error) {
      res.status(500).json({ error: "Failed to save reminder" });
    }
  });

  // Mock e-Courts API Data (Existing)
  app.get("/api/hearings", (req, res) => {
    res.json([
      {
        id: "h1",
        date: "2026-06-15",
        room: "Court Room 4, 2nd Floor",
        judge: "Hon'ble Justice A.K. Sharma",
        caseNumber: "BA/1042/2026",
        status: "Upcoming",
        type: "Bail Hearing"
      },
      {
        id: "h2",
        date: "2026-05-12",
        room: "Court Room 12, Ground Floor",
        judge: "Hon'ble Magistrate S. Roy",
        caseNumber: "FIR/442/2026",
        status: "Completed",
        type: "Remand Extension"
      }
    ]);
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
