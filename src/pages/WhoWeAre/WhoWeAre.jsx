import { FaLeaf } from "react-icons/fa";
import styles from "./whoweare.module.css";
import OurVision from "../../components/OurVision/OurVision";
import CustomerReviews from "../../components/common/CustomerReviews/CustomerReviews";
import StatisticsSection from "../../components/common/StatisticsSection/StatisticsSection";

const WhoWeAre = () => {
  return (
    <>
      <section className={styles.main_sectoin}>
        {/* background */}
        <div className={`${styles.hero} center`}>
          <div className={styles.behind}></div>
          <img
            src="https://luban-alghazal.com/wp-content/uploads/2025/04/LUBAN-ALGHAZAL-02-scaled-1.avif"
            alt="luban-elghazal"
          />
          <div className={`${styles.content} flex-column`}>
            <div className={`${styles.icon} center`}>
              <FaLeaf className={styles.faleaf} />
            </div>
            <h2>لبان الغزل</h2>
            <p>
              رحله عبر التاريخ لنقل أجود أنواع اللبان العماني الأصيل الي العالم
            </p>
          </div>
        </div>
      </section>
      <OurVision/>
      <StatisticsSection/>
      <CustomerReviews/>
    </>
  );
};

export default WhoWeAre;
