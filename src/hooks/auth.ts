/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useUpdatePassword.ts
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// Define the shape of the request payload for updating password
interface UpdatePasswordPayload {
  oldPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  otp?: string;
}

interface UpdatePinPayload {
  pinCode?: string;
  repeatPinCode?: string;
  otp?: string;
}

const API_URL = "/api/auth";

export const useGetUserOTP = (
  onSuccess?: (data?: string) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.get(`${API_URL}/get-otp`, {
        withCredentials: true,
      });
      return data.data as string;
    },
    onSuccess,
    onError,
  });
};

// Hook for updating the user's password
export const useUpdatePassword = (
  onSuccess?: (data?: { message: string }) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (payload: UpdatePasswordPayload) => {
      const { data } = await axios.post(`${API_URL}/update-password`, payload, {
        withCredentials: true,
      });
      return data.data as { message: string };
    },
    onSuccess,
    onError,
  });
};

// Hook for updating the user's pin
export const useUpdateWithdrawalPin = (
  onSuccess?: (data?: { message: string }) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (payload: UpdatePinPayload) => {
      const { data } = await axios.post(
        `${API_URL}/update-withdrawal-pin`,
        payload,
        {
          withCredentials: true,
        }
      );
      return data.data as { message: string };
    },
    onSuccess,
    onError,
  });
};

export const useGetForgotPasswordOTP = (
  onSuccess?: (data?: string) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await axios.get(`${API_URL}/forgot-password/${email}`);
      return data.data as string;
    },
    onSuccess,
    onError,
  });
};

export const useForgotPassword = (
  onSuccess?: (data?: string) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (body: { email: string; otp: string }) => {
      const { data } = await axios.post(`${API_URL}/forgot-password`, body);
      return data.data as string;
    },
    onSuccess,
    onError,
  });
};
