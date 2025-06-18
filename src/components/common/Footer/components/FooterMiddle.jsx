import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaUserPlus
} from 'react-icons/fa';
import { contactAPI } from '../../../../services/endpoints';
import useAuthStore from '../../../../stores/authStore';
import { LoginModal, RegisterModal, ForgotPasswordModal } from '../../Header/authModals';
import OTPModal from '../../Header/authModals/OTPModal';
import SuccessNotification from '../../SuccessNotification/SuccessNotification';

const FooterMiddle = () => {
  const [contactData, setContactData] = useState(null);
  const { isAuthenticated } = useAuthStore();

  // Modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [globalNotification, setGlobalNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

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

  // Create footer sections based on authentication status
  const getFooterSections = () => {
    const baseSections = [
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
        ]
      }
    ];

    // Add authentication-based section
    if (isAuthenticated) {
      baseSections.push({
        title: 'حسابي',
        color: 'green',
        links: [
          { name: 'حسابي', href: '/profile' },
          { name: 'الطلبات', href: '/profile' },
          { name: 'المفضلة', href: '/profile' }
        ]
      });
    } else {
      baseSections.push({
        title: 'الحساب',
        color: 'green',
        links: [
          {
            name: 'تسجيل الدخول',
            href: '#',
            onClick: () => setShowLoginModal(true),
            icon: FaUser
          },
          {
            name: 'إنشاء حساب',
            href: '#',
            onClick: () => setShowRegisterModal(true),
            icon: FaUserPlus
          }
        ]
      });
    }

    return baseSections;
  };

  const footerSections = getFooterSections();

  const handleLinkClick = (link, e) => {
    if (link.onClick) {
      e.preventDefault();
      link.onClick();
    }
  };

  return (
    <>
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
                        {link.onClick ? (
                          <button
                            onClick={(e) => handleLinkClick(link, e)}
                            className="footer-auth-button"
                          >
                            {link.icon && <link.icon className="footer-auth-icon" />}
                            {link.name}
                          </button>
                        ) : (
                          <Link to={link.href}>{link.name}</Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modals */}
      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        setShowRegisterModal={setShowRegisterModal}
        setShowForgotPasswordModal={setShowForgotPasswordModal}
      />
      <RegisterModal
        showRegisterModal={showRegisterModal}
        setShowRegisterModal={setShowRegisterModal}
        setShowLoginModal={setShowLoginModal}
        setShowOTPModal={setShowOTPModal}
        setGlobalNotification={setGlobalNotification}
      />
      <OTPModal
        showOTPModal={showOTPModal}
        setShowOTPModal={setShowOTPModal}
        setShowLoginModal={setShowLoginModal}
        setGlobalNotification={setGlobalNotification}
      />
      <ForgotPasswordModal
        showForgotPasswordModal={showForgotPasswordModal}
        setShowForgotPasswordModal={setShowForgotPasswordModal}
        setShowLoginModal={setShowLoginModal}
      />

      {/* Global Success Notification */}
      <SuccessNotification
        isVisible={globalNotification.isVisible}
        message={globalNotification.message}
        type={globalNotification.type}
        onClose={() => setGlobalNotification(prev => ({ ...prev, isVisible: false }))}
        duration={4000}
      />
    </>
  );
};

export default FooterMiddle; 