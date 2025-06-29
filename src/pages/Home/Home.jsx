import React from 'react';
import ImageSlider from '../../components/common/ImageSlider/ImageSlider';
import ProductCategories from '../../components/common/ProductCategories/ProductCategories';
import WhyChooseUs from '../../components/common/WhyChooseUs/WhyChooseUs';
import SpecialOffers from '../../components/common/SpecialOffers/SpecialOffers';
import PromoBanners from '../../components/common/PromoBanners/PromoBanners';
import HistoryJourney from '../../components/common/HistoryJourney/HistoryJourney';
import FeaturedProducts from '../../components/common/FeaturedProducts/FeaturedProducts';
import FeaturedPackages from '../../components/common/FeaturedPackages/FeaturedPackages';
import StatisticsSection from '../../components/common/StatisticsSection/StatisticsSection';
import CustomerReviews from '../../components/common/CustomerReviews/CustomerReviews';

import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.home}>
      <ImageSlider />
      <ProductCategories />
      <WhyChooseUs />
      <SpecialOffers />
      <HistoryJourney />
      <FeaturedProducts />
      <FeaturedPackages />
      <PromoBanners />
      <StatisticsSection />
      <CustomerReviews />
      {/* المكونات الأخرى ستضاف هنا لاحقاً */}
    </div>
  );
};

export default Home; 