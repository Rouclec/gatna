/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/coinpayment.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

const API_URL_COINPAYMENT = "/api/admin/coinpayment";

interface Coinpayment {
    _id: string;
    userId: string;
    publicKey?: string;
    privateKey?: string;
    secretKey?: string;
    otp?: string;
  }

// Fetch a single Coinpayment record
export const useGetCoinpayment = () => {
  return useQuery({
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL_COINPAYMENT}`);
      return data.data;
    },
    queryKey: ["coinpayment"],
  });
};


export const useGetCoinpaymentOTP = (
  onSuccess?: (data?: string) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.get(`${API_URL_COINPAYMENT}/get-otp`, {
        withCredentials: true,
      });
      return data.data as string;
    },
    onSuccess,
    onError,
  });
};
// Create Coinpayment record
export const useCreateCoinpayment = (
  onSuccess?: (data?: Coinpayment) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (coinpayment: Omit<Coinpayment, "userId" | "_id">) => {
      const { data } = await axios.post(API_URL_COINPAYMENT, coinpayment);
      return data.data as Coinpayment;
    },
    onSuccess,
    onError,
  });
};

// Update Coinpayment record
export const useUpdateCoinpayment = (
  onSuccess?: (data?: Coinpayment) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (coinpayment: Omit<Coinpayment, "userId" | "_id">) => {
      const { data } = await axios.put(`${API_URL_COINPAYMENT}`, coinpayment);
      return data.data as Coinpayment;
    },
    onSuccess,
    onError,
  });
};

// Delete Coinpayment record
export const useDeleteCoinpayment = (
  onSuccess?: (data?: any) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async () => {
      await axios.delete(`${API_URL_COINPAYMENT}`);
    },
    onSuccess,
    onError,
  });
};
