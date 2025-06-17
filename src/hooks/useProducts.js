import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPI } from '../services/endpoints';
import { useEffect } from 'react';
import useProductsStore from '../stores/productsStore';

export const useProducts = () => {
  const store = useProductsStore();

  return {
    products: store.allProducts,
    filteredProducts: store.filteredProducts,
    categories: store.categories,
    filters: store.filters,
    
    loading: store.loading,
    error: store.error,
    isSearching: store.isSearching,
    isInitialLoad: store.isInitialLoad,
    
    loadProducts: store.loadProducts,
    searchProducts: store.searchProducts,
    setFilters: store.setFilters,
    resetFilters: store.resetFilters,
    clearError: store.clearError,
    getStats: store.getProductStats,
    applyCurrentFilters: store.applyCurrentFilters,
  };
};

export const useProductsWithAutoLoad = () => {
  const products = useProducts();
  
  useEffect(() => {
    if (products.products.length === 0 && !products.loading && !products.error) {
      products.loadProducts();
    }
  }, []);
  
  return products;
};

export const useProductSearch = (searchTerm, delay = 200) => {
  const { searchProducts, isSearching } = useProducts();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) {
        searchProducts(searchTerm);
      }
    }, delay);
    
    return () => clearTimeout(timer);
  }, [searchTerm, searchProducts, delay]);
  
  return { isSearching };
};

export const useProduct = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getProductById(id),
    enabled: !!id,
  });
};

export const useProductCategories = () => {
  return useQuery({
    queryKey: ['product-categories'],
    queryFn: () => productAPI.getCategories(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productAPI.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => productAPI.updateProduct(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productAPI.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}; 

export default useProducts; 