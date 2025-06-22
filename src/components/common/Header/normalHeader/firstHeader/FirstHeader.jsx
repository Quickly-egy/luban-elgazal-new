import { TbTruckDelivery } from "react-icons/tb";
import styles from "./firstHeader.module.css";
import { FaShieldAlt } from "react-icons/fa";
import { GiPresent } from "react-icons/gi";
import { useCurrency } from "../../../../../hooks/useCurrency";

export default function FirstHeader() {
  const { formatPrice, currencyInfo } = useCurrency();

  // Base threshold in SAR (Saudi Riyal) - you can adjust this base value
  const baseThresholdSAR = 100;

  // Currency conversion rates relative to SAR
  const exchangeRates = {
    SAR: 1, // Saudi Riyal (base)
    AED: 0.98, // UAE Dirham
    QAR: 1.02, // Qatari Riyal
    KWD: 0.12, // Kuwaiti Dinar
    BHD: 0.14, // Bahraini Dinar
    OMR: 0.14, // Omani Rial
    USD: 0.27, // US Dollar
  };

  // Calculate threshold for current currency
  const currentRate = exchangeRates[currencyInfo.currency] || exchangeRates.USD;
  const thresholdAmount = Math.round(baseThresholdSAR * currentRate);
  const formattedThreshold = formatPrice(thresholdAmount);

  const data = [
    {
      icon: <TbTruckDelivery className={styles.icon} />,
      title: `شحن مجاني للطلبات اكثر من ${formattedThreshold}`,
    },
    {
      icon: <FaShieldAlt className={styles.icon} />,
      title: "ضمان الجودة 100%",
    },
    {
      icon: <GiPresent className={styles.icon} />,
      title: "هدايا مجانية مع كل طلب",
    },
  ];
  return (
    <div className={`${styles.firstHeader} center `}>
      <div className={`container center ${styles.container}`}>
        {data.map((item, index) => (
          <div key={index} className={`center`}>
            <h3>{item.title}</h3>
            {item.icon}
          </div>
        ))}
      </div>
    </div>
  );
}
