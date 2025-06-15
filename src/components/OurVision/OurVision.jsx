import { FaBullseye, FaEye, FaQuoteLeft } from "react-icons/fa";
import styles from "./ourvision.module.css";
import { useState } from "react";
import OurStory from "./OurStory/OurStory";
import OurMessage from "./OurMessage/OurMessage";

// import { useState } from "react";
const navNav = [
  { id: "story", label: "قصتنا", icon: <FaQuoteLeft /> },
  { id: "mission", label: "رسالتنا", icon: <FaBullseye /> },
];
const OurVision = () => {
  const [tabs, setTabs] = useState("قصتنا");
  return (
    <section className={`${styles.second_section} container`}>
      {/* tabs */}
      <div className={`${styles.tabs} center`}>
        <ul className={`${styles.nav} center`}>
          {navNav.map((tab) => (
            <li
              className={`${styles.item} center`}
              key={tab.id}
              onClick={() => setTabs(tab.label)}
            >
              {tab.icon}
              {tab.label}
            </li>
          ))}
        </ul>
      </div>

      {tabs === "قصتنا" && <OurStory />}
      {tabs === "رسالتنا" && <OurMessage />}
    </section>
  );
};5

export default OurVision;
