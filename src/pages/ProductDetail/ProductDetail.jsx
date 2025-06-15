import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductGallery from '../../components/ProductDetail/ProductGallery/ProductGallery';
import ProductInfo from '../../components/ProductDetail/ProductInfo/ProductInfo';
import ProductDescription from '../../components/ProductDescription/ProductDescription';
import CashBack from '../../components/CashBack/CashBack';
import FrequentlyBought from '../../components/FrequentlyBought/FrequentlyBought';
import RelatedProducts from '../../components/RelatedProducts/RelatedProducts';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  
  // بيانات المنتج (يمكن استقبالها من API أو props)
  // في المستقبل يمكن استخدام id لجلب بيانات المنتج من API
  const productData = {
    id: 1,
    name: 'لابتوب Asus Vivobook I5 1355U، 8GB رام، 512GB SSD',
    brand: 'Asus',
    originalPrice: 1536,
    salePrice: 999,
    discount: 35,
    rating: 4.5,
    reviewsCount: 2,
    inStock: true,
    sku: '69TFECSCSM',
    categories: ['لابتوب', 'ماك بوك', 'MSI'],
    features: [
      'حجم الشاشة 15.6"',
      'معالج Intel Core i3',
      'ذاكرة الوصول العشوائي 8 جيجا'
    ],
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=400&fit=crop'
    ],
    specialOffers: [
      '10% خصم، بحد أقصى 20 دولار عند الدفع بـ PAYPAL',
      '50% خصم أو أكثر على أغطية iPad، الأغطية ومجلدات لوحة المفاتيح'
    ]
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail-container">
          <ProductGallery 
            images={productData.images}
            productName={productData.name}
            discount={productData.discount}
          />
          <ProductInfo 
            product={productData}
          />
        </div>
      </div>
      
      <ProductDescription product={productData} />
      <CashBack />
      <FrequentlyBought />
      <RelatedProducts currentProduct={productData} />
    </div>
  );
};

export default ProductDetail; 