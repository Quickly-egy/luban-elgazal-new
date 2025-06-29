import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPI } from '../services/endpoints';
import { useEffect } from 'react';
import useProductsStore from '../stores/productsStore';
import React from 'react';

export const useProducts = () => {
  const store = useProductsStore();

  return {
    products: store.allProducts,
    filteredProducts: store.filteredProducts,
    packages: store.packages,
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
    getPackageById: store.getPackageById,
    getActivePackages: store.getActivePackages,
    getPackagesByCategory: store.getPackagesByCategory,
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
  const { searchProducts, isSearching, setFilters, filters } = useProducts();
  const [debouncedTerm, setDebouncedTerm] = React.useState(searchTerm);
  
  // Handle the debounced search term
  React.useEffect(() => {
    if (searchTerm === undefined) return;
    
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [searchTerm, delay]);
  
  // Perform the actual search
  React.useEffect(() => {
    if (debouncedTerm === undefined) return;
    
    // Update filters with new search term
    setFilters({
      ...filters,
      searchTerm: debouncedTerm
    });
  }, [debouncedTerm]);
  
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