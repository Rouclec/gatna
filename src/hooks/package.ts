/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface Package {
  _id: string;
  name: string;
  tag: string;
  price: number;
  parent?: string;
  currency?: string;
  previewVideo: {
    id: string;
    length: number;
    title: string;
    description: string;
    fileType: string;
  };
  totalVideos?: number;
  totalPDFs?: number;
  totalDuration?: number;
}

const API_URL = "/api/package";

// Fetch all packages with optional filters
export const useGetPackages = (filter: { name?: string; tag?: string }) => {
  return useQuery({
    queryKey: ["packages", filter],
    queryFn: async () => {
      const { data } = await axios.get(API_URL, { params: filter });
      return data.data as Package[];
    },
  });
};

// Fetch a single package by ID
export const useGetPackage = (id: string) => {
  return useQuery({
    queryKey: ["package", id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/${id}`);
      return data.data as Package;
    },
  });
};

// Fetch a single package by ID
export const useGetUserPackage = () => {
  return useQuery({
    queryKey: ["package", "user"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/user`, {
        withCredentials: true,
      });
      return data.data;
    },
  });
};

// Create a new package
export const useCreatePacakge = (
  onSuccess?: (data?: Package) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (newPackage: Package) => {
      const { data } = await axios.post(API_URL, newPackage);
      return data.data as Package;
    },
    onSuccess,
    onError,
  });
};

// Update an existing category
export const useUpdatePackage = (
  id: string,
  onSuccess?: (data?: Package) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (updatedPackage: Package) => {
      const { data } = await axios.put(`${API_URL}/${id}`, updatedPackage);
      return data.data as Package;
    },
    onSuccess,
    onError,
  });
};

// Delete a category
export const useDeletePackage = (
  onSuccess?: (data?: any) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_URL}/${id}`);
    },
    onSuccess,
    onError,
  });
};
