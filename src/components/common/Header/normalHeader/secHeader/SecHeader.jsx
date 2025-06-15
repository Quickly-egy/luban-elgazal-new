import {
  FaFacebookF,
  FaInstagram,
  FaPhone,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import styles from "./secHeader.module.css";
import { IoMdMail } from "react-icons/io";

export default function SecHeader() {
  const socialDala = [
    {
      icon: <FaFacebookF />,
      link: "https://www.facebook.com/profile.php?id=100000000000000",
    },
    {
      icon: <FaTwitter />,
      link: "https://www.twitter.com/profile.php?id=100000000000000",
    },
    {
      icon: <FaInstagram />,
      link: "https://www.instagram.com/profile.php?id=100000000000000",
    },
    {
      icon: <FaYoutube />,
      link: "https://www.youtube.com/profile.php?id=100000000000000",
    },
    {
      icon: <FaTiktok />,
      link: "https://www.linkedin.com/profile.php?id=100000000000000",
    },
  ];

  const contactData = [
    {
      title: "متاحون 24/7",
      color: "#3bcc9c",
    },
    {
      title: "updated@example.com",
      icon: <IoMdMail className={styles.icon} style={{ color: "#145efc" }} />,

      bg: "#dbebff",
    },
    {
      title: "+201129340477",
      icon: <FaPhone className={styles.icon} style={{ color: "#33b084" }} />,

      bg: "#cffae5",
    },
  ];

  return (
    <div className={`${styles.secHeader} center`}>
      <div className={`container ${styles.container} between`}>
        <div className={`${styles.social} center`}>
          {socialDala.map((item, index) => (
            <a href={item.link} key={index} className={`center`}>
              {item.icon}
            </a>
          ))}
        </div>

        {/* right part contact */}
        <div className={`${styles.contact} center`}>
          {contactData.map((item, index) => (
            <a href="#" key={index} className={`center`}>
              <p style={{ color: item.icon ? "black" : item.color }}>{item.title}</p>
              {item.icon ? <span style={{ backgroundColor: item.bg }} className={`center`}>
                {item.icon}
              </span> : null}

            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
