/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/socials.ts

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Withdrawal {
  _id?: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    referalCode: string;
    referredBy?: string;
  };
  walletId: string;
  status: string;
  amount: string;
  currency: string;
  type?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateWithdrawalRequest {
  id: string;
  status: string;
}

const API_URL = "/api/withdrawal";

// Fetch the user's socials
export const useGetUserWithdrawals = () => {
  return useQuery({
    queryKey: ["withdrawals/user"],
    queryFn: async () => {
      const { data } = await axios.get(API_URL, { withCredentials: true });
      return data.data as Withdrawal[];
    },
  });
};

export const useGetAdminWithdrawals = () => {
  return useQuery({
    queryKey: ["withdrawals"],
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/withdrawal", {
        withCredentials: true,
      });
      return data.data as Withdrawal[];
    },
  });
};

export const useUpdateWithdrawal = (
  onSuccess?: (data?: Withdrawal) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (body: UpdateWithdrawalRequest) => {
      const { data } = await axios.put("/api/admin/withdrawal", body);
      return data.data as Withdrawal;
    },
    onSuccess,
    onError,
  });
};
