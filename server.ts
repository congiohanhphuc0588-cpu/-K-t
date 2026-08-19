import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const DATA_FILE = path.join(process.cwd(), "results-data.json");

// Helper to load results
function loadResults() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error loading results:", err);
  }
  return [];
}

// Helper to save results
function saveResults(data: any[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving results:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API endpoints
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Get all results
  app.get("/api/results", (_req, res) => {
    const results = loadResults();
    res.json({ success: true, data: results });
  });

  // Submit new result
  app.post("/api/results", (req, res) => {
    const { studentName, className, schoolName, mode, durationSeconds, scores, detailedResults, submittedAt } = req.body;
    
    if (!studentName || !className) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin học sinh hoặc lớp" });
    }

    const currentResults = loadResults();
    const newEntry = {
      id: "res_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      studentName: studentName.trim(),
      className: className.trim(),
      schoolName: (schoolName || "").trim(),
      mode: mode || "exam", // 'exam' or 'practice'
      durationSeconds: durationSeconds || 0,
      scores: {
        part1: scores?.part1 ?? 0, // MCQ (max 2.5)
        part2: scores?.part2 ?? 0, // True/False (max 2.5)
        part3: scores?.part3 ?? 0, // Drag & Drop (max 2.5)
        part4: scores?.part4 ?? 0, // Fill in blanks (max 2.5)
        total: scores?.total ?? 0, // Scale 10
      },
      detailedResults: detailedResults || {},
      submittedAt: submittedAt || new Date().toISOString(),
    };

    currentResults.unshift(newEntry);
    saveResults(currentResults);

    return res.status(201).json({ success: true, entry: newEntry });
  });

  // Clear/Reset test results (for teacher)
  app.delete("/api/results", (req, res) => {
    const { id } = req.query;
    let currentResults = loadResults();
    if (id) {
      currentResults = currentResults.filter((r: any) => r.id !== id);
    } else {
      currentResults = [];
    }
    saveResults(currentResults);
    res.json({ success: true, message: "Đã cập nhật danh sách kết quả" });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Địa Lí 10 App Server running on http://localhost:${PORT}`);
  });
}

startServer();
