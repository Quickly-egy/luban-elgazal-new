import { TbTruckDelivery } from "react-icons/tb";
import styles from "./firstHeader.module.css";
import { FaShieldAlt } from "react-icons/fa";
import { GiPresent } from "react-icons/gi";

export default function FirstHeader() {
    const data = [
        {
            icon: <TbTruckDelivery className={styles.icon} />,
            title: "شحن مجاني للطلبات اكثر من 100 ريال",
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
