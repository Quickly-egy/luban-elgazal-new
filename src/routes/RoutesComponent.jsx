import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "../components/common/Header/Header";
import Footer from "../components/common/Footer/Footer";
import CheckoutFooter from "../components/common/Footer/components/CheckoutFooter";
import ScrollToTop from "../components/common/ScrollToTop/ScrollToTop";
import Home from "../pages/Home/Home";
import Products from "../pages/Products/Products";
import FAQ from "../pages/FAQ/FAQ";
import Contact from "../pages/Contact/Contact";
import Blog from "../pages/Blog/Blog";
import BlogDetailSimple from "../pages/Blog/BlogDetailSimple";
import TestDetail from "../pages/Blog/TestDetail";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import PackageDetail from "../pages/PackageDetail";
import WhoWeAre from "../pages/WhoWeAre/WhoWeAre";
import OrderTracking from "../pages/OrderTracking/OrderTracking";
import Order from "../pages/order/Order";
import Tikets from "../pages/tickets/Tikets";
import TicketDetails from "../pages/tickets/TicketDetails";
import Private from "../pages/privatePolice/Private";
import Checkout from "../pages/Checkout/Checkout";
import TermsOfService from "../pages/TermsOfService/TermsOfService";
import ShippingPolicy from "../pages/ShippingPolicy/ShippingPolicy";
import ReturnPolicy from "../pages/ReturnPolicy/ReturnPolicy";

const RoutesComponent = () => {
  const location = useLocation();

  // Pages where checkout footer should be shown instead of regular footer
  const checkoutRoutes = ["/checkout"];
  const isCheckoutPage = checkoutRoutes.includes(location.pathname);

  return (
    <div className="app">
      <ScrollToTop />
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/whoweare" element={<WhoWeAre />} />
          <Route path="/about" element={<WhoWeAre />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetailSimple />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/package/:id" element={<PackageDetail />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/order" element={<Order />} />
          <Route path="/tickets" element={<Tikets />} />
          <Route path="/tickets/:ticketId" element={<TicketDetails />} />
          <Route path="/privacy-policy" element={<Private />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route
            path="*"
            element={
              <div>صفحة غير موجودة - الرابط: {window.location.pathname}</div>
            }
          />
        </Routes>
      </main>
      {isCheckoutPage ? <CheckoutFooter /> : <Footer />}
    </div>
  );
};

export default RoutesComponent;
