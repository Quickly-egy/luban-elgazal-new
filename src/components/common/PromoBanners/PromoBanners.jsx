import React, { useMemo } from "react";
import styles from "./PromoBanners.module.css";
import { useQuery } from "@tanstack/react-query";
import { FaImage } from "react-icons/fa";

// Fetch banners from API
const fetchBanners = async () => {
  const response = await fetch("https://app.quickly.codes/luban-elgazal/public/api/yearly-offer-banners");
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

// Banner Placeholder (for loading or fallback)
const BannerPlaceholder = () => (
  <div className={`${styles.banner} ${styles.loading}`}>
    <div className={styles.imagePlaceholder}>
      <FaImage />
    </div>
  </div>
);

// Banner Renderer with Fallback
const PromoBanner = React.memo(({ imageUrl }) => {
  const handleImageError = (e) => {
    e.target.style.display = "none";
    const fallback = e.target.nextSibling;
    if (fallback) fallback.style.display = "flex";
  };

  return (
    <div className={styles.banner}>
      <img
        src={imageUrl}
        alt="عرض حصري"
        className={styles.bannerImage}
        onError={handleImageError}
        loading="lazy" // Lazy load the image
      />
      <div className={styles.imagePlaceholder} style={{ display: "none" }}>
        <FaImage />
      </div>
    </div>
  );
});

const PromoBanners = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["yearlyOfferBanners"],
    queryFn: fetchBanners,
    staleTime: 1000 * 60 * 5, // caching for 5 minutes
  });

  const banners = useMemo(() => data?.data || [], [data]);

  return (
    <section className={styles.promoBannersSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>عروض حصرية</h2>
      </div>

      <div className={styles.bannersContainer}>
        {[0, 1].map((i) =>
          isLoading ? (
            <BannerPlaceholder key={i} />
          ) : banners[i] ? (
            <PromoBanner key={banners[i].id} imageUrl={banners[i].image_url} />
          ) : (
            <BannerPlaceholder key={i} />
          )
        )}
      </div>
    </section>
  );
};

export default React.memo(PromoBanners);
