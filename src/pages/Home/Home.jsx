import React, { useMemo, Suspense } from 'react';
import styles from './Home.module.css';

import ImageSlider from '../../components/common/ImageSlider/ImageSlider';
import ProductCategories from '../../components/common/ProductCategories/ProductCategories';

const WhyChooseUs = React.lazy(() => import('../../components/common/WhyChooseUs/WhyChooseUs'));
const SpecialOffers = React.lazy(() => import('../../components/common/SpecialOffers/SpecialOffers'));
const PromoBanners = React.lazy(() => import('../../components/common/PromoBanners/PromoBanners'));
const HistoryJourney = React.lazy(() => import('../../components/common/HistoryJourney/HistoryJourney'));
const FeaturedProducts = React.lazy(() => import('../../components/common/FeaturedProducts/FeaturedProducts'));
const FeaturedPackages = React.lazy(() => import('../../components/common/FeaturedPackages/FeaturedPackages'));
const StatisticsSection = React.lazy(() => import('../../components/common/StatisticsSection/StatisticsSection'));
const CustomerReviews = React.lazy(() => import('../../components/common/CustomerReviews/CustomerReviews'));

const Home = () => {
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

      {/* Below-the-fold content */}
      <Suspense fallback={null}><WhyChooseUs /></Suspense>
      <Suspense fallback={null}><SpecialOffers /></Suspense>
      <Suspense fallback={null}><HistoryJourney /></Suspense>
      <Suspense fallback={null}><FeaturedProducts /></Suspense>
      <Suspense fallback={null}><FeaturedPackages /></Suspense>
      <Suspense fallback={null}><PromoBanners /></Suspense>
      <Suspense fallback={null}><StatisticsSection /></Suspense>
      <Suspense fallback={null}><CustomerReviews /></Suspense>
    </div>
  );
};

export default Home;
