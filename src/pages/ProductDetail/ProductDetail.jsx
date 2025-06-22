import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import ProductGallery from "../../components/ProductDetail/ProductGallery/ProductGallery";
import ProductInfo from "../../components/ProductDetail/ProductInfo/ProductInfo";
import ProductDescription from "../../components/ProductDescription/ProductDescription";
import CashBack from "../../components/CashBack/CashBack";
import FrequentlyBought from "../../components/FrequentlyBought/FrequentlyBought";
import RelatedProducts from "../../components/RelatedProducts/RelatedProducts";
import { productAPI } from "../../services/endpoints";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        // أولاً: تحقق من وجود بيانات المنتج في state
        const productFromState = location.state?.product;

        if (productFromState && productFromState.id === parseInt(id)) {
          // إذا كانت البيانات موجودة ومطابقة للـ ID، استخدمها مباشرة
          const transformedProduct = transformProductData(productFromState);
          setProduct(transformedProduct);
          setLoading(false);
          return;
        }

        // إذا لم تكن البيانات موجودة، اجلبها من API
        setLoading(true);
        setError(null);

        const response = await productAPI.getProductsWithReviews();

        if (response.success && response.data) {
          const foundProduct = response.data.find((p) => p.id === parseInt(id));

          if (foundProduct) {
            const transformedProduct = transformProductData(foundProduct);
            setProduct(transformedProduct);
          } else {
            setError("المنتج غير موجود");
          }
        } else {
          setError("فشل في تحميل بيانات المنتج");
        }
      } catch (error) {
        console.error("Error loading product:", error);
        setError("حدث خطأ في تحميل المنتج");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id, location.state]);

  // دالة مساعدة لتحويل بيانات المنتج
  const transformProductData = (productData) => {
    // إذا كانت البيانات محولة بالفعل (من ProductCard)
    if (productData.discountedPrice && productData.reviewsCount !== undefined) {
      // بناء مصفوفة الصور للحالة الأولى
      const mainImage = productData.main_image_url || productData.image;
      const secondaryImages = Array.isArray(productData.secondary_image_urls) 
        ? productData.secondary_image_urls 
        : [];
      
      const allImages = [mainImage, ...secondaryImages].filter(img => 
        img && typeof img === 'string' && img.trim() !== ''
      );

      console.log('Transform Debug (ProductCard):', {
        productName: productData.name,
        original_secondary_image_urls: productData.secondary_image_urls,
        mainImage,
        secondaryImages,
        allImages,
        count: allImages.length,
        isSecondaryArray: Array.isArray(productData.secondary_image_urls)
      });

      return {
        ...productData,
        salePrice: productData.discountedPrice,
        category: productData.category || "غير محدد",
        images: allImages,
        label: productData.label || null,
        discount_info: productData.discount_info || null,
      };
    }

    // بناء مصفوفة الصور بشكل صحيح
    const mainImage = productData.main_image_url || productData.main_image;
    const secondaryImages = Array.isArray(productData.secondary_image_urls) 
      ? productData.secondary_image_urls 
      : [];
    
    const allImages = [mainImage, ...secondaryImages].filter(img => 
      img && typeof img === 'string' && img.trim() !== ''
    );
    
    console.log('Transform Debug:', {
      productName: productData.name,
      original_secondary_image_urls: productData.secondary_image_urls,
      mainImage,
      secondaryImages,
      allImages,
      count: allImages.length,
      isSecondaryArray: Array.isArray(productData.secondary_image_urls)
    });



    // إذا كانت البيانات من API مباشرة
    return {
      id: productData.id,
      name: productData.name,
      weight: productData.weight,
      brand: "لبان الغزال",
      originalPrice: productData.purchase_cost
        ? parseFloat(productData.purchase_cost)
        : parseFloat(productData.selling_price) * 1.2,
      salePrice: parseFloat(productData.selling_price),
      discount: productData.profit_margin
        ? parseFloat(productData.profit_margin)
        : Math.round(
            ((parseFloat(productData.selling_price) * 1.2 -
              parseFloat(productData.selling_price)) /
              (parseFloat(productData.selling_price) * 1.2)) *
              100
          ),
      rating: productData.reviews_info?.average_rating || 0,
      reviewsCount: productData.reviews_info?.total_reviews || 0,
      inStock:
        productData.is_available !== undefined
          ? productData.is_available
          : productData.stock_info?.in_stock || false,
      sku: productData.sku,
      category: productData.category?.name || "غير محدد",
      categories: [productData.category?.name || "غير محدد"],
      features: ["منتج أصلي 100%", "جودة عالية مضمونة", "مناسب لجميع الأعمار"],
      images: allImages,
      specialOffers: [
        "شحن مجاني للطلبات أكثر من 500 جنيه",
        "ضمان استرداد المال خلال 30 يوم",
      ],
      description: productData.description,
      label: productData.label || null,
      stock_info: productData.stock_info,
      reviews_info: productData.reviews_info,
      formatted_price: productData.formatted_price,
      warehouse_info: productData.warehouse_info,
      tax: productData.tax,
      discount_info: productData.discount_info || null,
    };
  };



  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>جاري تحميل تفاصيل المنتج...</p>
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
            <h2>خطأ في تحميل المنتج</h2>
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
            <h2>المنتج غير موجود</h2>
            <p>المنتج الذي تبحث عنه غير متوفر حالياً</p>
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

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail-container">
          <ProductGallery
            images={(() => {
              console.log('Passing to ProductGallery:', product.images);
              return product.images || [];
            })()}
            productName={product.name}
            discount={product.discount}
            label={product.label}
          />
          <ProductInfo product={product} />
        </div>
      </div>

      <ProductDescription product={product} />
      <CashBack />
      <FrequentlyBought />
      <RelatedProducts currentProduct={product} />
    </div>
  );
};

export default ProductDetail;
