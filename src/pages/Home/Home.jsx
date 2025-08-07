import React, { useMemo, Suspense } from 'react';
import styles from './Home.module.css';

import ImageSlider from '../../components/common/ImageSlider/ImageSlider';
import ProductCategories from '../../components/common/ProductCategories/ProductCategories';

// Lazy-loaded components
const WhyChooseUs = React.lazy(() => import('../../components/common/WhyChooseUs/WhyChooseUs'));
const SpecialOffers = React.lazy(() => import('../../components/common/SpecialOffers/SpecialOffers'));
const PromoBanners = React.lazy(() => import('../../components/common/PromoBanners/PromoBanners'));
const HistoryJourney = React.lazy(() => import('../../components/common/HistoryJourney/HistoryJourney'));
const FeaturedProducts = React.lazy(() => import('../../components/common/FeaturedProducts/FeaturedProducts'));
const FeaturedPackages = React.lazy(() => import('../../components/common/FeaturedPackages/FeaturedPackages'));
const StatisticsSection = React.lazy(() => import('../../components/common/StatisticsSection/StatisticsSection'));
const CustomerReviews = React.lazy(() => import('../../components/common/CustomerReviews/CustomerReviews'));

// Reusable fallback component
const LoadingFallback = () => (
  <div className={styles.loadingPlaceholder}>
    {/* ممكن تستخدم spinner أو skeleton أو نص بسيط */}
    <p>جاري التحميل...</p>
  </div>
);

const Home = () => {
  // Sections to load immediately
  const criticalSections = useMemo(() => (
    <>
      <ImageSlider />
      <ProductCategories />
    </>
  ), []);

  return (
    <div className={styles.home}>
      {/* Above-the-fold content */}
      {criticalSections}

      {/* Below-the-fold content (lazy loaded) */}
      <Suspense fallback={<LoadingFallback />}><WhyChooseUs /></Suspense>
      <Suspense fallback={<LoadingFallback />}><SpecialOffers /></Suspense>
      <Suspense fallback={<LoadingFallback />}><HistoryJourney /></Suspense>
      <Suspense fallback={<LoadingFallback />}><FeaturedProducts /></Suspense>
      <Suspense fallback={<LoadingFallback />}><FeaturedPackages /></Suspense>
      <Suspense fallback={<LoadingFallback />}><PromoBanners /></Suspense>
      <Suspense fallback={<LoadingFallback />}><StatisticsSection /></Suspense>
      <Suspense fallback={<LoadingFallback />}><CustomerReviews /></Suspense>
    </div>
  );
};

export default Home;
