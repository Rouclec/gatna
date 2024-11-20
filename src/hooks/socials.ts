/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/socials.ts

import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

interface Socials {
  _id: string;
  userId: string;
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  tiktok?: string;
  otp?: string;
  countryCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

const API_URL = "/api/admin/socials";

// Fetch the user's socials
export const useGetUserSocials = () => {
  return useQuery({
    queryKey: ["socials"],
    queryFn: async () => {
      const { data } = await axios.get(API_URL, { withCredentials: true });
      return data.data as Socials;
    },
  });
};

export const useGetPublicSocials = () => {
  return useQuery({
    queryKey: ["socials", "public"],
    queryFn: async () => {
      const { data } = await axios.get("/api/get-public-socials", {
        withCredentials: true,
      });
      return data.data as Socials;
    },
  });
};

// Create a new socials entry
export const useCreateSocials = (
  onSuccess?: (data?: Socials) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (newSocials: Omit<Socials, "_id" | "userId">) => {
      const { data } = await axios.post(API_URL, newSocials, {
        withCredentials: true,
      });
      return data.data;
    },
    onSuccess,
    onError,
  });
};

// Update an existing socials entry
export const useUpdateSocials = (
  onSuccess?: (data?: Socials) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (updatedSocials: Partial<Socials>) => {
      const { data } = await axios.put(API_URL, updatedSocials, {
        withCredentials: true,
      });
      return data.data;
    },
    onSuccess,
    onError,
  });
};
