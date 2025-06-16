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
import useAbout from "../../../../../hooks/useAbout";

export default function SecHeader() {
  const { data, isLoading, isError } = useAbout();

  const socialDala = [
    {
      icon: <FaFacebookF />,
      link: data?.facebook || '#',
    },
    {
      icon: <FaTwitter />,
      link: data?.twitter || '#',
    },
    {
      icon: <FaInstagram />,
      link: data?.instagram || '#',
    },
    {
      icon: <FaYoutube />,
      link: data?.youtube || '#',
    },
    {
      icon: <FaTiktok />,
      link: data?.tiktok || '#',
    },
  ];

  const contactData = [
    {
      title: "متاحون 24/7",
      color: "#3bcc9c",
    },
    {
      title: data?.email || 'Loading...',
      icon: <IoMdMail className={styles.icon} style={{ color: "#145efc" }} />,
      bg: "#dbebff",
    },
    {
      title: data?.phone || 'Loading...',
      icon: <FaPhone className={styles.icon} style={{ color: "#33b084" }} />,
      bg: "#cffae5",
    },
  ];

  if (isLoading) {
    return <div className={`${styles.secHeader} center`}>Loading...</div>;
  }

  if (isError) {
    return <div className={`${styles.secHeader} center`}>Error loading data</div>;
  }

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
              <p style={{ color: item.icon ? "black" : item.color }}>
                {item.title}
              </p>
              {item.icon ? (
                <span style={{ backgroundColor: item.bg }} className={`center`}>
                  {item.icon}
                </span>
              ) : null}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
