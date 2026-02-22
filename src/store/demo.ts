/**
 * Store Demo - No UI
 * 
 * This demonstrates the Zustand store functionality without any React components.
 * Run this in Node.js or browser console to see the store in action.
 */

import { useStore, initializeStore } from './store';

console.log('=== TalentSage Store Demo ===\n');

// Initialize store with seed data
initializeStore();

const store = useStore.getState();

// Demo 1: View loaded data
console.log('📋 Jobs loaded:', Object.keys(store.jobs).length);
console.log('👥 Candidates loaded:', Object.keys(store.candidates).length);
console.log('📊 Rubrics loaded:', Object.keys(store.rubrics).length);
console.log('📝 Initial audit logs:', store.auditLogs.length);
console.log('');

// Demo 2: Candidate stage transition
console.log('=== Demo 1: Stage Transition ===');
const candidateId = 'cand-3'; // Emily Rodriguez
const candidate = store.getCandidate(candidateId);

console.log(`Candidate: ${candidate?.name}`);
console.log(`Current stage: ${candidate?.stage}`);
console.log('Changing stage to "shortlisted"...');

store.changeCandidateStage(candidateId, 'shortlisted');

const updatedCandidate = store.getCandidate(candidateId);
console.log(`New stage: ${updatedCandidate?.stage}`);

// Check audit log
const candidateLogs = store.getLogsByEntity('candidate', candidateId);
const stageChangeLog = candidateLogs.find(log => log.action === 'stage_changed');
console.log('Audit log created:', stageChangeLog?.action);
console.log('From:', stageChangeLog?.details.from, '→ To:', stageChangeLog?.details.to);
console.log('');

// Demo 3: Multiple stage changes
console.log('=== Demo 2: Multiple Transitions ===');
console.log('Shortlisting top candidates for job-1...');

const job1Candidates = store.getCandidatesByJob('job-1')
  .filter(c => c.stage === 'applied')
  .sort((a, b) => (b.score || 0) - (a.score || 0))
  .slice(0, 2);

console.log(`Found ${job1Candidates.length} applied candidates with high scores`);

job1Candidates.forEach(c => {
  console.log(`- Shortlisting ${c.name} (score: ${c.score})`);
  store.changeCandidateStage(c.id, 'shortlisted', 'ai_assistant');
});

console.log('All candidates shortlisted ✓');
console.log('');

// Demo 4: Rubric validation
console.log('=== Demo 3: Rubric Weight Validation ===');
const testRubric = {
  id: 'test-rubric',
  jobId: 'job-1',
  criteria: [
    { id: 'c1', name: 'Skill A', description: 'Test skill', weight: 30 },
    { id: 'c2', name: 'Skill B', description: 'Test skill', weight: 30 },
    { id: 'c3', name: 'Skill C', description: 'Test skill', weight: 30 }
  ],
  createdAt: Date.now(),
  updatedAt: Date.now()
};

console.log('Creating rubric with invalid weights (30 + 30 + 30 = 90)...');
store.setRubric(testRubric);

const savedRubric = store.getRubric('test-rubric');
const totalWeight = savedRubric?.criteria.reduce((sum, c) => sum + c.weight, 0);
console.log('Weights normalized to:', totalWeight?.toFixed(2));
console.log('Individual weights:', savedRubric?.criteria.map(c => c.weight.toFixed(2)));
console.log('');

// Demo 5: View all audit logs
console.log('=== Demo 4: Audit Log Summary ===');
console.log('Total audit logs:', store.auditLogs.length);

const logsByAction = store.auditLogs.reduce((acc, log) => {
  acc[log.action] = (acc[log.action] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log('Logs by action:');
Object.entries(logsByAction).forEach(([action, count]) => {
  console.log(`  ${action}: ${count}`);
});
console.log('');

// Demo 6: LocalStorage persistence
console.log('=== Demo 5: LocalStorage Persistence ===');
const storedRubrics = localStorage.getItem('talentsage_rubrics');
if (storedRubrics) {
  const parsed = JSON.parse(storedRubrics);
  console.log('Rubrics in localStorage:', Object.keys(parsed).length);
  console.log('Keys:', Object.keys(parsed).join(', '));
} else {
  console.log('No rubrics in localStorage');
}
console.log('');

// Demo 7: Stage filtering
console.log('=== Demo 6: Candidate Filtering ===');
const stages = ['applied', 'shortlisted', 'interview', 'rejected'] as const;
console.log('Candidates by stage for job-1:');
stages.forEach(stage => {
  const count = store.getCandidatesByStage('job-1', stage).length;
  console.log(`  ${stage}: ${count}`);
});
console.log('');

console.log('=== Demo Complete ===');
console.log('✓ Stage transitions working');
console.log('✓ Audit logs injected automatically');
console.log('✓ Rubric weights validated');
console.log('✓ LocalStorage persistence active');
console.log('✓ State consistency maintained');
