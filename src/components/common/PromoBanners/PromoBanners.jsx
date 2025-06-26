import React from "react";
import styles from "./PromoBanners.module.css";
import { useQuery } from "@tanstack/react-query";
import { FaImage } from "react-icons/fa";

const fetchBanners = async () => {
  const response = await fetch(
    "https://app.quickly.codes/luban-elgazal/public/api/yearly-offer-banners"
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const BannerPlaceholder = () => (
  <div className={styles.banner}>
    <div className={styles.imagePlaceholder}>
      <FaImage />
    </div>
  </div>
);

const PromoBanners = () => {
  const { data: bannersData, isLoading } = useQuery({
    queryKey: ["yearlyOfferBanners"],
    queryFn: fetchBanners,
  });

  const banners = bannersData?.data || [];

  return (
    <section className={styles.promoBannersSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>عروض حصرية</h2>
      </div>
      <div className={styles.bannersContainer}>
        {/* First Banner Slot */}
        {isLoading ? (
          <div className={`${styles.banner} ${styles.loading}`}>
            <div className={styles.imagePlaceholder}>
              <FaImage />
            </div>
          </div>
        ) : banners[0] ? (
          <div className={styles.banner}>
            <img
              src={banners[0].image_url}
              alt="عرض حصري"
              className={styles.bannerImage}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div
              className={styles.imagePlaceholder}
              style={{ display: "none" }}
            >
              <FaImage />
            </div>
          </div>
        ) : (
          <BannerPlaceholder />
        )}

        {/* Second Banner Slot */}
        {isLoading ? (
          <div className={`${styles.banner} ${styles.loading}`}>
            <div className={styles.imagePlaceholder}>
              <FaImage />
            </div>
          </div>
        ) : banners[1] ? (
          <div className={styles.banner}>
            <img
              src={banners[1].image_url}
              alt="عرض حصري"
              className={styles.bannerImage}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div
              className={styles.imagePlaceholder}
              style={{ display: "none" }}
            >
              <FaImage />
            </div>
          </div>
        ) : (
          <BannerPlaceholder />
        )}
      </div>
    </section>
  );
};

export default PromoBanners;
