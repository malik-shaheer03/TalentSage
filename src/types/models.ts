export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  status: 'open' | 'closed' | 'draft';
  description: string;
  requirements: string[];
  rubricId?: string;
  candidateIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Candidate {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  stage: 'applied' | 'shortlisted' | 'interview' | 'rejected';
  score?: number;
  skills: string[];
  experience: number;
  resumeUrl?: string;
  resumeText?: string;
  screeningId?: string;
  evaluationSummary?: {
    strengths: string[];
    concerns: string[];
    recommendation: string;
  };
  appliedAt: number;
  updatedAt: number;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
}

export interface Rubric {
  id: string;
  jobId: string;
  criteria: RubricCriterion[];
  createdAt: number;
  updatedAt: number;
}

export interface AuditLog {
  id: string;
  entityType: 'job' | 'candidate' | 'rubric' | 'screening';
  entityId: string;
  action: string;
  actor: 'recruiter' | 'ai_assistant' | 'system';
  actorName?: string;
  details: Record<string, any>;
  timestamp: number;
}

export interface Screening {
  id: string;
  candidateId: string;
  jobId: string;
  type: 'video_upload' | 'video_record';
  videoUrl?: string;
  duration?: number;
  transcript?: string;
  evaluation?: {
    communication: number;
    clarity: number;
    confidence: number;
    overall: number;
    summary: string;
  };
  reviewStatus?: 'pending' | 'pass' | 'hold' | 'reject';
  reviewNotes?: string;
  submittedAt: number;
  reviewedAt?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  actions?: string[];
}
