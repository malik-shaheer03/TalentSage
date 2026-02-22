import React, { useState, useEffect } from 'react';
import { initializeStore, useStore } from '../store';
import { MarketingPage } from '../features/marketing/MarketingPage';
import { JobsPage } from '../features/jobs/JobsPage';
import { JobDetailPage } from '../features/jobs/JobDetailPage';
import { CandidateProfile } from '../features/candidates/CandidateProfile';
import { ScreeningPage } from '../features/screening';
import { AssistantWidget } from '../features/assistant/AssistantWidget';
import { Header } from './Header';
import { ToastContainer, useToast } from '../shared/components/Toast';
import '../styles/tokens.css';
import '../styles/animations.css';
import '../styles/global.css';

type View = 'marketing' | 'jobs' | 'jobDetail' | 'candidateProfile' | 'screening';

export const App: React.FC = () => {
  const [view, setView] = useState<View>('marketing');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [screeningMode, setScreeningMode] = useState<'candidate' | 'recruiter'>('recruiter');
  const [initialized, setInitialized] = useState(false);
  
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    // Initialize store on mount
    initializeStore();
    setInitialized(true);
  }, []);

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
    setView('jobDetail');
  };

  const handleCandidateSelect = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setView('candidateProfile');
  };

  const handleBackToJobDetail = () => {
    setView('jobDetail');
    setSelectedCandidateId(null);
  };

  const handleOpenScreening = (candidateId: string, mode: 'candidate' | 'recruiter' = 'recruiter') => {
    setSelectedCandidateId(candidateId);
    setScreeningMode(mode);
    setView('screening');
  };

  const handleBackFromScreening = () => {
    setView('candidateProfile');
  };

  // Get candidate's job ID for screening
  const getCandidateJobId = (candidateId: string): string | null => {
    const { candidates } = useStore.getState();
    return candidates[candidateId]?.jobId || null;
  };

  if (!initialized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'var(--font-sans)',
        color: 'var(--color-text-secondary)'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Header 
        currentView={view}
        onNavigate={(newView: View) => {
          setView(newView);
          if (newView === 'marketing' || newView === 'jobs') {
            setSelectedJobId(null);
            setSelectedCandidateId(null);
          }
        }}
      />
      
      {view === 'marketing' && <MarketingPage />}
      
      {view === 'jobs' && <JobsPage onJobSelect={handleJobSelect} />}
      
      {view === 'jobDetail' && selectedJobId && (
        <JobDetailPage
          jobId={selectedJobId}
          onCandidateClick={handleCandidateSelect}
        />
      )}
      
      {view === 'candidateProfile' && selectedCandidateId && (
        <CandidateProfile
          candidateId={selectedCandidateId}
          onBack={handleBackToJobDetail}
          onOpenScreening={(mode) => handleOpenScreening(selectedCandidateId, mode)}
        />
      )}
      
      {view === 'screening' && selectedCandidateId && (
        <ScreeningPage
          candidateId={selectedCandidateId}
          jobId={getCandidateJobId(selectedCandidateId) || ''}
          mode={screeningMode}
          onBack={handleBackFromScreening}
        />
      )}
      
      {/* AI Assistant - available across all views */}
      <AssistantWidget />
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};
