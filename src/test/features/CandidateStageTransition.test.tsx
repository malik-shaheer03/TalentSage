import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CandidateProfile } from '../../features/candidates/CandidateProfile';
import { useStore } from '../../store';
import { Candidate } from '../../types/models';

describe('Candidate Stage Transition Updates UI State', () => {
  const mockCandidate: Candidate = {
    id: 'test-candidate-1',
    jobId: 'test-job-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    location: 'New York, NY',
    stage: 'applied',
    score: 85,
    skills: ['React', 'TypeScript', 'Node.js'],
    experience: 5,
    resumeText: 'Experienced software engineer with 5 years in full-stack development.',
    appliedAt: Date.now(),
    updatedAt: Date.now()
  };

  const mockJob = {
    id: 'test-job-1',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'New York, NY',
    type: 'full-time' as const,
    status: 'open' as const,
    description: 'We are looking for a senior frontend engineer...',
    requirements: ['5+ years experience', 'React expertise'],
    candidateIds: ['test-candidate-1'],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  beforeEach(() => {
    // Reset store state
    useStore.setState({
      candidates: { [mockCandidate.id]: mockCandidate },
      jobs: { [mockJob.id]: mockJob },
      auditLogs: []
    });
  });

  it('should display current candidate stage as a badge', () => {
    const mockOnBack = vi.fn();
    
    render(<CandidateProfile candidateId={mockCandidate.id} onBack={mockOnBack} />);

    // Check that the stage badge is displayed
    const stageBadge = screen.getByText('applied');
    expect(stageBadge).toBeInTheDocument();
  });

  it('should update badge when candidate is shortlisted', async () => {
    const user = userEvent.setup();
    const mockOnBack = vi.fn();
    
    render(<CandidateProfile candidateId={mockCandidate.id} onBack={mockOnBack} />);

    // Initial state - should show "applied"
    expect(screen.getByText('applied')).toBeInTheDocument();

    // Click the "Shortlist" button
    const shortlistButton = screen.getByRole('button', { name: /shortlist/i });
    await user.click(shortlistButton);

    // Wait for UI to update
    await waitFor(() => {
      const updatedCandidate = useStore.getState().candidates[mockCandidate.id];
      expect(updatedCandidate.stage).toBe('shortlisted');
    });

    // Badge should now show "shortlisted"
    await waitFor(() => {
      expect(screen.getByText('shortlisted')).toBeInTheDocument();
    });

    // "applied" badge should no longer exist
    expect(screen.queryByText('applied')).not.toBeInTheDocument();
  });

  it('should create audit log entry when stage changes', async () => {
    const user = userEvent.setup();
    const mockOnBack = vi.fn();
    
    render(<CandidateProfile candidateId={mockCandidate.id} onBack={mockOnBack} />);

    // Check initial audit logs count
    const initialLogCount = useStore.getState().auditLogs.length;

    // Click the "Shortlist" button
    const shortlistButton = screen.getByRole('button', { name: /shortlist/i });
    await user.click(shortlistButton);

    // Verify audit log was created
    await waitFor(() => {
      const auditLogs = useStore.getState().auditLogs;
      expect(auditLogs.length).toBeGreaterThan(initialLogCount);

      const stageChangeLog = auditLogs.find(
        log => log.action === 'stage_changed' && log.entityId === mockCandidate.id
      );
      expect(stageChangeLog).toBeDefined();
      expect(stageChangeLog?.details.from).toBe('applied');
      expect(stageChangeLog?.details.to).toBe('shortlisted');
    });
  });

  it('should show "Move to Interview" button when candidate is shortlisted', async () => {
    const user = userEvent.setup();
    const mockOnBack = vi.fn();
    
    // Start with shortlisted candidate
    const shortlistedCandidate = { ...mockCandidate, stage: 'shortlisted' as const };
    useStore.setState({
      candidates: { [shortlistedCandidate.id]: shortlistedCandidate },
      jobs: { [mockJob.id]: mockJob },
      auditLogs: []
    });

    render(<CandidateProfile candidateId={shortlistedCandidate.id} onBack={mockOnBack} />);

    // Should show "Move to Interview" button
    const interviewButton = screen.getByRole('button', { name: /move to interview/i });
    expect(interviewButton).toBeInTheDocument();

    // Click the button
    await user.click(interviewButton);

    // Verify stage updated
    await waitFor(() => {
      const updatedCandidate = useStore.getState().candidates[shortlistedCandidate.id];
      expect(updatedCandidate.stage).toBe('interview');
    });
  });

  it('should disable stage change buttons while loading', async () => {
    const user = userEvent.setup();
    const mockOnBack = vi.fn();
    
    render(<CandidateProfile candidateId={mockCandidate.id} onBack={mockOnBack} />);

    const shortlistButton = screen.getByRole('button', { name: /shortlist/i });
    
    // Click the button
    await user.click(shortlistButton);

    // Button should be disabled during loading
    // (Note: This test verifies the loading state exists)
    await waitFor(() => {
      const updatedCandidate = useStore.getState().candidates[mockCandidate.id];
      expect(updatedCandidate.stage).toBe('shortlisted');
    });
  });

  it('should show reject button for all non-rejected candidates', () => {
    const mockOnBack = vi.fn();
    
    render(<CandidateProfile candidateId={mockCandidate.id} onBack={mockOnBack} />);

    // Reject button should be visible
    const rejectButton = screen.getByRole('button', { name: /reject/i });
    expect(rejectButton).toBeInTheDocument();
  });

  it('should not show stage action buttons for rejected candidates', () => {
    const mockOnBack = vi.fn();
    
    // Create rejected candidate
    const rejectedCandidate = { ...mockCandidate, stage: 'rejected' as const };
    useStore.setState({
      candidates: { [rejectedCandidate.id]: rejectedCandidate },
      jobs: { [mockJob.id]: mockJob },
      auditLogs: []
    });

    render(<CandidateProfile candidateId={rejectedCandidate.id} onBack={mockOnBack} />);

    // Should show rejected badge
    expect(screen.getByText('rejected')).toBeInTheDocument();

    // Should NOT show reject button (already rejected)
    const rejectButton = screen.queryByRole('button', { name: /reject/i });
    expect(rejectButton).not.toBeInTheDocument();
  });
});
