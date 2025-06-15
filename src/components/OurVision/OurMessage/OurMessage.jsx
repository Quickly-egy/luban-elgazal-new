import { FaCheck } from "react-icons/fa";
import styles from "./ourmessage.module.css";
import lubanProduct from '../../../assets/images/about-us-5.webp'
const OurMessage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.right}>
        <h3 className={styles.title}>رسالتنا في الحياة</h3>
        <p className={styles.description}>
          نسعى لنشر فوائد اللبان العماني الطبيعي في جميع أنحاء العالم، وتقديم
          منتجات طبيعية عالية الجودة تساهم في تحسين صحة ورفاهية عملائنا.
        </p>
        <div className={styles.list}>
          {[
            "تقديم أجود أنواع اللبان العماني الأصيل",
            "الحفاظ على التراث العماني العريق",
            "خدمة عملاء استثنائية ومميزة",
            "الالتزام بالاستدامة البيئية",
          ].map((item, index) => (
            <div key={index} className={styles.list_item}>
              <div className={styles.check_circle}>
                <FaCheck className={styles.check_icon} />
              </div>
              <span className={styles.item_text}>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={`${styles.left}`}>
        <img src={lubanProduct} alt="lubanProduct" />
      </div>
    </div>
  );
};

export default OurMessage;
