# LegalSaga AI ⚖️

An AI-powered legal document simplifier that helps ordinary citizens understand complex legal documents in plain language.

## 🌐 Live Demo
[https://legal-saga-ai-1.onrender.com](https://legal-saga-ai-1.onrender.com)

## 📌 Features
- 📄 Document Simplification — Converts complex legal language to plain English
- ⚠️ Risk Detection — Identifies risky clauses with High/Medium/Low severity
- 🔑 Key Information Extraction — Extracts important terms and obligations
- 💬 AI Q&A — Ask questions about your documents
- 📝 Document Writer — Generate new legal documents
- 🗺️ Legal Adviser Locator — Find nearby lawyers using GPS
- 📚 Law Library — Reference to Indian laws in plain language
- 🖼️ OCR Support — Upload scanned images and PDFs

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React.js + TypeScript + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | PostgreSQL (Neon Cloud) |
| AI Model | LLaMA 3.3 70B via Groq API |
| OCR | OCR.space API |
| Deployment | Render.com |
| ORM | Drizzle ORM |

## ⚙️ Installation

### Prerequisites
- Node.js v20.19.0 or higher
- PostgreSQL database (or Neon.tech account)
- Groq API key
- OCR.space API key

### Steps

1. Clone the repository
\`\`\`bash
git clone https://github.com/thusitha2001/Legal-Saga-AI.git
cd Legal-Saga-AI
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Create .env file in root directory
\`\`\`env
DATABASE_URL=your-postgresql-connection-string
SESSION_SECRET=your-random-secret-string
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.groq.com/openai/v1
AI_INTEGRATIONS_OPENAI_API_KEY=your-groq-api-key
OCR_SPACE_API_KEY=your-ocr-space-api-key
\`\`\`

4. Push database schema
\`\`\`bash
npm run db:push
\`\`\`

5. Start the application
\`\`\`bash
npm run dev
\`\`\`

6. Open browser and go to
\`\`\`
http://localhost:5000
\`\`\`

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string from Neon.tech |
| `SESSION_SECRET` | Random secret string for session encryption |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | Groq API base URL |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | Groq API key from console.groq.com |
| `OCR_SPACE_API_KEY` | OCR.space API key from ocr.space |

## 📁 Project Structure
\`\`\`
Legal-Saga-AI/
├── client/                 # React.js frontend
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── hooks/         # Custom React hooks
│       ├── lib/           # Utility functions
│       └── pages/         # Application pages
├── server/                # Express.js backend
│   ├── auth.ts           # Authentication logic
│   ├── db.ts             # Database connection
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Database operations
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema
└── script/               # Build scripts
\`\`\`

## 🚀 Deployment
The application is deployed on Render.com. Any push to the main branch triggers automatic deployment.

## 📄 License
MIT License — feel free to use and modify for your own projects.

## 👨‍💻 Author
**Thusitha Thulasi**
- GitHub: [@thusitha2001](https://github.com/thusitha2001)
- LinkedIn: [Your LinkedIn URL]

## 🙏 Acknowledgements
- [Groq](https://groq.com) for fast AI inference
- [OCR.space](https://ocr.space) for free OCR API
- [Neon](https://neon.tech) for serverless PostgreSQL
- [Render](https://render.com) for free hosting