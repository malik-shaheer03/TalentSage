import React from 'react';
import { HeroSection } from './sections/HeroSection';
import { CapabilitiesSection } from './sections/CapabilitiesSection';
import { RecruitmentFlowTimeline } from './sections/RecruitmentFlowTimeline';
import { MetricsSection } from './sections/MetricsSection';
import { ContactSection } from './sections/ContactSection';
import styles from './MarketingPage.module.css';

export const MarketingPage: React.FC = () => {
  return (
    <div className={styles.marketingPage}>
      <HeroSection />
      <CapabilitiesSection />
      <RecruitmentFlowTimeline />
      <MetricsSection />
      <ContactSection />
    </div>
  );
};
