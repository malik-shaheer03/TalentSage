import { Job, Candidate, Rubric } from '../types';

const now = Date.now();
const oneDay = 24 * 60 * 60 * 1000;

export const seedJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Houston, TX',
    type: 'full-time',
    status: 'open',
    description: 'We are looking for a senior frontend engineer to build and scale our AI-native recruitment platform.',
    requirements: [
      '5+ years of React experience',
      'Strong TypeScript skills',
      'Experience with state management (Redux, Zustand)',
      'UI/UX design sensibility',
      'Experience with animation libraries'
    ],
    rubricId: 'rubric-1',
    candidateIds: ['cand-1', 'cand-2', 'cand-3', 'cand-4'],
    createdAt: now - 14 * oneDay,
    updatedAt: now - 14 * oneDay
  },
  {
    id: 'job-2',
    title: 'Product Designer',
    department: 'Design',
    location: 'Dubai, UAE',
    type: 'full-time',
    status: 'open',
    description: 'Join our design team to craft beautiful and intuitive experiences for recruiters and candidates.',
    requirements: [
      '3+ years of product design experience',
      'Proficiency in Figma',
      'Strong portfolio demonstrating UX thinking',
      'Experience with design systems',
      'Understanding of accessibility standards'
    ],
    rubricId: 'rubric-2',
    candidateIds: ['cand-5', 'cand-6'],
    createdAt: now - 7 * oneDay,
    updatedAt: now - 7 * oneDay
  },
  {
    id: 'job-3',
    title: 'Backend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'full-time',
    status: 'open',
    description: 'Build scalable APIs and infrastructure for our AI-powered recruitment system.',
    requirements: [
      '4+ years of backend development',
      'Experience with Node.js or Python',
      'Database design expertise (PostgreSQL, MongoDB)',
      'RESTful API design',
      'Cloud infrastructure (AWS, GCP, or Azure)'
    ],
    candidateIds: ['cand-7'],
    createdAt: now - 3 * oneDay,
    updatedAt: now - 3 * oneDay
  }
];

export const seedCandidates: Candidate[] = [
  {
    id: 'cand-1',
    jobId: 'job-1',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@email.com',
    phone: '+1-555-0101',
    location: 'Austin, TX',
    stage: 'shortlisted',
    score: 92,
    skills: ['React', 'TypeScript', 'Framer Motion', 'Zustand', 'Tailwind CSS'],
    experience: 6,
    resumeText: 'Senior Frontend Engineer with 6 years of experience building scalable web applications...',
    evaluationSummary: {
      strengths: ['Strong React architecture skills', 'Excellent portfolio', 'Great communication'],
      concerns: ['Limited backend experience'],
      recommendation: 'Strong hire - proceed to technical interview'
    },
    appliedAt: now - 12 * oneDay,
    updatedAt: now - 5 * oneDay
  },
  {
    id: 'cand-2',
    jobId: 'job-1',
    name: 'Marcus Chen',
    email: 'marcus.chen@email.com',
    phone: '+1-555-0102',
    location: 'San Francisco, CA',
    stage: 'interview',
    score: 88,
    skills: ['React', 'Vue.js', 'JavaScript', 'CSS', 'Redux'],
    experience: 7,
    resumeText: 'Full-stack engineer with frontend specialization. Built products used by millions...',
    evaluationSummary: {
      strengths: ['Diverse tech stack', 'Strong problem solver', 'Team leadership experience'],
      concerns: ['TypeScript experience seems limited'],
      recommendation: 'Solid candidate - assess TypeScript proficiency in interview'
    },
    appliedAt: now - 11 * oneDay,
    updatedAt: now - 2 * oneDay
  },
  {
    id: 'cand-3',
    jobId: 'job-1',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+1-555-0103',
    location: 'New York, NY',
    stage: 'applied',
    score: 85,
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'Jest'],
    experience: 5,
    resumeText: 'Frontend engineer passionate about user experience and performance optimization...',
    evaluationSummary: {
      strengths: ['Modern tech stack', 'Performance-focused', 'Good testing practices'],
      concerns: ['Needs more senior-level project examples'],
      recommendation: 'Worth interviewing - borderline for senior role'
    },
    appliedAt: now - 9 * oneDay,
    updatedAt: now - 9 * oneDay
  },
  {
    id: 'cand-4',
    jobId: 'job-1',
    name: 'David Park',
    email: 'david.park@email.com',
    phone: '+1-555-0104',
    location: 'Seattle, WA',
    stage: 'applied',
    score: 78,
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Bootstrap'],
    experience: 4,
    resumeText: 'Frontend developer with e-commerce and fintech experience...',
    evaluationSummary: {
      strengths: ['Reliable execution', 'Good CSS skills'],
      concerns: ['Below experience threshold', 'Tech stack seems dated'],
      recommendation: 'Not a strong fit for senior role'
    },
    appliedAt: now - 8 * oneDay,
    updatedAt: now - 8 * oneDay
  },
  {
    id: 'cand-5',
    jobId: 'job-2',
    name: 'Aisha Rahman',
    email: 'aisha.rahman@email.com',
    phone: '+971-555-0105',
    location: 'Dubai, UAE',
    stage: 'shortlisted',
    score: 90,
    skills: ['Figma', 'Product Design', 'User Research', 'Prototyping', 'Design Systems'],
    experience: 5,
    resumeText: 'Product designer specializing in B2B SaaS applications...',
    evaluationSummary: {
      strengths: ['Exceptional portfolio', 'Strong UX methodology', 'Local candidate'],
      concerns: [],
      recommendation: 'Excellent fit - fast-track to interview'
    },
    appliedAt: now - 6 * oneDay,
    updatedAt: now - 4 * oneDay
  },
  {
    id: 'cand-6',
    jobId: 'job-2',
    name: 'Oliver Thompson',
    email: 'oliver.thompson@email.com',
    phone: '+44-555-0106',
    location: 'London, UK',
    stage: 'applied',
    score: 82,
    skills: ['Sketch', 'Figma', 'Adobe XD', 'User Research', 'Wireframing'],
    experience: 3,
    resumeText: 'Product designer with agency and startup experience...',
    evaluationSummary: {
      strengths: ['Diverse project portfolio', 'Strong visual design'],
      concerns: ['May need sponsorship', 'Less enterprise experience'],
      recommendation: 'Promising - discuss relocation logistics'
    },
    appliedAt: now - 5 * oneDay,
    updatedAt: now - 5 * oneDay
  },
  {
    id: 'cand-7',
    jobId: 'job-3',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91-555-0107',
    location: 'Bangalore, India',
    stage: 'applied',
    score: 86,
    skills: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker'],
    experience: 5,
    resumeText: 'Backend engineer with expertise in scalable microservices architecture...',
    evaluationSummary: {
      strengths: ['Strong technical depth', 'Cloud infrastructure experience', 'Good communication'],
      concerns: ['Timezone differences for remote work'],
      recommendation: 'Strong technical fit - assess remote work setup'
    },
    appliedAt: now - 2 * oneDay,
    updatedAt: now - 2 * oneDay
  }
];

export const seedRubrics: Rubric[] = [
  {
    id: 'rubric-1',
    jobId: 'job-1',
    criteria: [
      {
        id: 'crit-1',
        name: 'Technical Skills',
        description: 'React, TypeScript, state management, modern tooling',
        weight: 35
      },
      {
        id: 'crit-2',
        name: 'Architecture & Design',
        description: 'Component design, code organization, scalability thinking',
        weight: 25
      },
      {
        id: 'crit-3',
        name: 'UI/UX Sensibility',
        description: 'Design taste, attention to detail, user-centric thinking',
        weight: 20
      },
      {
        id: 'crit-4',
        name: 'Communication',
        description: 'Clear communication, collaboration, documentation',
        weight: 10
      },
      {
        id: 'crit-5',
        name: 'Problem Solving',
        description: 'Analytical thinking, debugging ability, creativity',
        weight: 10
      }
    ],
    createdAt: now - 14 * oneDay,
    updatedAt: now - 14 * oneDay
  },
  {
    id: 'rubric-2',
    jobId: 'job-2',
    criteria: [
      {
        id: 'crit-6',
        name: 'Portfolio Quality',
        description: 'Depth of case studies, problem-solving approach, visual craft',
        weight: 40
      },
      {
        id: 'crit-7',
        name: 'UX Methodology',
        description: 'User research, design thinking, iteration process',
        weight: 30
      },
      {
        id: 'crit-8',
        name: 'Visual Design',
        description: 'Typography, color, layout, consistency',
        weight: 20
      },
      {
        id: 'crit-9',
        name: 'Communication',
        description: 'Presentation skills, articulation of design decisions',
        weight: 10
      }
    ],
    createdAt: now - 7 * oneDay,
    updatedAt: now - 7 * oneDay
  }
];
