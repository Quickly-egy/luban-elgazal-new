
import { Link, useLocation } from 'react-router-dom';
import styles from './navBar.module.css'
export default function NavBar() {
    const location = useLocation();
    const navigationLinks = [
        { name: "الرئيسية", path: "/", icon: "🏠", badge: null },
        { name: "المنتجات", path: "/products", icon: "🛍️", badge: "جديد" },
        { name: "تتبع الطلب", path: "/order-tracking", icon: "📦", badge: null },
        { name: "المدونة", path: "/blog", icon: "📝", badge: null },
        { name: "تواصل معنا", path: "/contact", icon: "📞", badge: null },
        { name: "من نحن", path: "/about", icon: "ℹ️", badge: null },
        { name: "الأسئلة الشائعة", path: "/faq", icon: "❓", badge: null },
    ];
    return (
        <nav className={`${styles.nav} center`}>
            <div className={`${styles.container} container center`}>
                <ul className={`center`}>
                    {navigationLinks.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className={`${styles.link} ${location.pathname === item.path ? styles.active : ''} center`}
                        >
                            {item.name} {item.icon}
                        </Link>
                    ))}
                </ul>
            </div>
        </nav>
    )
}
