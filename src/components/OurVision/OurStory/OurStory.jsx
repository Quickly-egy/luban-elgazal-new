import styles from "./ourstory.module.css";
import luban_product from "../../../assets/images/about-us-4.webp";
const OurStory = () => {
  return (
    <section>
      <div className={styles.main}>
        <div className={styles.right}>
          <h6>معلومات حول لبان الغزال</h6>
          <p>
            مرحبًا بكم في متجر لبان الغزال، حيث تتلاقى التقاليد والغموض في قلب
            عمان، أرض غارقة في التاريخ وغنية بالكنوز الثقافية. تبدأ قصتنا بحب
            عميق لفن قطف اللبان القديم، وهي ممارسة كانت جزءًا لا يتجزأ من التراث
            العماني لعدة قرون.
          </p>
          <h6>رحلة بدأت من قلب عُمان</h6>
          <p>
            منذ أكثر من 25 عاماً، بدأت رحلتنا من أرض عُمان الطيبة، حيث ينمو أجود
            أنواع اللبان في العالم. كانت البداية بحلم بسيط: نقل هذا الكنز
            الطبيعي إلى كل بيت في العالم.
          </p>
        </div>
        <div className={styles.left}>
          <img src={luban_product} alt="luban_product" />
        </div>
      </div>
    </section>
  );
};

export default OurStory;
