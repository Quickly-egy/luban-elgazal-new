import React, { useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { FaTimesCircle, FaWhatsapp, FaArrowRight } from 'react-icons/fa';
import styles from './PaymentFailed.module.css';

const PaymentFailed = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const orderDetails = location.state?.orderDetails;
    const errorMessage = location.state?.errorMessage || 'حدث خطأ أثناء عملية الدفع';
    
    useEffect(() => {
        const payment_id = searchParams.get('payment_id');
        if (payment_id) {
            updatePaymentStatus(payment_id);
        }
    }, []);

    const updatePaymentStatus = async (payment_id) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer 180|EbwkXtG5IvEjnmIat7Ts0cTiy84k92ce5sTZpDzsa524205d");

            const raw = JSON.stringify({
                "tabby_payment_id": payment_id,
                "status": "failed"
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            const response = await fetch("https://app.quickly.codes/luban-elgazal/public/api/orders/tabby/update-status", requestOptions);
            const result = await response.json();
  
        } catch (error) {
        
        }
    };

    return (
        <div className={styles.failedPage}>
            <div className={styles.container}>
                <div className={styles.failedCard}>
                    <div className={styles.header}>
                        <FaTimesCircle className={styles.failedIcon} />
                        <h1>عذراً، فشلت عملية الدفع</h1>
                        <p className={styles.errorMessage}>{errorMessage}</p>
                        {orderDetails && (
                            <p className={styles.orderNumber}>رقم الطلب: {orderDetails.order_number}</p>
                        )}
                    </div>

                    <div className={styles.suggestions}>
                        <h3>ماذا يمكنني أن أفعل؟</h3>
                        <ul>
                            <li>التأكد من وجود رصيد كافٍ في البطاقة</li>
                            <li>التأكد من صحة بيانات البطاقة المدخلة</li>
                            <li>التواصل مع البنك للتأكد من عدم وجود قيود على البطاقة</li>
                            <li>تجربة بطاقة أخرى أو طريقة دفع مختلفة</li>
                        </ul>
                    </div>

                    <div className={styles.actions}>
                        <button 
                            onClick={() => navigate('/')} 
                            className={styles.homeButton}
                        >
                            <FaArrowRight />
                            العودة للرئيسية
                        </button>

                        <a 
                            href={`https://wa.me/+201288266400?text=مشكلة في الدفع - ${orderDetails ? 'رقم الطلب: ' + orderDetails.order_number : ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.whatsappButton}
                        >
                            <FaWhatsapp />
                            تواصل مع الدعم الفني
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed; 