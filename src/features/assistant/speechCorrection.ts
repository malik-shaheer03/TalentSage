// Smart correction for common misheard words in recruiting context
export function correctTranscript(transcript: string): string {
  // Convert to lowercase for matching
  let corrected = transcript.toLowerCase().trim();
  
  // Common misheard recruiting terms
  const corrections: Record<string, string> = {
    // Shortlist variations
    'short list': 'shortlist',
    'short listed': 'shortlist',
    'short listing': 'shortlist',
    'court list': 'shortlist',
    'sort list': 'shortlist',
    'shot list': 'shortlist',
    'shorten list': 'shortlist',
    
    // Candidate variations
    'can do date': 'candidate',
    'can did it': 'candidate',
    'can dedate': 'candidate',
    'candid ate': 'candidate',
    'can di date': 'candidate',
    'candidates': 'candidates',
    'canned dates': 'candidates',
    
    // Interview variations
    'inter view': 'interview',
    'inner view': 'interview',
    'inerview': 'interview',
    'enter view': 'interview',
    'interview': 'interview',
    
    // Schedule variations
    'shed you all': 'schedule',
    'shedule': 'schedule',
    'shed dual': 'schedule',
    'shed you will': 'schedule',
    'schedule': 'schedule',
    
    // Evaluation variations
    'a valuation': 'evaluation',
    'eval you asian': 'evaluation',
    'eval you ation': 'evaluation',
    'e value asian': 'evaluation',
    'evaluation': 'evaluation',
    
    // Rubric variations
    'roo brick': 'rubric',
    'rue brick': 'rubric',
    'root brick': 'rubric',
    'room brick': 'rubric',
    'rubric': 'rubric',
    
    // Generate variations
    'jen rate': 'generate',
    'general rate': 'generate',
    'gen rate': 'generate',
    'generator': 'generate',
    'generate': 'generate',
    
    // Top variations
    'tap': 'top',
    'talk': 'top',
    'tab': 'top',
    'tot': 'top',
    'top': 'top',
    
    // Numbers
    'three': '3',
    'for': '4',
    'four': '4',
    'five': '5',
    'to': '2',
    'too': '2',
    'two': '2',
  };
  
  // Apply corrections
  for (const [wrong, right] of Object.entries(corrections)) {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    corrected = corrected.replace(regex, right);
  }
  
  // Common phrase corrections
  const phraseCorrections: [RegExp, string][] = [
    // Shortlist command
    [/short\s*list\s*top/gi, 'shortlist top'],
    [/short\s*list.*candidate/gi, 'shortlist top candidates'],
    [/list\s*top\s*candidate/gi, 'shortlist top candidates'],
    
    // Generate evaluation rubric command
    [/generate\s*eval/gi, 'generate evaluation'],
    [/gen.*eval.*rubric/gi, 'generate evaluation rubric'],
    [/create.*rubric/gi, 'generate evaluation rubric'],
    [/make.*rubric/gi, 'generate evaluation rubric'],
    [/generate.*rubric/gi, 'generate evaluation rubric'],
    
    // Schedule interview command
    [/schedule\s*an?\s*inter/gi, 'schedule interview'],
    [/shed.*inter/gi, 'schedule interview'],
    [/set.*interview/gi, 'schedule interview'],
    [/book.*interview/gi, 'schedule interview'],
    [/plan.*interview/gi, 'schedule interview'],
    
    // Number corrections
    [/top\s*three/gi, 'top 3'],
    [/top\s*for/gi, 'top 4'],
    [/top\s*four/gi, 'top 4'],
    [/top\s*five/gi, 'top 5'],
  ];
  
  phraseCorrections.forEach(([pattern, replacement]) => {
    corrected = corrected.replace(pattern, replacement);
  });
  
  // Clean up extra spaces
  corrected = corrected.replace(/\s+/g, ' ').trim();
  
  return corrected;
}

// Fuzzy matching for commands - helps when speech is unclear
export function findBestCommand(transcript: string): string | null {
  const corrected = correctTranscript(transcript);
  
  // Define valid commands with keywords
  const commands = [
    {
      keywords: ['shortlist', 'short', 'list', 'top', 'candidate'],
      command: 'shortlist top candidates',
      priority: 2 // Higher priority for common commands
    },
    {
      keywords: ['generate', 'evaluation', 'rubric', 'create', 'make'],
      command: 'generate evaluation rubric',
      priority: 2
    },
    {
      keywords: ['schedule', 'interview', 'meeting', 'call', 'book', 'set', 'plan'],
      command: 'schedule interview',
      priority: 2
    }
  ];
  
  // Count keyword matches
  let bestMatch = { command: null as string | null, score: 0, priority: 0 };
  
  for (const cmd of commands) {
    let score = 0;
    for (const keyword of cmd.keywords) {
      if (corrected.includes(keyword)) {
        score++;
      }
    }
    
    // Give bonus for priority commands
    score += cmd.priority;
    
    if (score > bestMatch.score) {
      bestMatch = { command: cmd.command, score, priority: cmd.priority };
    }
  }
  
  // Return best match if confidence is high enough (at least 2 keywords)
  return bestMatch.score >= 2 ? bestMatch.command : corrected;
}
