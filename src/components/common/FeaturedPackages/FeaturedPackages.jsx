import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import PackageCard from "../PackageCard/PackageCard";
import ViewAllButton from "../../ui/ViewAllButton/ViewAllButton";
import styles from "./FeaturedPackages.module.css";
import { useNavigate } from "react-router-dom";
import { useProductsWithAutoLoad } from "../../../hooks/useProducts";
import useLocationStore from "../../../stores/locationStore";

const FeaturedPackages = () => {
  const navigate = useNavigate();
  // استخدام نفس hook المستخدم في صفحة المنتجات
  const { packages, loading, error } = useProductsWithAutoLoad();

  // Process and get featured packages - نفس المنطق المستخدم في صفحة المنتجات
  const getFeaturedPackages = (allPackages) => {
    if (!Array.isArray(allPackages) || allPackages.length === 0) {
      return [];
    }

    // Filter active packages and sort by rating, then take top 8
    // استخدام نفس المنطق من صفحة المنتجات: pkg.is_active
    const activePackages = allPackages.filter((pkg) => pkg.is_active);

    const featuredPackages = activePackages
      .sort((a, b) => {
        // Sort by rating first, then by discount
        const ratingA = a.reviews_info?.average_rating || a.rating || 0;
        const ratingB = b.reviews_info?.average_rating || b.rating || 0;
        if (ratingB !== ratingA) return ratingB - ratingA;

        const discountA = a.discount_details?.value || 0;
        const discountB = b.discount_details?.value || 0;
        return discountB - discountA;
      })
      .slice(0, 8);

    return featuredPackages;
  };

  if (loading) {
    return (
      <section className={styles.featuredPackages}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>باقاتنا المميزة</h2>
            <p className={styles.subtitle}>
              اكتشف باقاتنا المختارة بأفضل الأسعار والعروض الحصرية
            </p>
          </div>
          <div className={styles.packagesContainer}>
            <div className={styles.packagesRow}>
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className={`${styles.packageWrapper} ${styles.loading}`}
                >
                  <div className={styles.packagePlaceholder} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error("Error loading packages:", error);
    return null;
  }

  const featuredPackages = getFeaturedPackages(packages);

  // Don't render if no packages available
  if (featuredPackages.length === 0) {
    return null;
  }

  return (
    <section className={styles.featuredPackages}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>باقاتنا المميزة</h2>
          <p className={styles.subtitle}>
            اكتشف باقاتنا المختارة بأفضل الأسعار والعروض الحصرية
          </p>
        </div>

        <div className={styles.swiperContainer}>
          <Swiper
            slidesPerView={"auto"}
            spaceBetween={30}
            centeredSlides={true}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            modules={[Pagination, Autoplay]}
            className={styles.swiper}
          >
            {featuredPackages.map((packageItem) => (
              <SwiperSlide
                key={`featured-package-${packageItem.id}-${
                  useLocationStore.getState().countryCode
                }`}
                className={styles.swiperSlide}
              >
                <PackageCard packageData={packageItem} showTimer={true} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <ViewAllButton
          text="عرض كل الباقات"
          onClick={() => navigate("/products?type=packages")}
          variant="secondary"
          size="medium"
        />
      </div>
    </section>
  );
};

export default FeaturedPackages;
