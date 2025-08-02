import React, { useMemo, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "../components/common/Header/Header";
import Footer from "../components/common/Footer/Footer";
import CheckoutFooter from "../components/common/Footer/components/CheckoutFooter";
import ScrollToTop from "../components/common/ScrollToTop/ScrollToTop";
import BottomNavigation from "../components/common/BottomNavigation/BottomNavigation";

// Lazy load all page components
const Home = React.lazy(() => import("../pages/Home/Home"));
const Products = React.lazy(() => import("../pages/Products/Products"));
const FAQ = React.lazy(() => import("../pages/FAQ/FAQ"));
const Contact = React.lazy(() => import("../pages/Contact/Contact"));
const Blog = React.lazy(() => import("../pages/Blog/Blog"));
const BlogDetailSimple = React.lazy(() => import("../pages/Blog/BlogDetailSimple"));
const TestDetail = React.lazy(() => import("../pages/Blog/TestDetail"));
const ProductDetail = React.lazy(() => import("../pages/ProductDetail/ProductDetail"));
const PackageDetail = React.lazy(() => import("../pages/PackageDetail"));
const WhoWeAre = React.lazy(() => import("../pages/WhoWeAre/WhoWeAre"));
const OrderTracking = React.lazy(() => import("../pages/OrderTracking/OrderTracking"));
const Order = React.lazy(() => import("../pages/order/Order"));
const OrderDetail = React.lazy(() => import("../pages/OrderDetail/OrderDetail"));
const Tikets = React.lazy(() => import("../pages/tickets/Tikets"));
const TicketDetails = React.lazy(() => import("../pages/tickets/TicketDetails"));
const Private = React.lazy(() => import("../pages/privatePolice/Private"));
const Checkout = React.lazy(() => import("../pages/Checkout/Checkout"));
const OrderSuccess = React.lazy(() => import("../pages/OrderSuccess"));
const PaymentFailedWrapper = React.lazy(() => import("../pages/PaymentFailed/index.jsx"));
const TermsOfService = React.lazy(() => import("../pages/TermsOfService/TermsOfService"));
const ShippingPolicy = React.lazy(() => import("../pages/ShippingPolicy/ShippingPolicy"));
const ReturnPolicy = React.lazy(() => import("../pages/ReturnPolicy/ReturnPolicy"));
const TestGeography = React.lazy(() => import("../pages/TestGeography/TestGeography"));

// 404 page
const NotFound = () => (
  <div className="not-found-page">
    <div className="not-found-content">
      <h1>404</h1>
      <h2>الصفحة غير موجودة</h2>
      <p>الرابط المطلوب: <code>{window.location.pathname}</code></p>
      <button onClick={() => window.history.back()} className="back-button">
        العودة للخلف
      </button>
    </div>
  </div>
);

const routeConfig = [
  { path: "/", component: Home },
  { path: "/products", component: Products },
  { path: "/faq", component: FAQ },
  { path: "/contact", component: Contact },
  { path: "/whoweare", component: WhoWeAre },
  { path: "/about", component: WhoWeAre },
  { path: "/blog", component: Blog },
  { path: "/blog/:id", component: BlogDetailSimple },
  { path: "/product/:id", component: ProductDetail },
  { path: "/package/:id", component: PackageDetail },
  { path: "/order-tracking", component: OrderTracking },
  { path: "/order", component: Order },
  { path: "/order-detail/:orderId", component: OrderDetail },
  { path: "/tickets", component: Tikets },
  { path: "/tickets/:ticketId", component: TicketDetails },
  { path: "/privacy-policy", component: Private },
  { path: "/terms-of-service", component: TermsOfService },
  { path: "/shipping-policy", component: ShippingPolicy },
  { path: "/return-policy", component: ReturnPolicy },
  { path: "/checkout", component: Checkout },
  { path: "/order-success", component: OrderSuccess },
  { path: "/test-geography", component: TestGeography },
];

const RoutesComponent = () => {
  const location = useLocation();

  const routeInfo = useMemo(() => {
    const pathname = location.pathname;
    return {
      isCheckoutPage: pathname === "/checkout",
      shouldHideHeaderFooter: pathname === "/payment-failed"
    };
  }, [location.pathname]);

  const routeElements = useMemo(() =>
    routeConfig.map(({ path, component: Component }) => (
      <Route key={path} path={path} element={<Component />} />
    )),
    []
  );

  const FooterComponent = routeInfo.isCheckoutPage ? CheckoutFooter : Footer;

  if (routeInfo.shouldHideHeaderFooter) {
    return (
      <div className="app">
        <ScrollToTop />
        <main className="main-content">
          <Routes>
            <Route path="/payment-failed" element={<PaymentFailedWrapper />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <ScrollToTop />
      <Header />
      <main className="main-content">
        <Routes>
          {routeElements}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <FooterComponent />
      <BottomNavigation />
    </div>
  );
};

export default RoutesComponent;
