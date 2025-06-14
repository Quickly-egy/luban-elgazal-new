import React from 'react';
import ProductCard from '../../components/ui/ProductCard/ProductCard';
import Loading from '../../components/ui/Loading/Loading';
import { useProducts } from '../../hooks/useProducts';
import './Products.css';

const Products = () => {
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) return <Loading />;
  if (error) return <div className="error">خطأ: {error.message}</div>;

  return (
    <div className="products">
      <div className="container">
        <h1>منتجاتنا</h1>
        <div className="products-grid">
          {products && products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p>لا توجد منتجات متاحة حالياً</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products; 