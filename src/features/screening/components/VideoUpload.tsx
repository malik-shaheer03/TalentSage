import { useState, useRef, ChangeEvent } from 'react';
import { useStore } from '../../../store';
import { Screening } from '../../../types/models';
import { toast } from '../../../shared/components/Toast';
import styles from './VideoUpload.module.css';

interface VideoUploadProps {
  candidateId: string;
  jobId: string;
  candidateName: string;
  onSubmitSuccess: (screening: Screening) => void;
}

export function VideoUpload({
  candidateId,
  jobId,
  candidateName,
  onSubmitSuccess
}: VideoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addScreening, addAuditLog, updateCandidate } = useStore();

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file');
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Video file must be less than 100MB');
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const simulateUpload = (): Promise<string> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          // Use the video file's object URL instead of fake remote URL
          // This prevents network errors in console
          const videoUrl = selectedFile ? URL.createObjectURL(selectedFile) : `#video-${Date.now()}`;
          resolve(videoUrl);
        }
      }, 200);
    });
  };

  const generateMockTranscript = (): string => {
    return `Hello, my name is ${candidateName}. I'm excited to apply for this position. I have over ${Math.floor(Math.random() * 5) + 3} years of experience in the field, and I believe I would be a great fit for your team.

I'm particularly interested in this role because it aligns perfectly with my career goals and skill set. In my previous position, I led several successful projects and collaborated with cross-functional teams to deliver high-quality results.

I'm confident that my background in problem-solving, communication, and technical expertise would make me a valuable addition to your organization. I look forward to the opportunity to discuss how I can contribute to your team's success. Thank you for considering my application.`;
  };

  const generateMockEvaluation = () => {
    const communication = Math.floor(Math.random() * 20) + 75; // 75-95
    const clarity = Math.floor(Math.random() * 20) + 75; // 75-95
    const confidence = Math.floor(Math.random() * 20) + 70; // 70-90
    const overall = Math.round((communication + clarity + confidence) / 3);

    let summary = '';
    if (overall >= 85) {
      summary = 'Excellent presentation with clear communication and strong confidence. Candidate demonstrates professional demeanor and articulates thoughts effectively.';
    } else if (overall >= 75) {
      summary = 'Good presentation overall. Candidate shows solid communication skills with room for improvement in delivery confidence.';
    } else {
      summary = 'Adequate presentation. Candidate could benefit from improved clarity and more confident delivery.';
    }

    return {
      communication,
      clarity,
      confidence,
      overall,
      summary
    };
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      // Simulate upload
      const videoUrl = await simulateUpload();

      // Get video duration
      const video = document.createElement('video');
      video.src = previewUrl!;
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });
      const duration = Math.round(video.duration);

      // Create screening record
      const screening: Screening = {
        id: `screening_${Date.now()}`,
        candidateId,
        jobId,
        type: 'video_upload',
        videoUrl,
        duration,
        transcript: generateMockTranscript(),
        evaluation: generateMockEvaluation(),
        reviewStatus: 'pending',
        submittedAt: Date.now()
      };

      // Add to store
      addScreening(screening);

      // Update candidate with screening reference
      updateCandidate(candidateId, { screeningId: screening.id });

      // Add audit log
      addAuditLog({
        entityType: 'screening',
        entityId: screening.id,
        action: 'screening_submitted',
        actor: 'system',
        details: {
          candidateName,
          candidateId,
          jobId,
          type: 'video_upload',
          duration
        }
      });

      // Success callback
      onSubmitSuccess(screening);
      
      // Show success toast
      toast.success('🎥 Video screening submitted successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Video Screening Submission</h2>
        <p>Upload a video response (30-60 seconds recommended)</p>
      </div>

      {!selectedFile ? (
        <div className={styles.uploadArea}>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className={styles.fileInput}
            id="video-upload"
          />
          <label htmlFor="video-upload" className={styles.uploadLabel}>
            <div className={styles.uploadIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 8L12 3L7 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 3V15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={styles.uploadText}>
              <span className={styles.uploadPrimary}>Click to upload video</span>
              <span className={styles.uploadSecondary}>or drag and drop</span>
            </div>
            <div className={styles.uploadHint}>MP4, WebM, or MOV (max 100MB)</div>
          </label>
        </div>
      ) : (
        <div className={styles.previewSection}>
          <div className={styles.videoPreview}>
            <video src={previewUrl!} controls className={styles.videoPlayer} />
          </div>

          <div className={styles.fileInfo}>
            <div className={styles.fileName}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 2V8H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{selectedFile.name}</span>
            </div>
            <div className={styles.fileSize}>
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>

          {isUploading && (
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${uploadProgress}%` }}
              />
              <span className={styles.progressText}>{uploadProgress}%</span>
            </div>
          )}

          <div className={styles.actions}>
            <button
              onClick={handleRemove}
              className={styles.removeButton}
              disabled={isUploading}
            >
              Remove Video
            </button>
            <button
              onClick={handleSubmit}
              className={styles.submitButton}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Submit Screening'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
