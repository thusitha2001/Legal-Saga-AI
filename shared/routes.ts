import { z } from 'zod';
import { insertDocumentSchema, documents, documentQuestions } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  documents: {
    list: {
      method: 'GET' as const,
      path: '/api/documents' as const,
      responses: {
        200: z.array(z.custom<typeof documents.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/documents/:id' as const,
      responses: {
        200: z.custom<typeof documents.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/documents' as const,
      input: insertDocumentSchema,
      responses: {
        201: z.custom<typeof documents.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  questions: {
    list: {
      method: 'GET' as const,
      path: '/api/documents/:id/questions' as const,
      responses: {
        200: z.array(z.custom<typeof documentQuestions.$inferSelect>()),
      },
    },
    ask: {
      method: 'POST' as const,
      path: '/api/documents/:id/questions' as const,
      input: z.object({
        question: z.string()
      }),
      responses: {
        201: z.custom<typeof documentQuestions.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// Type exports
export type DocumentInput = z.infer<typeof api.documents.create.input>;
export type DocumentResponse = z.infer<typeof api.documents.create.responses[201]>;
export type QuestionInput = z.infer<typeof api.questions.ask.input>;
export type QuestionResponse = z.infer<typeof api.questions.ask.responses[201]>;
