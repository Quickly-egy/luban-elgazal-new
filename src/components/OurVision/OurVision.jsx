import { FaBullseye, FaEye, FaQuoteLeft } from "react-icons/fa";
import styles from "./ourvision.module.css";
// import { useState } from "react";
  const tabs = [
    { id: "story", label: "قصتنا", icon: <FaQuoteLeft /> },
    { id: "mission", label: "رسالتنا", icon: <FaBullseye /> },
    { id: "vision", label: "رؤيتنا", icon: <FaEye /> },
  ];
const OurVision = () => {
  // const [tabs, setTabs] = useState('قصتنا')
  return (
    <section className={`${styles.second_section} container`}>
      {/* tabs */}
      <div className={`${styles.tabs} center`}>
        <ul className={`${styles.nav} center`}>
          {tabs.map((tab) => (
            <li className={`${styles.item} center`} key={tab.id}>
              {tab.icon}
              {tab.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default OurVision;
