import React, { useMemo, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import styles from "./WhyChooseUs.module.css";

// الأيقونات
const ICONS = {
  return: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.891 3.891C5.282 2.5 7.522 2.5 12 2.5C16.478 2.5 18.718 2.5 20.109 3.891C21.5 5.282 21.5 7.522 21.5 12C21.5 16.478 21.5 18.718 20.109 20.109C18.718 21.5 16.478 21.5 12 21.5C7.522 21.5 5.282 21.5 3.891 20.109C2.5 18.718 2.5 16.478 2.5 12Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  support: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path d="M17 12C17 14.761 14.761 17 12 17M17 12C17 9.239 14.761 7 12 7M17 12H22M12 17C9.239 17 7 14.761 7 12M12 17V22M7 12C7 9.239 9.239 7 12 7M7 12H2M12 7V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  quality: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path d="M9 12L11 14L15 10M21 12C21 16.971 16.971 21 12 21C7.029 21 3 16.971 3 12C3 7.029 7.029 3 12 3C16.971 3 21 7.029 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  shipping: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path d="M13 16V21L8 17H2V7H8L13 3V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 8C19.905 9.405 19.905 11.595 18.5 13M21 5.5C23.052 7.552 23.052 10.448 21 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// البيانات
const FEATURES = [
  {
    id: 1,
    title: "إرجاع مجاني",
    subtitle: "خلال 30 يوم",
    iconKey: "return",
    bg: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
  },
  {
    id: 2,
    title: "دعم 24/7",
    subtitle: "خدمة عملاء متميزة",
    iconKey: "support",
    bg: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
  },
  {
    id: 3,
    title: "ضمان الجودة",
    subtitle: "منتجات مفحوصة %100",
    iconKey: "quality",
    bg: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  },
  {
    id: 4,
    title: "شحن مجاني",
    subtitle: "لطلبات أكثر من 100 ريال",
    iconKey: "shipping",
    bg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  },
];

// الكرت
const FeatureCard = React.memo(({ feature }) => (
  <div className={styles.featureCard}>
    <div className={styles.iconContainer} style={{ background: feature.bg }}>
      {ICONS[feature.iconKey]}
    </div>
    <div className={styles.featureContent}>
      <h3 className={styles.featureTitle}>{feature.title}</h3>
      <p className={styles.featureSubtitle}>{feature.subtitle}</p>
    </div>
  </div>
));

const SectionHeader = React.memo(() => (
  <div className={styles.header}>
    <h2 className={styles.title}>لماذا تختار لبان الغزال؟</h2>
    <p className={styles.subtitle}>
      نقدم لك أفضل تجربة تسوق، مع ضمان الجودة والخدمة المتميزة
    </p>
  </div>
));

// الكومبوننت الرئيسي
const WhyChooseUs = () => {
  const swiperConfig = useMemo(() => ({
    modules: [Autoplay],
    spaceBetween: 15,
    slidesPerView: 2,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    loop: true,
    lazy: true,
    watchSlidesProgress: true,
    breakpoints: {
      320: { slidesPerView: 2, spaceBetween: 10 },
      640: { slidesPerView: 2, spaceBetween: 20 },
      768: { slidesPerView: 3, spaceBetween: 25 },
      1024: { slidesPerView: 4, spaceBetween: 30 },
    },
    className: styles.featuresSwiper,
  }), []);

  const renderSlide = useCallback((f) => (
    <SwiperSlide key={f.id}>
      <FeatureCard feature={f} />
    </SwiperSlide>
  ), []);

  return (
    <section className={styles.whyChooseUs}>
      <div className={styles.container}>
        <SectionHeader />
        <div className={styles.swiperContainer}>
          <Swiper {...swiperConfig}>
            {FEATURES.map(renderSlide)}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default React.memo(WhyChooseUs);
