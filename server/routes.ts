import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";
import multer from "multer";

let _pdfParse: ((buffer: Buffer, options?: object) => Promise<{ text: string }>) | null = null;
async function getPdfParse() {
  if (!_pdfParse) {
    try {
      const mod = await import("pdf-parse");
      _pdfParse = (mod.default || mod) as typeof _pdfParse;
    } catch {
      throw new Error("pdf-parse could not be loaded");
    }
  }
  return _pdfParse!;
}

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/tiff",
      "image/bmp",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and image files are allowed (JPG, PNG, WEBP, GIF, TIFF, BMP)"));
    }
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ─── IP-based Location Detection ──────────────────────────────────────────
  app.get("/api/detect-location", async (req, res) => {
    try {
      const forwardedFor = req.headers["x-forwarded-for"];
      const rawIp =
        (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(",")[0]) ||
        req.socket.remoteAddress ||
        "";
      const ip = rawIp.replace("::ffff:", "").trim();

      const apiUrl = ip && ip !== "127.0.0.1" && ip !== "::1"
        ? `http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,lat,lon`
        : `http://ip-api.com/json/?fields=status,message,country,regionName,city,lat,lon`;

      const response = await fetch(apiUrl);
      const data = (await response.json()) as {
        status: string;
        message?: string;
        country?: string;
        regionName?: string;
        city?: string;
        lat?: number;
        lon?: number;
      };

      if (data.status === "success") {
        return res.json({
          city: data.city || "",
          state: data.regionName || "",
          lat: data.lat ?? 20.5937,
          lon: data.lon ?? 78.9629,
          country: data.country || "",
        });
      }

      return res.status(400).json({ message: "Could not detect location from IP" });
    } catch {
      return res.status(500).json({ message: "Location detection failed" });
    }
  });

  // ─── Nearby Lawyers via OpenStreetMap Overpass API ───────────────────────
  app.get("/api/nearby-lawyers", async (req, res) => {
    const lat = parseFloat(req.query.lat as string);
    const lon = parseFloat(req.query.lon as string);
    const radius = Math.min(parseInt(req.query.radius as string) || 10000, 20000);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ message: "Invalid lat/lon" });
    }

    const overpassQuery = `
      [out:json][timeout:20];
      (
        node["office"="lawyer"](around:${radius},${lat},${lon});
        node["office"="advocate"](around:${radius},${lat},${lon});
        node["office"="notary"](around:${radius},${lat},${lon});
        node["office"="legal_services"](around:${radius},${lat},${lon});
        way["office"="lawyer"](around:${radius},${lat},${lon});
        way["office"="advocate"](around:${radius},${lat},${lon});
      );
      out body center;
    `;

    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(overpassQuery)}`,
      });

      if (!response.ok) throw new Error("Overpass API failed");
      const data = (await response.json()) as {
        elements: Array<{
          id: number;
          lat?: number;
          lon?: number;
          center?: { lat: number; lon: number };
          tags?: Record<string, string>;
        }>;
      };

      function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      }

      const lawyers = data.elements
        .map((el) => {
          const elLat = el.lat ?? el.center?.lat ?? lat;
          const elLon = el.lon ?? el.center?.lon ?? lon;
          const tags = el.tags || {};
          return {
            id: el.id,
            name: tags.name || tags["name:en"] || "Law Office",
            office: tags.office || "lawyer",
            address: [
              tags["addr:housenumber"],
              tags["addr:street"],
              tags["addr:suburb"],
              tags["addr:city"],
              tags["addr:state"],
            ]
              .filter(Boolean)
              .join(", ") || tags["addr:full"] || "",
            phone: tags.phone || tags["contact:phone"] || "",
            website: tags.website || tags["contact:website"] || "",
            email: tags.email || tags["contact:email"] || "",
            lat: elLat,
            lon: elLon,
            distanceKm: Math.round(haversine(lat, lon, elLat, elLon) * 10) / 10,
          };
        })
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 20);

      return res.json({ lawyers, total: lawyers.length });
    } catch {
      return res.status(500).json({ message: "Could not fetch nearby lawyers" });
    }
  });

  // ─── Extract text from PDF or Image (OCR) ─────────────────────────────────
  app.post("/api/extract-text", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { mimetype, buffer, originalname } = req.file;
      let extractedText = "";
      const base64 = buffer.toString("base64");

      // Try OCR.space for all file types
      try {
        const formData = new FormData();
        formData.append("base64Image", `data:${mimetype};base64,${base64}`);
        formData.append("language", "eng");
        formData.append("isOverlayRequired", "false");
        formData.append("detectOrientation", "true");
        formData.append("scale", "true");
        formData.append("isTable", "false");
        formData.append("OCREngine", "2");

        const ocrResponse = await fetch("https://api.ocr.space/parse/image", {
          method: "POST",
          headers: {
            "apikey": process.env.OCR_SPACE_API_KEY || "",
          },
          body: formData,
        });

        const ocrData = await ocrResponse.json() as any;
        if (ocrData?.ParsedResults?.[0]?.ParsedText) {
          extractedText = ocrData.ParsedResults[0].ParsedText.trim();
        }
      } catch (ocrErr) {
        console.error("OCR.space error:", ocrErr);
      }

      // Fallback to pdf-parse for normal PDFs
      if (!extractedText && mimetype === "application/pdf") {
        try {
          const pdfParse = await getPdfParse();
          const data = await pdfParse(buffer);
          extractedText = data.text?.trim() || "";
        } catch (pdfErr) {
          console.error("pdf-parse error:", pdfErr);
        }
      }

      if (!extractedText) {
        return res.status(422).json({ message: "Could not extract text from the file. Please try a clearer image or paste the text manually." });
      }

      res.json({ text: extractedText, filename: originalname });
    } catch (err: any) {
      console.error("extract-text error:", err);
      if (err.message?.includes("Only PDF")) {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: "Failed to extract text from file" });
    }
  });

  // ─── Document List ─────────────────────────────────────────────────────────
  app.get(api.documents.list.path, async (_req, res) => {
    try {
      const docs = await storage.getAllDocuments();
      res.json(docs);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // ─── Document Get ──────────────────────────────────────────────────────────
  app.get(api.documents.get.path, async (req, res) => {
    try {
      const doc = await storage.getDocument(Number(req.params.id));
      if (!doc) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(doc);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });

  // ─── Document Delete ───────────────────────────────────────────────────────
  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const doc = await storage.getDocument(Number(req.params.id));
      if (!doc) {
        return res.status(404).json({ message: "Document not found" });
      }
      await storage.deleteDocument(Number(req.params.id));
      res.json({ message: "Document deleted" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  // ─── Document Create (AI Analysis) ────────────────────────────────────────
  app.post(api.documents.create.path, async (req, res) => {
    try {
      const input = api.documents.create.input.parse(req.body);

      const systemPrompt = `You are a legal assistant that simplifies complex legal documents for ordinary people in India.
      The target language is ${input.language}.
      
      Extract the following information from the provided document text and return it as JSON:
      1. "simplifiedText": A plain-language summary of the document that an ordinary person can easily understand.
      2. "risks": A list of potential risks or unfair clauses. Each risk must have a "severity" ("high", "medium", or "low") and a "description" in ${input.language}.
      3. "keyInfo": A list of key terms (e.g., obligations, deadlines, financial terms). Each item must have a "type" (string) and a "description" in ${input.language}.
      `;

      const response = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: input.originalText }
        ],
        response_format: { type: "json_object" }
      });

      let llmResult;
      try {
        llmResult = JSON.parse(response.choices[0]?.message?.content || "{}");
      } catch (parseErr) {
        throw new Error("Failed to parse LLM response");
      }

      const docToCreate = {
        ...input,
        simplifiedText: llmResult.simplifiedText || "Could not generate simplification.",
        risks: Array.isArray(llmResult.risks) ? llmResult.risks : [],
        keyInfo: Array.isArray(llmResult.keyInfo) ? llmResult.keyInfo : [],
      };

      const doc = await storage.createDocument(docToCreate);
      res.status(201).json(doc);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error(err);
      res.status(500).json({ message: "Internal server error processing document" });
    }
  });

  // ─── Questions List ────────────────────────────────────────────────────────
  app.get(api.questions.list.path, async (req, res) => {
    try {
      const questions = await storage.getQuestions(Number(req.params.id));
      res.json(questions);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // ─── Ask Question ──────────────────────────────────────────────────────────
  app.post(api.questions.ask.path, async (req, res) => {
    try {
      const docId = Number(req.params.id);
      const doc = await storage.getDocument(docId);
      if (!doc) {
        return res.status(404).json({ message: "Document not found" });
      }

      const input = api.questions.ask.input.parse(req.body);

      const systemPrompt = `You are a helpful legal assistant for ordinary citizens. Answer the user's question based on the following document context:
      
      Title: ${doc.title}
      Original Text: ${doc.originalText}
      
      Please answer the question accurately, simply, and in ${doc.language}. Do not use complex legal jargon.`;

      const response = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: input.question }
        ],
      });

      const answer = response.choices[0]?.message?.content || "I'm sorry, I couldn't generate an answer.";

      const questionRecord = await storage.createQuestion({
        documentId: docId,
        question: input.question,
        answer: answer
      });

      res.status(201).json(questionRecord);

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error(err);
      res.status(500).json({ message: "Failed to process question" });
    }
  });

  // ─── AI Legal Document Generator ──────────────────────────────────────────
  app.post("/api/generate-document", async (req, res) => {
    try {
      const schema = z.object({
        documentType: z.string().min(1),
        fields: z.record(z.string()),
        language: z.string().default("English"),
      });

      const { documentType, fields, language } = schema.parse(req.body);

      const fieldsSummary = Object.entries(fields)
        .filter(([, v]) => v && v.trim())
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");

      const systemPrompt = `You are an expert Indian legal document drafter with deep knowledge of Indian contract law, the Indian Contract Act 1872, and relevant state laws.

Draft a complete, professional, legally sound ${documentType} in ${language} using the details provided by the user.

Important instructions:
1. Use proper legal formatting with numbered clauses and sub-clauses.
2. Include all standard clauses required for this document type under Indian law.
3. Use clear, formal language. Do not omit important protective clauses.
4. Include standard boilerplate clauses: jurisdiction, dispute resolution, entire agreement, severability, and governing law.
5. Format using markdown: use ## for section headings, **bold** for party names, and numbered lists for clauses.
6. At the top, include a proper document title and preamble.
7. At the bottom, include signature blocks for all parties with date and witness lines.
8. Keep the output as a complete, ready-to-use document.`;

      const userPrompt = `Draft a ${documentType} with the following details:\n\n${fieldsSummary}`;

      const response = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });

      const generatedText = response.choices[0]?.message?.content?.trim() || "";

      if (!generatedText) {
        return res.status(500).json({ message: "Failed to generate document" });
      }

      res.json({ document: generatedText, documentType, language });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("generate-document error:", err);
      res.status(500).json({ message: "Failed to generate document" });
    }
  });

  return httpServer;
}