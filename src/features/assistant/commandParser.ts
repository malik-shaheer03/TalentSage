import { StoreState } from '../../store';
import { Candidate } from '../../types';

export type CommandType = 'shortlist' | 'generate_rubric' | 'schedule_interview' | 'unknown';

export interface ParsedCommand {
  type: CommandType;
  confidence: number;
  params?: {
    jobId?: string;
    candidateId?: string;
  };
}

export interface CommandResult {
  success: boolean;
  message: string;
  speechMessage?: string;
}

interface CommandExecutionContext {
  onScheduleInterview?: (candidateId: string, jobId: string) => void;
}

/**
 * Deterministic command parser - no LLM, just pattern matching
 */
export function parseCommand(input: string): ParsedCommand | null {
  const normalized = input.toLowerCase().trim();

  // Shortlist candidates
  if (
    normalized.includes('shortlist') ||
    normalized.includes('short list') ||
    (normalized.includes('top') && normalized.includes('candidate'))
  ) {
    return {
      type: 'shortlist',
      confidence: 1.0
    };
  }

  // Generate rubric
  if (
    normalized.includes('generate') && normalized.includes('rubric') ||
    normalized.includes('create') && normalized.includes('rubric') ||
    normalized.includes('evaluation criteria') ||
    normalized.includes('scoring criteria')
  ) {
    return {
      type: 'generate_rubric',
      confidence: 1.0
    };
  }

  // Schedule interview
  if (
    normalized.includes('schedule') && normalized.includes('interview') ||
    normalized.includes('book') && normalized.includes('interview') ||
    normalized.includes('arrange') && normalized.includes('interview')
  ) {
    return {
      type: 'schedule_interview',
      confidence: 1.0
    };
  }

  return null;
}

/**
 * Execute command with real state changes
 */
export function executeCommand(
  command: ParsedCommand,
  store: StoreState,
  context: CommandExecutionContext = {}
): CommandResult {
  switch (command.type) {
    case 'shortlist':
      return executeShortlistCommand(store);
    
    case 'generate_rubric':
      return executeGenerateRubricCommand(store);
    
    case 'schedule_interview':
      return executeScheduleInterviewCommand(store, context);
    
    default:
      return {
        success: false,
        message: 'I don\'t understand that command.'
      };
  }
}

/**
 * Shortlist top 3 candidates by aiScore
 */
function executeShortlistCommand(store: StoreState): CommandResult {
  // Get all candidates with "applied" stage
  const appliedCandidates = Object.values(store.candidates)
    .filter((c: Candidate) => c.stage === 'applied')
    .sort((a: Candidate, b: Candidate) => (b.score || 0) - (a.score || 0))
    .slice(0, 3);

  if (appliedCandidates.length === 0) {
    return {
      success: false,
      message: 'No candidates found in the "Applied" stage to shortlist.',
      speechMessage: 'No candidates available to shortlist.'
    };
  }

  // Move candidates to shortlisted stage
  appliedCandidates.forEach((candidate: Candidate) => {
    store.changeCandidateStage(candidate.id, 'shortlisted', 'ai_assistant');
  });

  const candidateNames = appliedCandidates.map((c: Candidate) => c.name).join(', ');
  const count = appliedCandidates.length;

  return {
    success: true,
    message: `✓ Successfully shortlisted ${count} top candidate${count > 1 ? 's' : ''}:\n\n${candidateNames}\n\nThey've been moved to the Shortlisted stage and audit logs have been created.`,
    speechMessage: `I've shortlisted ${count} top candidate${count > 1 ? 's' : ''} based on their AI scores.`
  };
}

/**
 * Generate evaluation rubric with predefined criteria
 */
function executeGenerateRubricCommand(store: StoreState): CommandResult {
  // Get first job for demo purposes
  const jobs = Object.values(store.jobs);
  if (jobs.length === 0) {
    return {
      success: false,
      message: 'No jobs found. Please create a job first.',
      speechMessage: 'No jobs found to generate a rubric for.'
    };
  }

  const job = jobs[0];

  // Predefined weighted criteria (must sum to 100%)
  const predefinedRubric = {
    id: `rubric-ai-${Date.now()}`,
    jobId: job.id,
    criteria: [
      {
        id: 'technical-skills',
        name: 'Technical Skills',
        description: 'Proficiency in required technologies and tools',
        weight: 35
      },
      {
        id: 'experience',
        name: 'Relevant Experience',
        description: 'Years of experience in similar roles',
        weight: 25
      },
      {
        id: 'communication',
        name: 'Communication Skills',
        description: 'Written and verbal communication abilities',
        weight: 20
      },
      {
        id: 'problem-solving',
        name: 'Problem Solving',
        description: 'Analytical thinking and solution design',
        weight: 15
      },
      {
        id: 'cultural-fit',
        name: 'Cultural Fit',
        description: 'Alignment with company values and team dynamics',
        weight: 5
      }
    ],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  // Replace existing rubric
  store.setRubric(predefinedRubric);

  const criteriaList = predefinedRubric.criteria
    .map((c) => `• ${c.name} (${c.weight}%)`)
    .join('\n');

  return {
    success: true,
    message: `✓ Generated evaluation rubric for "${job.title}":\n\n${criteriaList}\n\nTotal: 100% weight. The rubric has been saved and an audit log created.`,
    speechMessage: `I've generated a 5-criteria evaluation rubric for ${job.title}.`
  };
}

/**
 * Schedule interview - opens modal
 */
function executeScheduleInterviewCommand(
  store: StoreState,
  context: CommandExecutionContext
): CommandResult {
  // Get first shortlisted or interview-stage candidate
  const candidates = Object.values(store.candidates);
  const eligibleCandidate = candidates.find(
    (c: Candidate) => c.stage === 'shortlisted' || c.stage === 'interview'
  );

  if (!eligibleCandidate) {
    return {
      success: false,
      message: 'No eligible candidates found. Please shortlist candidates first.',
      speechMessage: 'No candidates available to schedule interviews for.'
    };
  }

  // Trigger modal
  if (context.onScheduleInterview) {
    context.onScheduleInterview(eligibleCandidate.id, eligibleCandidate.jobId);
  }

  return {
    success: true,
    message: `Opening interview scheduler for ${eligibleCandidate.name}...`,
    speechMessage: `Opening interview scheduler for ${eligibleCandidate.name}.`
  };
}
