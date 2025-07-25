import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import styles from "./WhyChooseUs.module.css";

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      title: "إرجاع مجاني",
      subtitle: "خلال 30 يوم",
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M8.5 12.5L10.5 14.5L15.5 9.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      bgColor: "#ff6b35",
      bgGradient: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
    },
    {
      id: 2,
      title: "دعم 24/7",
      subtitle: "خدمة عملاء متميزة",
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 12C17 14.7614 14.7614 17 12 17M17 12C17 9.23858 14.7614 7 12 7M17 12H22M12 17C9.23858 17 7 14.7614 7 12M12 17V22M7 12C7 9.23858 9.23858 7 12 7M7 12H2M12 7V2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
      bgColor: "#8b5cf6",
      bgGradient: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
    },
    {
      id: 3,
      title: "ضمان الجودة",
      subtitle: "منتجات مفحوصة %100",
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      bgColor: "#3b82f6",
      bgGradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    },
    {
      id: 4,
      title: "شحن مجاني",
      subtitle: "لطلبات أكثر من 100 ريال",
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 16V21L8 17H2V7H8L13 3V8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.5 8C19.9045 9.40457 19.9045 11.5954 18.5 13M21 5.5C23.0516 7.55163 23.0516 10.4484 21 12.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      bgColor: "#10b981",
      bgGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
  ];

  return (
    <section className={styles.whyChooseUs}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>لماذا تختار لبان الغزال؟</h2>
          <p className={styles.subtitle}>
            نقدم لك أفضل تجربة تسوق، مع ضمان الجودة والخدمة المتميزة
          </p>
        </div>

        <div className={styles.swiperContainer}>
          <Swiper
            modules={[Autoplay]}
            spaceBetween={15}
            slidesPerView={2}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
              320: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 25,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
            className={styles.featuresSwiper}
          >
            {features.map((feature) => (
              <SwiperSlide key={feature.id}>
                <div className={styles.featureCard}>
                  <div
                    className={styles.iconContainer}
                    style={{ background: feature.bgGradient }}
                  >
                    {feature.icon}
                  </div>
                  <div className={styles.featureContent}>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureSubtitle}>{feature.subtitle}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
