import React from 'react';
import PaymentFailed from './PaymentFailed';
import Header from '../../components/common/Header/Header';
import Footer from '../../components/common/Footer/Footer';

const PaymentFailedWrapper = () => {
    return (
        <div className="payment-failed-wrapper">
            <Header />
            <PaymentFailed />
            <Footer />
        </div>
    );
};

export default PaymentFailedWrapper; 