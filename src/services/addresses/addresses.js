import api from '../api';
import { ADDRESSES } from '../endpoints';

export const getAddresses = async () => {
  const response = await api.get(ADDRESSES.LIST);
  return response.data;
};

export const createAddress = async (addressData) => {
  const response = await api.post(ADDRESSES.CREATE, addressData);
  return response.data;
};

export const updateAddress = async ({ id, ...addressData }) => {
  const response = await api.put(ADDRESSES.UPDATE(id), addressData);
  return response.data;
};

export const deleteAddress = async (id) => {
  const response = await api.delete(ADDRESSES.DELETE(id));
  return response.data;
}; 