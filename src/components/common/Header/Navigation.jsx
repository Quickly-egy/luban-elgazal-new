import React from 'react';

const Navigation = () => {
  const navigationItems = [
    { name: 'الرئيسية', href: '/', icon: 'fas fa-home', isSpecial: true },
    { name: 'المنتجات', href: '/products', icon: 'fas fa-gift', badge: 'جديد' },
    { name: 'تتبع الطلب', href: '/track-order', icon: 'fas fa-search' },
    { name: 'المدونة', href: '/blog', icon: 'fas fa-blog' },
    { name: 'تواصل معنا', href: '/contact', icon: 'fas fa-phone' },
    { name: 'من نحن', href: '/about', icon: 'fas fa-info-circle' },
    { name: 'الأسئلة الشائعة', href: '/faq', icon: 'fas fa-question-circle' }
  ];

  return (
    <nav className="navigation">
      <div className="container">
        <ul className="nav-list">
          {navigationItems.map((item, index) => (
            <li key={index} className={`nav-item ${item.isSpecial ? 'special' : ''}`}>
              <a href={item.href} className="nav-link">
                <i className={item.icon}></i>
                <span>{item.name}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation; 