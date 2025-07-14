import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAddresses, createAddress, updateAddress, deleteAddress } from '../services/addresses/addresses';

export const useAddresses = () => {
  const queryClient = useQueryClient();

  // Fetch addresses
  const { data: addresses = [], isLoading, error } = useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses,
  }
  
  );

  // Create address
  const createAddressMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  // Update address
  const updateAddressMutation = useMutation({
    mutationFn: updateAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  // Delete address
  const deleteAddressMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  // Get default address
  const defaultAddress = addresses?.data?.find(address => address.is_default) || null;

  return {
    addresses: addresses?.data || [],
    defaultAddress,
    isLoading,
    error,
    createAddress: createAddressMutation.mutate,
    updateAddress: updateAddressMutation.mutate,
    deleteAddress: deleteAddressMutation.mutate,
    isCreating: createAddressMutation.isPending,
    isUpdating: updateAddressMutation.isPending,
    isDeleting: deleteAddressMutation.isPending,
  };
};

// Add default export
export default useAddresses; 