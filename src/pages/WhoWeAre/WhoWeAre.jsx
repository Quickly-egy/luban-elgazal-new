import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../../components/About/HeroSection/HeroSection';
import StorySection from '../../components/About/StorySection/StorySection';
import ValuesSection from '../../components/About/ValuesSection/ValuesSection';
import OurVision from '../../components/OurVision/OurVision';
import StatisticsSection from '../../components/common/StatisticsSection/StatisticsSection';
import CustomerReviews from '../../components/common/CustomerReviews/CustomerReviews';
import styles from './whoweare.module.css';

const WhoWeAre = () => {
  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Story Section */}
      <StorySection />
      
      {/* Values Section */}
      <ValuesSection />
      
      {/* Mission Section */}
      <OurVision />
      
      {/* Statistics Section */}
      <StatisticsSection />
      
      {/* Customer Reviews */}
      <CustomerReviews />
    </div>
  );
};

export default WhoWeAre;
