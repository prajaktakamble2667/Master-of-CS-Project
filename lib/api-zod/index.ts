import { z } from "zod";

// Health check
export const HealthCheckResponse = z.object({
  status: z.string(),
});

// Auth
export const RegisterBody = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  fullName: z.string().min(2),
  role: z.enum(["patient", "admin"]).optional().default("patient"),
});

export const LoginBody = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

// Chatbot
export const AnalyzeHealthDataBody = z.object({
  answers: z.record(z.number()),
  freeTextResponses: z.record(z.string()).optional(),
  sessionId: z.number().optional(),
});

export const CreateSessionBody = z.object({
  userName: z.string().optional(),
});

export const GetSessionParams = z.object({
  sessionId: z.coerce.number(),
});
