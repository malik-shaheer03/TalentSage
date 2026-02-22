import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { Avatar } from './Avatar';
import { ChatPanel } from './ChatPanel';
import { SchedulingModal } from './SchedulingModal';
import { parseCommand, executeCommand } from './commandParser';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import styles from './AssistantWidget.module.css';

export type AvatarState = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: number;
}

export const AssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: 'Hi! I\'m your AI assistant. I can help you shortlist candidates, generate rubrics, and schedule interviews. Try asking me something!',
      sender: 'assistant',
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [schedulingContext, setSchedulingContext] = useState<{
    candidateId?: string;
    jobId?: string;
  }>({});

  const store = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Speech recognition
  const {
    isListening,
    transcript,
    isSupported: isSpeechRecognitionSupported,
    startListening,
    stopListening,
    resetTranscript,
    error: speechError
  } = useSpeechRecognition();

  // Speech synthesis
  const {
    speak,
    isSpeaking,
    isSupported: isSpeechSynthesisSupported
  } = useSpeechSynthesis();

  // Update avatar state based on speech status
  useEffect(() => {
    if (isListening) {
      setAvatarState('listening');
    } else if (isSpeaking) {
      setAvatarState('speaking');
    } else {
      setAvatarState('idle');
    }
  }, [isListening, isSpeaking]);

  // Handle transcript
  useEffect(() => {
    if (transcript && !isListening) {
      setInputValue(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, resetTranscript]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'assistant') => {
    const message: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      text,
      sender,
      timestamp: Date.now()
    };
    setMessages((prev) => [...prev, message]);
    return message;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    addMessage(userMessage, 'user');

    // Set thinking state
    setAvatarState('thinking');

    // Simulate thinking delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Parse command
    const commandResult = parseCommand(userMessage);

    if (!commandResult) {
      const response = 'I didn\'t understand that. Try asking me to:\n• "Shortlist top candidates"\n• "Generate evaluation rubric"\n• "Schedule interview"';
      addMessage(response, 'assistant');
      
      if (isSpeechSynthesisSupported) {
        speak('I didn\'t understand that command.');
      }
      
      setAvatarState('idle');
      return;
    }

    // Execute command
    try {
      const result = executeCommand(commandResult, store, {
        onScheduleInterview: (candidateId, jobId) => {
          setSchedulingContext({ candidateId, jobId });
          setShowSchedulingModal(true);
        }
      });

      addMessage(result.message, 'assistant');

      if (isSpeechSynthesisSupported) {
        speak(result.speechMessage || result.message);
      }

      setAvatarState('idle');
    } catch (error) {
      const errorMessage = 'Sorry, I encountered an error executing that command.';
      addMessage(errorMessage, 'assistant');
      
      if (isSpeechSynthesisSupported) {
        speak(errorMessage);
      }
      
      setAvatarState('idle');
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSchedulingConfirm = (date: Date, time: string, notes: string) => {
    const { candidateId } = schedulingContext;
    
    if (candidateId) {
      // Add audit log for interview scheduled
      store.addAuditLog({
        entityType: 'candidate',
        entityId: candidateId,
        action: 'interview_scheduled',
        actor: 'ai_assistant',
        details: {
          date: date.toISOString(),
          time,
          notes
        },
        timestamp: Date.now()
      });

      const response = `Interview scheduled for ${date.toLocaleDateString()} at ${time}. I've added it to the timeline.`;
      addMessage(response, 'assistant');

      if (isSpeechSynthesisSupported) {
        speak('Interview scheduled successfully.');
      }
    }

    setShowSchedulingModal(false);
    setSchedulingContext({});
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className={styles.floatingButton}
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Avatar state={avatarState} size="small" />
            {avatarState === 'listening' && (
              <motion.div
                className={styles.listeningPulse}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`${styles.chatContainer} ${isMinimized ? styles.minimized : ''}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <Avatar state={avatarState} size="tiny" />
                <div className={styles.headerInfo}>
                  <div className={styles.headerTitle}>AI Assistant</div>
                  <div className={styles.headerStatus}>
                    {avatarState === 'idle' && 'Ready to help'}
                    {avatarState === 'listening' && 'Listening...'}
                    {avatarState === 'thinking' && 'Thinking...'}
                    {avatarState === 'speaking' && 'Speaking...'}
                  </div>
                </div>
              </div>
              <div className={styles.headerActions}>
                <button
                  className={styles.headerButton}
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? 'Maximize' : 'Minimize'}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    {isMinimized ? (
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    ) : (
                      <path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    )}
                  </svg>
                </button>
                <button
                  className={styles.headerButton}
                  onClick={() => setIsOpen(false)}
                  title="Close"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Chat panel */}
            {!isMinimized && (
              <>
                <ChatPanel messages={messages} messagesEndRef={messagesEndRef} />

                {/* Voice API warning */}
                {!isSpeechRecognitionSupported && (
                  <div className={styles.warning}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 1L1 14h14L8 1z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                      />
                      <path d="M8 6v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="8" cy="11" r="0.5" fill="currentColor" />
                    </svg>
                    Voice input not supported in this browser. Try Chrome, Edge, or Safari.
                  </div>
                )}

                {/* Speech recognition error */}
                {speechError && (
                  <div className={styles.warning}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 1L1 14h14L8 1z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                      />
                      <path d="M8 6v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="8" cy="11" r="0.5" fill="currentColor" />
                    </svg>
                    {speechError}
                  </div>
                )}

                {/* Input area */}
                <div className={styles.inputArea}>
                  <textarea
                    className={styles.input}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me to shortlist candidates, generate rubrics, or schedule interviews..."
                    rows={2}
                    disabled={isListening || avatarState === 'thinking'}
                  />
                  <div className={styles.inputActions}>
                    {isSpeechRecognitionSupported && (
                      <button
                        className={`${styles.voiceButton} ${isListening ? styles.listening : ''}`}
                        onClick={handleVoiceInput}
                        title={isListening ? 'Stop listening' : 'Voice input'}
                        disabled={avatarState === 'thinking'}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path
                            d="M10 1a3 3 0 00-3 3v6a3 3 0 006 0V4a3 3 0 00-3-3z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M4 9a6 6 0 0012 0M10 16v3M7 19h6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    )}
                    <button
                      className={styles.sendButton}
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || avatarState === 'thinking'}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M2 10l16-8-8 16-2-6-6-2z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scheduling modal */}
      {showSchedulingModal && (
        <SchedulingModal
          onClose={() => {
            setShowSchedulingModal(false);
            setSchedulingContext({});
          }}
          onConfirm={handleSchedulingConfirm}
          candidateId={schedulingContext.candidateId}
          jobId={schedulingContext.jobId}
        />
      )}
    </>
  );
};
