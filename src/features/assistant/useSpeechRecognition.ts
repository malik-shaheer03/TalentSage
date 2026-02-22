import { useState, useEffect, useCallback, useRef } from 'react';
import { correctTranscript } from './speechCorrection';

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Web Speech API is not supported in this browser');
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser. Try Chrome, Edge, or Safari.');
      return;
    }

    try {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      
      // Configuration - optimized for accuracy
      recognition.continuous = true; // Keep listening
      recognition.interimResults = true; // Show partial results as you speak
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 3; // Get multiple alternatives for better accuracy

      // Audio detection handlers
      recognition.onaudiostart = () => {
        console.log('🎤 Audio capture started - microphone is working!');
      };

      recognition.onaudioend = () => {
        console.log('🎤 Audio capture ended');
      };

      recognition.onsoundstart = () => {
        console.log('🔊 Sound detected!');
      };

      recognition.onsoundend = () => {
        console.log('🔊 Sound ended');
      };

      recognition.onspeechstart = () => {
        console.log('🗣️ Speech detected - processing...');
      };

      recognition.onspeechend = () => {
        console.log('🗣️ Speech ended - finalizing...');
      };

      // Success handler
      recognition.onresult = (event: any) => {
        console.log('✅ Speech recognition result:', event);
        if (event.results && event.results.length > 0) {
          // Combine ALL results to avoid skipping first word
          let fullTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            // Use the alternative with highest confidence
            const alternatives = event.results[i];
            let bestTranscript = alternatives[0].transcript;
            let bestConfidence = alternatives[0].confidence || 0;
            
            // Check other alternatives if available
            for (let j = 1; j < Math.min(alternatives.length, 3); j++) {
              if (alternatives[j].confidence > bestConfidence) {
                bestTranscript = alternatives[j].transcript;
                bestConfidence = alternatives[j].confidence;
              }
            }
            
            fullTranscript += bestTranscript + ' ';
          }
          
          fullTranscript = fullTranscript.trim();
          const lastResult = event.results[event.results.length - 1];
          const isFinal = lastResult.isFinal;
          
          // Apply smart corrections for common misheard words
          const correctedTranscript = correctTranscript(fullTranscript);
          
          console.log('Raw transcript:', fullTranscript);
          console.log('Corrected transcript:', correctedTranscript, isFinal ? '(final)' : '(interim)');
          
          // Update transcript with corrected results
          setTranscript(correctedTranscript);
          setError(null);
          
          // Stop listening after final result
          if (isFinal && recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }
      };

      // Error handler with specific error messages
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error, event);
        
        // Don't treat no-speech as an error if we already have interim results
        if (event.error === 'no-speech') {
          console.log('No speech timeout - this is normal if you haven\'t spoken yet');
          setIsListening(false);
          return; // Don't show error, just reset state
        }
        
        setIsListening(false);
        
        let errorMessage = 'Speech recognition error';
        switch (event.error) {
          case 'audio-capture':
            errorMessage = 'Microphone not found. Please check your microphone.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please allow microphone access.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your connection.';
            break;
          case 'aborted':
            errorMessage = 'Speech recognition aborted';
            break;
          case 'service-not-allowed':
            errorMessage = 'Speech service not allowed. Please check browser settings.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        setError(errorMessage);
      };

      // End handler
      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };

      // Start handler
      recognition.onstart = () => {
        console.log('Speech recognition started');
        setError(null);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Error initializing speech recognition:', err);
      setIsSupported(false);
      setError('Failed to initialize speech recognition');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (err) {
          console.error('Error cleaning up speech recognition:', err);
        }
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      console.error('Speech recognition not initialized');
      setError('Speech recognition not initialized');
      return;
    }

    if (isListening) {
      console.warn('Already listening');
      return;
    }

    // First, test if microphone is accessible
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        console.log('✓ Microphone access granted');
        stream.getTracks().forEach(track => track.stop()); // Stop the test stream
        
        // Now start speech recognition
        try {
          console.log('Starting speech recognition...');
          recognitionRef.current.start();
          setIsListening(true);
          setTranscript('');
          setError(null);
        } catch (error: any) {
          console.error('Error starting speech recognition:', error);
          
          // Handle already-started error
          if (error.message && error.message.includes('already started')) {
            console.log('Recognition already started, stopping and restarting...');
            try {
              recognitionRef.current.stop();
              setTimeout(() => {
                try {
                  recognitionRef.current.start();
                  setIsListening(true);
                  setTranscript('');
                  setError(null);
                } catch (retryError) {
                  console.error('Retry failed:', retryError);
                  setError('Failed to start speech recognition. Please try again.');
                }
              }, 100);
            } catch (stopError) {
              console.error('Error stopping recognition:', stopError);
              setError('Failed to restart speech recognition');
            }
          } else {
            setError('Failed to start speech recognition. Please try again.');
          }
        }
      })
      .catch(err => {
        console.error('Microphone access denied or not available:', err);
        setError('Cannot access microphone. Please check permissions in browser settings.');
      });
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) {
      console.error('Speech recognition not initialized');
      return;
    }

    if (!isListening) {
      console.warn('Not currently listening');
      return;
    }

    try {
      console.log('Stopping speech recognition...');
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
      setIsListening(false);
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error
  };
}
