import React, { Suspense, useMemo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Core components - keep these loaded immediately for better UX
import Header from "../components/common/Header/Header";
import Footer from "../components/common/Footer/Footer";
import CheckoutFooter from "../components/common/Footer/components/CheckoutFooter";
import ScrollToTop from "../components/common/ScrollToTop/ScrollToTop";
<<<<<<< HEAD
import BottomNavigation from "../components/common/BottomNavigation/BottomNavigation";

// Lazy load all page components to reduce initial bundle size
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

// Optimized loading component with better UX
const PageLoader = React.memo(({ pageName = "الصفحة" }) => (
  <div className="page-loader" role="status" aria-live="polite">
    <div className="loader-content">
      <div className="spinner"></div>
      <p>جاري تحميل {pageName}...</p>
    </div>
  </div>
));

PageLoader.displayName = 'PageLoader';

// Enhanced 404 component
const NotFound = React.memo(() => (
  <div className="not-found-page">
    <div className="not-found-content">
      <h1>404</h1>
      <h2>الصفحة غير موجودة</h2>
      <p>الرابط المطلوب: <code>{window.location.pathname}</code></p>
      <button 
        onClick={() => window.history.back()}
        className="back-button"
      >
        العودة للخلف
      </button>
    </div>
  </div>
));

NotFound.displayName = 'NotFound';

// Route configuration for better maintainability
const routeConfig = [
  { path: "/", component: Home, name: "الصفحة الرئيسية" },
  { path: "/products", component: Products, name: "المنتجات" },
  { path: "/faq", component: FAQ, name: "الأسئلة الشائعة" },
  { path: "/contact", component: Contact, name: "اتصل بنا" },
  { path: "/whoweare", component: WhoWeAre, name: "من نحن" },
  { path: "/about", component: WhoWeAre, name: "حول الموقع" },
  { path: "/blog", component: Blog, name: "المدونة" },
  { path: "/blog/:id", component: BlogDetailSimple, name: "مقال المدونة" },
  { path: "/product/:id", component: ProductDetail, name: "تفاصيل المنتج" },
  { path: "/package/:id", component: PackageDetail, name: "تفاصيل الباقة" },
  { path: "/order-tracking", component: OrderTracking, name: "تتبع الطلب" },
  { path: "/order", component: Order, name: "الطلبات" },
  { path: "/order-detail/:orderId", component: OrderDetail, name: "تفاصيل الطلب" },
  { path: "/tickets", component: Tikets, name: "التذاكر" },
  { path: "/tickets/:ticketId", component: TicketDetails, name: "تفاصيل التذكرة" },
  { path: "/privacy-policy", component: Private, name: "سياسة الخصوصية" },
  { path: "/terms-of-service", component: TermsOfService, name: "شروط الخدمة" },
  { path: "/shipping-policy", component: ShippingPolicy, name: "سياسة الشحن" },
  { path: "/return-policy", component: ReturnPolicy, name: "سياسة الإرجاع" },
  { path: "/checkout", component: Checkout, name: "إتمام الطلب" },
  { path: "/order-success", component: OrderSuccess, name: "تم الطلب بنجاح" },
  { path: "/test-geography", component: TestGeography, name: "اختبار الجغرافيا" },
];
=======
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
import OrderDetail from "../pages/OrderDetail/OrderDetail";
import Tikets from "../pages/tickets/Tikets";
import TicketDetails from "../pages/tickets/TicketDetails";
import Private from "../pages/privatePolice/Private";
import Checkout from "../pages/Checkout/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import PaymentFailedWrapper from "../pages/PaymentFailed/index.jsx";
import TermsOfService from "../pages/TermsOfService/TermsOfService";
import ShippingPolicy from "../pages/ShippingPolicy/ShippingPolicy";
import ReturnPolicy from "../pages/ReturnPolicy/ReturnPolicy";
import TestGeography from "../pages/TestGeography/TestGeography";
import BottomNavigation from "../components/common/BottomNavigation/BottomNavigation";
>>>>>>> 844a7b1cd1b3a4faeac33d8bee234977e640f2df

const RoutesComponent = () => {
  const location = useLocation();

  // Memoize route checks to prevent unnecessary recalculations
  const routeInfo = useMemo(() => {
    const pathname = location.pathname;
    
    const checkoutRoutes = ["/checkout"];
    const noHeaderFooterRoutes = ["/payment-failed"];
    
    return {
      isCheckoutPage: checkoutRoutes.includes(pathname),
      shouldHideHeaderFooter: noHeaderFooterRoutes.includes(pathname),
      pathname
    };
  }, [location.pathname]);

  // Special handling for payment failed page
  if (routeInfo.shouldHideHeaderFooter) {
    return (
      <div className="app">
        <ScrollToTop />
        <main className="main-content">
          <Suspense fallback={<PageLoader pageName="صفحة الدفع" />}>
            <Routes>
              <Route path="/payment-failed" element={<PaymentFailedWrapper />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    );
  }

  // Memoized routes to prevent recreation on every render
  const routeElements = useMemo(() => {
    return routeConfig.map(({ path, component: Component, name }) => (
      <Route
        key={path}
        path={path}
        element={
          <Suspense fallback={<PageLoader pageName={name} />}>
            <Component />
          </Suspense>
        }
      />
    ));
  }, []);

  // Memoized footer component selection
  const FooterComponent = useMemo(() => {
    return routeInfo.isCheckoutPage ? CheckoutFooter : Footer;
  }, [routeInfo.isCheckoutPage]);

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
<<<<<<< HEAD
      <FooterComponent />
=======
      {isCheckoutPage ? <CheckoutFooter /> : <Footer />}
>>>>>>> 844a7b1cd1b3a4faeac33d8bee234977e640f2df
      <BottomNavigation />
    </div>
  );
};

export default RoutesComponent;