import { TbTruckDelivery } from "react-icons/tb";
import styles from "./firstHeader.module.css";
import { FaShieldAlt } from "react-icons/fa";
import { GiPresent } from "react-icons/gi";
import { useCurrency } from "../../../../../hooks/useCurrency";
import { useEffect, useState } from "react";
import { getFreeShippingThreshold } from '../../../../../utils';
import useLocationStore from '../../../../../stores/locationStore';

export default function FirstHeader() {
  const { formatPrice } = useCurrency();
  const { countryCode } = useLocationStore();
  const [threshold, setThreshold] = useState(null);

  useEffect(() => {
    async function fetchThreshold() {
      const code = countryCode || 'other';
      const amount = await getFreeShippingThreshold(code);
      setThreshold(amount);
    }
    fetchThreshold();
  }, [countryCode]);

  const formattedThreshold = threshold !== null ? formatPrice(threshold) : '...';

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
