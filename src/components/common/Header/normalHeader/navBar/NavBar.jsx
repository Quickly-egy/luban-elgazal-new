import { Link, useLocation } from 'react-router-dom';
import styles from './navBar.module.css'
export default function NavBar({ isFixed = false }) {
    const location = useLocation();
    const navigationLinks = [
        { name: "الأسئلة الشائعة", path: "/faq", icon: "❓", badge: null },
        { name: "من نحن", path: "/whoweare", icon: "ℹ️", badge: null },
        { name: "تواصل معنا", path: "/contact", icon: "📞", badge: null },
        { name: "المدونة", path: "/blog", icon: "📝", badge: null },
    
        { name: "تتبع الطلب", path: "/order-tracking", icon: "📦", badge: null },
        { name: "المنتجات", path: "/products", icon: "🛍️", badge: "جديد" },
        { name: "الرئيسية", path: "/", icon: "🏠", badge: null },
    ];
    return (



        <nav className={`${styles.nav} ${isFixed ? styles.fixed : ''} center`}>
            <div className={`${styles.container} center`}>
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
