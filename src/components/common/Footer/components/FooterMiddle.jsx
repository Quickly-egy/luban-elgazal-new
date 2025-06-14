import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaTiktok
} from 'react-icons/fa';
import { contactAPI } from '../../../../services/endpoints';

const FooterMiddle = () => {
  const [contactData, setContactData] = useState(null);

  // جلب بيانات التواصل من API
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const result = await contactAPI.getContactData();
        if (result.success) {
          setContactData(result.data);
        }
      } catch (error) {
        console.error("Error fetching contact data:", error);
      }
    };

    fetchContactData();
  }, []);

  const footerSections = [
    {
      title: 'أشهر التصنيفات',
      color: 'red',
      links: [
        { name: 'جميع المنتجات', href: '/products' },
        { name: 'باقات التوفير', href: '/bundles' },
        { name: 'اللبان الجودري للعلاج والآكل والشرب', href: '/frankincense-medical' },
        { name: 'منتجات اللبان للعناية بالجمال', href: '/beauty-products' },
        { name: 'اللبان الجودري للبخور', href: '/frankincense-incense' }
      ]
    },
    {
      title: 'لبان الغزال',
      color: 'purple',
      links: [
        { name: 'سياسة الخصوصية', href: '/privacy-policy' },
        { name: 'قواعد الاستخدام', href: '/terms-of-service' },
        { name: 'الشحن والتوصيل', href: '/shipping-policy' },
        { name: 'سياسة الاسترداد والاستبدال', href: '/return-policy' },
        { name: 'المدونة', href: '/blog' }
      ]
    },
    {
      title: 'حسابي',
      color: 'green',
      links: [
        { name: 'حسابي', href: '/profile' },
        { name: 'الطلبات', href: '/profile' },
        { name: 'المفضلة', href: '/profile' }
      ]
    }
  ];

  // إنشاء روابط وسائل التواصل الاجتماعي من API
  const socialLinks = [
    ...(contactData?.facebook ? [{ 
      icon: FaFacebookF, 
      color: "hover:text-blue-600", 
      label: "فيسبوك",
      url: contactData.facebook
    }] : []),
    ...(contactData?.twitter ? [{ 
      icon: FaTwitter, 
      color: "hover:text-blue-400", 
      label: "تويتر",
      url: contactData.twitter
    }] : []),
    ...(contactData?.instagram ? [{ 
      icon: FaInstagram, 
      color: "hover:text-pink-600", 
      label: "إنستغرام",
      url: contactData.instagram
    }] : []),
    ...(contactData?.youtube ? [{ 
      icon: FaYoutube, 
      color: "hover:text-red-600", 
      label: "يوتيوب",
      url: contactData.youtube
    }] : []),
    ...(contactData?.tiktok ? [{ 
      icon: FaTiktok, 
      color: "hover:text-black", 
      label: "تيك توك",
      url: contactData.tiktok
    }] : []),
  ];

  return (
    <div className="footer-middle">
      <div className="container">
        <div className="footer-middle-content">
          {/* معلومات الشركة */}
          <div className="company-info">
            <div className="company-logo-section">
              <img
                src="https://luban-alghazal.com/wp-content/uploads/2025/04/LUBAN-ALGHAZAL-02-scaled-1.avif"
                alt="لبان الغزال"
                className="company-logo"
              />
            </div>
            
            <p className="company-description">
              نحن نقدم أجود أنواع اللبان الحوجري الطبيعي من عُمان، مع ضمان الجودة والأصالة في كل منتج نقدمه لعملائنا الكرام.
            </p>
            
            {/* Contact Info */}
            <div className="contact-info">
              {contactData?.email && (
                <div className="contact-item">
                  <div className="contact-details">
                    <Link to={`mailto:${contactData.email}`} className="contact-link">
                      {contactData.email}
                    </Link>
                  </div>
                  <FaEnvelope className="contact-icon" />
                </div>
              )}
              
              {contactData?.phone && (
                <div className="contact-item">
                  <div className="contact-details">
                    <a href={`tel:${contactData.phone}`} className="contact-link">
                      {contactData.phone}
                    </a>
                  </div>
                  <FaPhone className="contact-icon" />
                </div>
              )}
              
              {contactData?.address && (
                <div className="contact-item">
                  <div className="contact-details">
                    <span>{contactData.address}</span>
                  </div>
                  <FaMapMarkerAlt className="contact-icon" />
                </div>
              )}
            </div>
          </div>

          {/* الأعمدة الثلاثة */}
          <div className="footer-links">
            {footerSections.map((section, sectionIndex) => (
              <div 
                key={sectionIndex}
                className="footer-section"
              >
                <h3 className={`section-title-${section.color}`}>
                  <span className={`title-line title-line-${section.color}`}></span>
                  {section.title}
                </h3>
                <ul>
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link to={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterMiddle; 