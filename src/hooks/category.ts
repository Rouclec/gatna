/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface Category {
  _id: string;
  name: string;
  tag: string;
  price: number;
  currency?: string;
}

const API_URL = "/api/category";

// Fetch all categories with optional filters
export const useGetCategories = (filter: { name?: string; tag?: string }) => {
  return useQuery({
    queryKey: ["categories", filter],
    queryFn: async () => {
      const { data } = await axios.get(API_URL, { params: filter });
      return data.data as Category[];
    },
  });
};

// Fetch a single category by ID
export const useGetCategory = (id: string) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/${id}`);
      return data.data as Category;
    },
  });
};

// Create a new category
export const useCreateCategory = (
  onSuccess?: (data?: any) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (newCategory: { name: string; tag: string }) => {
      const { data } = await axios.post(API_URL, newCategory);
      return data.data;
    },
    onSuccess,
    onError,
  });
};

// Update an existing category
export const useUpdateCategory = (
  id: string,
  onSuccess?: (data?: any) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (updatedCategory: { name: string; tag: string }) => {
      const { data } = await axios.put(`${API_URL}/${id}`, updatedCategory);
      return data.data;
    },
    onSuccess,
    onError,
  });
};

// Delete a category
export const useDeleteCategory = (
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
