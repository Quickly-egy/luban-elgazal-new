import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import ProductGallery from "../../components/ProductDetail/ProductGallery/ProductGallery";
import ProductInfo from "../../components/ProductDetail/ProductInfo/ProductInfo";
import CashBack from "../../components/CashBack/CashBack";
import FrequentlyBought from "../../components/FrequentlyBought/FrequentlyBought";
import RelatedProducts from "../../components/RelatedProducts/RelatedProducts";
import useProductsStore from "../../stores/productsStore";
import { productAPI } from "../../services/endpoints";
import useCartStore from "../../stores/cartStore"; 
import "./ProductDetail.css";
import { FaCheck, FaTimes } from "react-icons/fa";
import FooterBanner from "./FooterBanner";

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const [relatedProducts, setRelatedProducts] = useState([]);


const [selectedIds, setSelectedIds] = useState([]);
const { addToCart } = useCartStore(); // من Zustand
  // Get package data from store
  const { getPackageById,loadProducts,allProducts} = useProductsStore();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        // First: Check if product data exists in state
        const productFromState = location.state?.product;

        if (productFromState && productFromState.id === parseInt(id)) {
     
          const transformedProduct = transformProductData(productFromState);
          setProduct(transformedProduct);
          setLoading(false);
          return;
        }

        // Check if it's a package first
        const packageData = getPackageById(parseInt(id));
        if (packageData) {
   
          const transformedPackage = transformPackageData(packageData);
          setProduct(transformedPackage);
          setLoading(false);
          return;
        }

        // If data doesn't exist, fetch from API
        setLoading(true);
        setError(null);

        const response = await productAPI.getProductById(id);


        if (response.success && response.data) {
          const transformedProduct = transformProductData(response.data);

          setProduct(transformedProduct);

        } else {

          setError(response.message || "فشل في تحميل بيانات المنتج");
        }
      } catch (error) {

        setError("حدث خطأ في تحميل المنتج");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id, location.state, getPackageById]);
useEffect(() => {
  if (allProducts.length === 0) {
    loadProducts();
  }
}, [])
useEffect(() => {
  if (!product || !product.category || allProducts.length === 0) return;

  const related = allProducts
    .filter(
      (p) =>
        p.category === product.category 
    )
    .slice(0, 2); // نأخذ أول 2 فقط

  setRelatedProducts(related);

}, [product, allProducts]);

const handleToggleSelect = (id, isChecked) => {
  setSelectedIds((prev) =>
    isChecked ? [...prev, id] : prev.filter((item) => item !== id)
  );

};
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState("success");
  const showNotification = (message, type = "success") => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => setNotification(null), 3000);
  };
const handleAddToCartSelected = () => {
  // const items=relatedProducts.filter
  const matched = relatedProducts.filter(product => selectedIds.includes(product.id));
  const quantity=1
matched.map((el)=>{
  addToCart(el,quantity)
})
     showNotification("تم إضافة الباقة للسلة", "success");
};

















  // Transform package data to product format
  const transformPackageData = (packageData) => {
    const displayPrice =
      packageData.calculated_price > 0
        ? packageData.calculated_price
        : packageData.total_price;

    // Get package images from products
    const packageImages =
      packageData.products
        ?.map((product) => product.main_image_url)
        .filter((img) => img && img.trim() !== "") || [];

    const displayImages =
      packageImages.length > 0
        ? packageImages
        : ["/images/default-package.jpg"];

    const savings = packageData.total_price - displayPrice;

    return {
      id: packageData.id,
      name: packageData.name,
      weight: "",
      brand: "لبان الغزال",
      originalPrice: packageData.total_price,
      salePrice: displayPrice,
      discountedPrice: displayPrice,
      discount:
        savings > 0 ? Math.round((savings / packageData.total_price) * 100) : 0,
      rating: 5,
      reviewsCount: 0,
      inStock: true,
      sku: `PKG-${packageData.id}`,
      category: packageData.category?.name || "الباقات",
      categories: [packageData.category?.name || "الباقات"],
      features: ["شحن مجاني للباقات", "ضمان الجودة", "منتجات أصلية 100%"],
      images: displayImages,
      main_image_url: displayImages[0],
      secondary_image_urls: displayImages.slice(1),
      specialOffers: [
        "شحن مجاني للطلبات أكثر من 200 جنيه",
        "ضمان استرداد المال خلال 30 يوم",
        "ضمان مدفوعات آمنة عبر فيزا وماستركارد ومدى وسامسونج باي",
      ],
      description: packageData.description,
      label: { name: "باقة مميزة", color: "#00bd7e" },
      type: "package",
      products: packageData.products, // Keep the products for package display
      packageData: packageData, // Keep original package data
    };
  };

  // دالة مساعدة لتحويل بيانات المنتج
  const transformProductData = (productData) => {


    // إذا كانت البيانات محولة بالفعل (من ProductCard)
    if (productData.discountedPrice && productData.reviewsCount !== undefined) {
      // بناء مصفوفة الصور للحالة الأولى - check multiple possible fields
      const mainImage = productData.main_image_url || productData.image;
      const secondaryImages = Array.isArray(productData.secondary_image_urls)
        ? productData.secondary_image_urls
        : Array.isArray(productData.secondary_images)
        ? productData.secondary_images
        : [];

      const allImages = [mainImage, ...secondaryImages].filter(
        (img) => img && typeof img === "string" && img.trim() !== ""
      );

      // تحويل السعر الأساسي
      const basePrice = parseFloat(
        productData.selling_price || productData.originalPrice || 0
      );

      // تحويل معلومات الخصم
      const hasDiscount =
        productData.discount_details &&
        (productData.discount_details.type === "percentage" ||
          productData.discount_details.type === "fixed") &&
        parseFloat(productData.discount_details.value) > 0;

      const discountDetails = hasDiscount
        ? {
            ...productData.discount_details,
            final_price: parseFloat(
              productData.discount_details.final_price ||
                productData.discountedPrice ||
                basePrice
            ),
            value: parseFloat(productData.discount_details.value || 0),
            type: productData.discount_details.type,
            discount_amount: parseFloat(
              productData.discount_details.discount_amount || 0
            ),
            end_at: productData.discount_details.end_at,
          }
        : null;


      return {
        ...productData,
        selling_price: basePrice,
        discount_details: discountDetails,
        category: productData.category || "غير محدد",
        images: allImages,
        main_image_url: mainImage,
        secondary_image_urls: secondaryImages,
        label: productData.label || null,
        discount_info: productData.discount_info || null,
        specialOffers: [
          "شحن مجاني للطلبات أكثر من 200 جنيه",
          "ضمان استرداد المال خلال 30 يوم",
          "ضمان مدفوعات آمنة عبر فيزا وماستركارد ومدى وسامسونج باي",
        ],
      };
    }

    // بناء مصفوفة الصور بشكل صحيح
    const mainImage = productData.main_image_url || productData.main_image;
    const secondaryImages = Array.isArray(productData.secondary_image_urls)
      ? productData.secondary_image_urls
      : [];

    const allImages = [mainImage, ...secondaryImages].filter(
      (img) => img && typeof img === "string" && img.trim() !== ""
    );

    // تحويل السعر الأساسي
    const basePrice = parseFloat(productData.selling_price || 0);

    // تحويل معلومات الخصم
    const hasDiscount =
      productData.discount_details &&
      (productData.discount_details.type === "percentage" ||
        productData.discount_details.type === "fixed") &&
      parseFloat(productData.discount_details.value) > 0;

    const discountDetails = hasDiscount
      ? {
          ...productData.discount_details,
          final_price: parseFloat(
            productData.discount_details.final_price || basePrice
          ),
          value: parseFloat(productData.discount_details.value || 0),
          type: productData.discount_details.type,
          discount_amount: parseFloat(
            productData.discount_details.discount_amount || 0
          ),
          end_at: productData.discount_details.end_at,
        }
      : null;


    // إذا كانت البيانات من API مباشرة
    return {
      ...productData,
      selling_price: basePrice,
      discount_details: discountDetails,
      images: allImages,
      main_image_url: mainImage,
      secondary_image_urls: secondaryImages,
      reviews_info: productData.reviews_info || {
        total_reviews: 0,
        average_rating: 0,
        rating_distribution: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
        latest_reviews: [],
      },
      stock_info: productData.stock_info || {
        in_stock:
          productData.is_available && productData.total_warehouse_quantity > 0,
        total_quantity: productData.total_warehouse_quantity || 0,
        total_sold: 0,
        total_available: productData.total_warehouse_quantity || 0,
      },
      specialOffers: [
        "شحن مجاني للطلبات أكثر من 200 جنيه",
        "ضمان استرداد المال خلال 30 يوم",
        "ضمان مدفوعات آمنة عبر فيزا وماستركارد ومدى وسامسونج باي",
      ],
    };
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>
              جاري تحميل تفاصيل{" "}
              {product?.type === "package" ? "الباقة" : "المنتج"}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-state">
            <h2>
              خطأ في تحميل {product?.type === "package" ? "الباقة" : "المنتج"}
            </h2>
            <p>{error}</p>
            <button
              onClick={() => window.history.back()}
              className="back-button"
            >
              العودة للخلف
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="not-found-state">
            <h2>
              {product?.type === "package" ? "الباقة" : "المنتج"} غير موجود
            </h2>
            <p>
              {product?.type === "package" ? "الباقة" : "المنتج"} الذي تبحث عنه
              غير متوفر حالياً
            </p>
            <button
              onClick={() => window.history.back()}
              className="back-button"
            >
              العودة للخلف
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPackage = product.type === "package";

  return (
 <div className="product-detail-page">
    {notification && (
          <div
            className={`notification ${
              notificationType === "remove"
                ? "notification-remove"
                : "notification-success"
            }`}
          >
            {notificationType === "success" ? (
              <FaCheck className="notification-icon" />
            ) : (
              <FaTimes className="notification-icon" />
            )}
            <span>{notification}</span>
          </div>
        )}
    <header className="product-details-header">
  <div className="page-header-overlay">
    <div className="page-header-content">
      <h1 className="page-title">{product.name}</h1>
    </div>
  </div>
</header>
  <div className="container">
   
    <div className="product-detail-container">
   
      <ProductGallery
        images={Array.isArray(product.images) ? product.images : []}
        productName={product.name}
        discount={product.discount}
        label={product.label}
      />
      <ProductInfo product={product} />
    </div>
  </div>
  {relatedProducts.length > 0 && (
  <div className="related-products-section container">
    <h2 className="related-title">منتجات من نفس القسم</h2>
    <div className="related-list">
      {relatedProducts.map((item) => (
        <div key={item.id} className="related-card">
          <img
            src={item.main_image_url || "/images/default-product.jpg"}
            alt={item.name}
            style={{ width: "100px", borderRadius: "8px" }}
          />
          <h4>{item.name}</h4>
          <p>{item.selling_price || item.price} ج.م</p>
          <label>
            <input
              type="checkbox"
              checked={selectedIds.includes(item.id)}
              onChange={(e) =>
                handleToggleSelect(item.id, e.target.checked)
              }
            />{" "}
            تحديد
          </label>
        </div>
      ))}
    </div>
    <button
      className="add-selected-btn"
      onClick={handleAddToCartSelected}
      disabled={selectedIds.length === 0}
    >
      إضافة المنتجات المحددة إلى السلة
    </button>
  </div>
)}

  {product.description && (
    <div className="product-description-section">
      <div className="container">
        <h2 className="description-title">
          وصف {isPackage ? "الباقة" : "المنتج"}
        </h2>
        <div className="description-content">
          {/<[^>]*>/g.test(product.description) ? (
            <div
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          ) : (
            <p>{product.description}</p>
          )}
        </div>
      </div>
    </div>
  )}
      
      {/* <CashBack /> */}
      <FooterBanner/>

</div>

  );
};

export default ProductDetail;
