import React, { useState } from 'react';
import { 
  FaPaperPlane,
  FaEnvelope,
  FaCheckCircle,
  FaShieldAlt,
  FaHeart
} from 'react-icons/fa';
import { newsletterAPI } from '../../../../services/endpoints';

const FooterTop = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');



  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    setSubscriptionStatus('idle');
    setErrorMessage('');

    try {
      const result = await newsletterAPI.subscribe(email.trim());
      

      setEmail('');
      document.querySelector('.newsletter-input').value = '';
      

      if (result.isAlreadySubscribed) {
        setErrorMessage('هذا البريد الإلكتروني مشترك بالفعل في نشرتنا الإخبارية');
        setSubscriptionStatus('error');
        setTimeout(() => {
          setSubscriptionStatus('idle');
          setErrorMessage('');
        }, 5000);
      } else {
        setSubscriptionStatus('success');
        setTimeout(() => {
          setSubscriptionStatus('idle');
        }, 5000);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setSubscriptionStatus('error');
      
      setTimeout(() => {
        setSubscriptionStatus('idle');
        setErrorMessage('');
      }, 7000);
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="footer-top">
      <div className="container">
        <div className="footer-top-content">
          <section className="newsletter-section">
            <div className="newsletter-bg">
              <div className="newsletter-bg-circle newsletter-bg-circle-1"></div>
              <div className="newsletter-bg-circle newsletter-bg-circle-2"></div>
              <div className="newsletter-bg-circle newsletter-bg-circle-3"></div>
            </div>

            <div className="newsletter-content">
              <div className="newsletter-header">
                <div className="newsletter-icon">
                  <FaEnvelope />
                </div>
                
                <h2 className="newsletter-title">
                  اشترك في نشرتنا الإخبارية
                </h2>
                <p className="newsletter-description">
                  كن أول من يعرف عن منتجاتنا الجديدة والعروض الخاصة والأخبار المهمة من لبان الغزال
                </p>
              </div>

              <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                <div className="newsletter-input-wrapper">
                  <div className="newsletter-input-container">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="أدخل بريدك الإلكتروني"
                      required
                      disabled={isSubscribing}
                      className="newsletter-input"
                    />
                    <div className="newsletter-input-icon">
                      <FaEnvelope />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubscribing || !email.trim()}
                    className="newsletter-submit-btn"
                  >
                    {isSubscribing ? (
                      <>
                        <div className="newsletter-loading" />
                        <span>جاري الإرسال...</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        <span>اشترك الآن</span>
                      </>
                    )}
                  </button>
                </div>

                {subscriptionStatus === 'success' && (
                  <div className="newsletter-success">
                    <FaCheckCircle />
                    <span>🎉 تم الاشتراك بنجاح! ستصلك أحدث العروض والأخبار قريباً</span>
                  </div>
                )}

                {subscriptionStatus === 'error' && (
                  <div className="newsletter-error">
                    <FaEnvelope />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </form>

              <div className="newsletter-features">
                <div className="newsletter-feature">
                  <FaShieldAlt />
                  <span>نحترم خصوصيتك</span>
                </div>
                
                <div className="newsletter-feature">
                  <FaHeart />
                  <span>محتوى مفيد فقط</span>
                </div>
                
                <div className="newsletter-feature">
                  <FaPaperPlane />
                  <span>بدون رسائل مزعجة</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FooterTop; 