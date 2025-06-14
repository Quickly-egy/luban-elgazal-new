import { FaEnvelope } from "react-icons/fa";
import styles from "./contact.module.css";
export default function Contact() {
  return (
    <section>
      <div className={`${styles.hero} flex-column`}>
        <div className={styles.message_icon}>
            <FaEnvelope className={styles.post_icon}/>
        </div>
        <h2 className={styles.contact_address}>تواصل معنا</h2>
      </div>
    </section>
  );
}
