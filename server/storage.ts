import { documents, documentQuestions, users, type InsertDocument, type InsertQuestion, type InsertUser } from "@shared/schema";

// ── Types ──────────────────────────────────────────────────────────────────
type Document = typeof documents.$inferSelect;
type DocumentQuestion = typeof documentQuestions.$inferSelect;
type User = typeof users.$inferSelect;

type CreateDocumentData = InsertDocument & {
  simplifiedText: string;
  risks: { severity: "high" | "medium" | "low"; description: string }[];
  keyInfo: { type: string; description: string }[];
};

export interface IStorage {
  getAllDocuments(): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(doc: CreateDocumentData): Promise<Document>;
  deleteDocument(id: number): Promise<void>;
  getQuestions(documentId: number): Promise<DocumentQuestion[]>;
  createQuestion(question: InsertQuestion & { answer: string }): Promise<DocumentQuestion>;
}

// ── Database storage (used when DATABASE_URL is set) ──────────────────────
class DatabaseStorage implements IStorage {
  private db: any;
  private schema: any;
  private eq: any;

  constructor(db: any, schema: any, eq: any) {
    this.db = db;
    this.schema = schema;
    this.eq = eq;
  }

  async getAllDocuments() {
    return await this.db.select().from(this.schema.documents);
  }

  async getDocument(id: number) {
    const [doc] = await this.db.select().from(this.schema.documents).where(this.eq(this.schema.documents.id, id));
    return doc;
  }

  async createDocument(doc: CreateDocumentData) {
    const [newDoc] = await this.db.insert(this.schema.documents).values(doc).returning();
    return newDoc;
  }

  async deleteDocument(id: number) {
    await this.db.delete(this.schema.documentQuestions).where(this.eq(this.schema.documentQuestions.documentId, id));
    await this.db.delete(this.schema.documents).where(this.eq(this.schema.documents.id, id));
  }

  async getQuestions(documentId: number) {
    return await this.db.select().from(this.schema.documentQuestions).where(this.eq(this.schema.documentQuestions.documentId, documentId));
  }

  async createQuestion(question: InsertQuestion & { answer: string }) {
    const [newQuestion] = await this.db.insert(this.schema.documentQuestions).values(question).returning();
    return newQuestion;
  }
}

// ── In-memory storage (used when DATABASE_URL is not set) ─────────────────
class MemoryStorage implements IStorage {
  private docs: Document[] = [];
  private questions: DocumentQuestion[] = [];
  private docCounter = 1;
  private qCounter = 1;

  async getAllDocuments() {
    return [...this.docs];
  }

  async getDocument(id: number) {
    return this.docs.find(d => d.id === id);
  }

  async createDocument(doc: CreateDocumentData) {
    const newDoc: Document = {
      id: this.docCounter++,
      userId: doc.userId ?? null,
      title: doc.title,
      originalText: doc.originalText,
      simplifiedText: doc.simplifiedText,
      risks: doc.risks as any,
      keyInfo: doc.keyInfo as any,
      language: doc.language ?? "English",
      createdAt: new Date(),
    };
    this.docs.push(newDoc);
    return newDoc;
  }

  async deleteDocument(id: number) {
    this.docs = this.docs.filter(d => d.id !== id);
    this.questions = this.questions.filter(q => q.documentId !== id);
  }

  async getQuestions(documentId: number) {
    return this.questions.filter(q => q.documentId === documentId);
  }

  async createQuestion(question: InsertQuestion & { answer: string }) {
    const newQ: DocumentQuestion = {
      id: this.qCounter++,
      documentId: question.documentId,
      question: question.question,
      answer: question.answer,
      createdAt: new Date(),
    };
    this.questions.push(newQ);
    return newQ;
  }
}

// ── Factory: pick DB or memory based on env ───────────────────────────────
async function createStorage(): Promise<IStorage> {
  if (process.env.DATABASE_URL) {
    try {
      const { drizzle } = await import("drizzle-orm/node-postgres");
      const pg = await import("pg");
      const schema = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");

      const pool = new pg.default.Pool({ connectionString: process.env.DATABASE_URL });
      // Quick connectivity check
      await pool.query("SELECT 1");
      const db = drizzle(pool, { schema });
      console.log("[storage] Connected to PostgreSQL");
      return new DatabaseStorage(db, schema, eq);
    } catch (err: any) {
      console.warn(`[storage] PostgreSQL unavailable (${err.message}). Falling back to in-memory storage.`);
    }
  } else {
    console.warn("[storage] DATABASE_URL not set. Using in-memory storage (data will not persist).");
  }
  return new MemoryStorage();
}

// Singleton promise — routes.ts imports `storage` and awaits it once
let _storage: IStorage | null = null;
const _storagePromise = createStorage().then(s => { _storage = s; return s; });

export async function getStorage(): Promise<IStorage> {
  return _storagePromise;
}

// Sync accessor used after init (safe because routes are registered after await)
export const storage = new Proxy({} as IStorage, {
  get(_target, prop) {
    if (!_storage) throw new Error("Storage not yet initialised — await getStorage() first");
    return (_storage as any)[prop];
  }
});