import { TbTruckDelivery } from "react-icons/tb";
import styles from "./firstHeader.module.css";
import { FaShieldAlt } from "react-icons/fa";
import { GiPresent } from "react-icons/gi";
import { useCurrency } from "../../../../../hooks/useCurrency";
import { useCurrencyRates } from "../../../../../hooks/useCurrencyRates";

export default function FirstHeader() {
  const { formatPrice, currencyInfo } = useCurrency();
  const { getFreeShippingThreshold, loading } = useCurrencyRates();

  // Base threshold in SAR (Saudi Riyal) - updated to 200 SAR
  const baseThresholdSAR = 200;

  // Calculate threshold for current currency using live exchange rates
  const thresholdAmount = Math.round(getFreeShippingThreshold(currencyInfo.currency, baseThresholdSAR));
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
