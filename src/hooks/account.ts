/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/account.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

interface Account {
  _id: string;
  userId: string;
  companyName?: string;
  minimumWithdrawalAmount?: number;
  email?: string;
  walletId?: string;
  telephone?: string;
  countryCode?: string;
  otp?: string;
  createdAt?: string;
  updatedAt?: string;
}

const API_URL = "/api/admin/account";

// Fetch the logged in user's account
export const useGetUserAccount = (filter?: { userId?: string }) => {
  return useQuery({
    queryKey: ["accounts", filter],
    queryFn: async () => {
      const { data } = await axios.get(API_URL, {
        params: filter,
        withCredentials: true,
      });
      return data.data as Account;
    },
  });
};

// Create a new account
export const useCreateAccount = (
  onSuccess?: (data?: Account) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (newAccount: Omit<Account, "_id" | "userId">) => {
      const { data } = await axios.post(API_URL, newAccount, {
        withCredentials: true,
      });
      return data.data;
    },
    onSuccess: onSuccess,
    onError,
  });
};

// Update an existing account
export const useUpdateAccount = (
  onSuccess?: (data?: any) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (updatedAccount: Partial<Account>) => {
      const { data } = await axios.put(`${API_URL}`, updatedAccount, {
        withCredentials: true,
      });
      return data.data;
    },
    onSuccess,
    onError,
  });
};
