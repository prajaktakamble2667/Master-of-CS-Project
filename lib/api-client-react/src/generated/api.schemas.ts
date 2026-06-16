// Types/schemas used by the frontend

export interface PhqGadAnswers {
  phq9_q1: number;
  phq9_q2: number;
  phq9_q3: number;
  phq9_q4: number;
  phq9_q5: number;
  phq9_q6: number;
  phq9_q7: number;
  phq9_q8: number;
  phq9_q9: number;
  gad7_q1: number;
  gad7_q2: number;
  gad7_q3: number;
  gad7_q4: number;
  gad7_q5: number;
  gad7_q6: number;
  gad7_q7: number;
  age: number;
  sleep_issues: number;
  social_withdrawal: number;
  prior_history: number;
}

export interface HealthAssessmentRequestFreeTextResponses {
  symptoms: string;
  medications?: string;
  additionalNotes?: string;
}

export interface AuthUser {
  id: number;
  username: string;
  fullName: string;
  role: "patient" | "admin";
}

export interface Session {
  id: number;
  userId: number | null;
  patientName: string | null;
  createdAt: string;
  result: Record<string, unknown> | null;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  qualification: string;
  hospital: string;
  phone: string;
  email: string;
  availableDays: string;
  forSeverity: string[];
}

export interface AdminStats {
  totalPatients: number;
  totalAssessments: number;
  severeCount: number;
  moderateCount: number;
  mildCount: number;
  noneCount: number;
  needsAttentionCount: number;
}

export interface AdminReport {
  id: number;
  userId: number | null;
  patientName: string;
  patientUsername?: string;
  createdAt: string;
  result: Record<string, unknown> | null;
  needsAttention: boolean;
}
