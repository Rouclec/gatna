/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Course } from "./course";

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

interface AssignUserCourseRequest {
  email: string;
  packageId: string;
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
      const { data } = await axios.put(API_URL, body, {
        withCredentials: true,
      });
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
        | "walletId"
      >
    ) => {
      const { data } = await axios.put("/api/admin/user", body, {
        withCredentials: true,
      });
      return data.data as User;
    },
    onSuccess,
    onError,
  });
};

export const useAssignCourseToUser = (
  onSuccess?: (data: Course) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (body: AssignUserCourseRequest) => {
      const { data } = await axios.post("/api/admin/user", body, {
        withCredentials: true,
      });
      return data.data as Course;
    },
    onSuccess,
    onError,
  });
};

export const useDeleteUser = (
  onSuccess?: (data?: string) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/admin/user/${id}`, {
        withCredentials: true,
      });
      return data.data as string;
    },
    onSuccess,
    onError,
  });
};
