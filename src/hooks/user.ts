/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  walletBalance: number;
  referalCode: string;
  referralLink: string;
  referredBy?: string;
  walletId?: string;
  profilePic?: string;
  createdAt: string;
  updatedAt: string;
}

const API_URL = "/api/user";

// Fetch the user's socials
export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await axios.get(API_URL, { withCredentials: true });
      return data.data as User;
    },
  });
};

export const useUpdateMe = (
  onSuccess?: (data?: User) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (
      body: Omit<
        User,
        | "_id"
        | "email"
        | "createdAt"
        | "updatedAt"
        | "walletBalance"
        | "referalCode"
        | "referralLink"
        | "referredBy"
      >
    ) => {
      const { data } = await axios.put(API_URL, body);
      return data.data as User;
    },
    onSuccess,
    onError,
  });
};

export const useUpdateUser = (
  onSuccess?: (data?: User) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (
      body: Omit<
        User,
        | "createdAt"
        | "updatedAt"
        | "walletBalance"
        | "referalCode"
        | "referralLink"
        | "referredBy"
        | "phoneNumber"
        | "countryCode"
        | "walletId"
      >
    ) => {
      const { data } = await axios.put("/api/admin/user", body);
      return data.data as User;
    },
    onSuccess,
    onError,
  });
};
