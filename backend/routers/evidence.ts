import { Router } from "express";
import multer from "multer";
import { saveEvidenceFile } from "../services/evidence.ts";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();
const upload = multer();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

router.post("/upload_evidence", upload.single('file'), async (req, res) => {
  try {
    const { case_id, description = "" } = req.body;
    const file = req.file;

    if (!case_id || !file) {
      return res.status(400).json({ error: "case_id and file are required" });
    }

    const result = await saveEvidenceFile(
      case_id,
      description,
      file.originalname,
      file.buffer
    );

    res.json(result);
  } catch (error) {
    console.error("Evidence upload error:", error);
    res.status(500).json({ error: "Failed to save evidence" });
  }
});

router.post("/analyze_fir", upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Convert buffer to base64 for Gemini
    const base64Data = file.buffer.toString('base64');
    
    const prompt = `
      You are an Indian Legal Expert. Analyze this FIR document and extract:
      - FIR Number
      - Police Station
      - Sections Charged (BNS/IPC)
      - Date of Incident
      - Brief Summary of Allegations
      Return as a clean JSON object.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: file.mimetype
        }
      }
    ]);

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    res.json(jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: responseText });

  } catch (error) {
    console.error("FIR Analysis Error:", error);
    res.status(500).json({ error: "Failed to analyze FIR" });
  }
});

export default router;
