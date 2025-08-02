import React, { Suspense, useMemo, useEffect, useState } from 'react';
import styles from './Home.module.css';

// Critical components - load immediately (above the fold)
import ImageSlider from '../../components/common/ImageSlider/ImageSlider';
import ProductCategories from '../../components/common/ProductCategories/ProductCategories';

// Lazy load components that appear below the fold
const WhyChooseUs = React.lazy(() => import('../../components/common/WhyChooseUs/WhyChooseUs'));
const SpecialOffers = React.lazy(() => import('../../components/common/SpecialOffers/SpecialOffers'));
const PromoBanners = React.lazy(() => import('../../components/common/PromoBanners/PromoBanners'));
const HistoryJourney = React.lazy(() => import('../../components/common/HistoryJourney/HistoryJourney'));
const FeaturedProducts = React.lazy(() => import('../../components/common/FeaturedProducts/FeaturedProducts'));
const FeaturedPackages = React.lazy(() => import('../../components/common/FeaturedPackages/FeaturedPackages'));
const StatisticsSection = React.lazy(() => import('../../components/common/StatisticsSection/StatisticsSection'));
const CustomerReviews = React.lazy(() => import('../../components/common/CustomerReviews/CustomerReviews'));

// Optimized loading component
const SectionLoader = React.memo(({ height = '200px', message = 'جاري التحميل...' }) => (
  <div 
    className={styles.sectionLoader} 
    style={{ minHeight: height }}
    role="status" 
    aria-live="polite"
  >
    <div className={styles.loaderContent}>
      <div className={styles.spinner}></div>
      <span className="sr-only">{message}</span>
    </div>
  </div>
));

SectionLoader.displayName = 'SectionLoader';

// Progressive loading hook - loads sections with delays
const useProgressiveLoading = () => {
  const [loadedSections, setLoadedSections] = useState({
    whyChooseUs: false,
    specialOffers: false,
    historyJourney: false,
    featuredProducts: false,
    featuredPackages: false,
    promoBanners: false,
    statistics: false,
    reviews: false,
  });

  useEffect(() => {
    // Load sections progressively with optimized delays
    const timeouts = [
      setTimeout(() => setLoadedSections(prev => ({ ...prev, whyChooseUs: true })), 100),
      setTimeout(() => setLoadedSections(prev => ({ ...prev, specialOffers: true })), 300),
      setTimeout(() => setLoadedSections(prev => ({ ...prev, historyJourney: true })), 500),
      setTimeout(() => setLoadedSections(prev => ({ ...prev, featuredProducts: true })), 700),
      setTimeout(() => setLoadedSections(prev => ({ ...prev, featuredPackages: true })), 900),
      setTimeout(() => setLoadedSections(prev => ({ ...prev, promoBanners: true })), 1100),
      setTimeout(() => setLoadedSections(prev => ({ ...prev, statistics: true })), 1300),
      setTimeout(() => setLoadedSections(prev => ({ ...prev, reviews: true })), 1500),
    ];

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return loadedSections;
};

// Individual lazy section components
const LazySection = React.memo(({ 
  shouldLoad, 
  component: Component, 
  fallbackHeight = '200px', 
  loadingMessage = 'جاري التحميل...' 
}) => {
  if (!shouldLoad) {
    return <SectionLoader height={fallbackHeight} message={loadingMessage} />;
  }

  return (
    <Suspense fallback={<SectionLoader height={fallbackHeight} message={loadingMessage} />}>
      <Component />
    </Suspense>
  );
});

LazySection.displayName = 'LazySection';

const Home = () => {
  const loadedSections = useProgressiveLoading();

  // Memoize the critical sections that load immediately
  const criticalSections = useMemo(() => (
    <>
      <ImageSlider />
      <ProductCategories />
    </>
  ), []);

  return (
    <div className={styles.home}>
      {/* Critical above-the-fold content - loads immediately */}
      {criticalSections}
      
      {/* Below-the-fold content - loads progressively */}
      <LazySection 
        shouldLoad={loadedSections.whyChooseUs}
        component={WhyChooseUs}
        fallbackHeight="300px"
        loadingMessage="جاري تحميل لماذا تختارنا..."
      />
      
      <LazySection 
        shouldLoad={loadedSections.specialOffers}
        component={SpecialOffers}
        fallbackHeight="400px"
        loadingMessage="جاري تحميل العروض الخاصة..."
      />
      
      <LazySection 
        shouldLoad={loadedSections.historyJourney}
        component={HistoryJourney}
        fallbackHeight="350px"
        loadingMessage="جاري تحميل رحلتنا..."
      />
      
      <LazySection 
        shouldLoad={loadedSections.featuredProducts}
        component={FeaturedProducts}
        fallbackHeight="500px"
        loadingMessage="جاري تحميل المنتجات المميزة..."
      />
      
      <LazySection 
        shouldLoad={loadedSections.featuredPackages}
        component={FeaturedPackages}
        fallbackHeight="500px"
        loadingMessage="جاري تحميل الباقات المميزة..."
      />
      
      <LazySection 
        shouldLoad={loadedSections.promoBanners}
        component={PromoBanners}
        fallbackHeight="250px"
        loadingMessage="جاري تحميل الإعلانات الترويجية..."
      />
      
      <LazySection 
        shouldLoad={loadedSections.statistics}
        component={StatisticsSection}
        fallbackHeight="300px"
        loadingMessage="جاري تحميل الإحصائيات..."
      />
      
      <LazySection 
        shouldLoad={loadedSections.reviews}
        component={CustomerReviews}
        fallbackHeight="400px"
        loadingMessage="جاري تحميل آراء العملاء..."
      />
    </div>
  );
};

export default Home;