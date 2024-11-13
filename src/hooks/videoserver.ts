/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/videoserver.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

const API_URL_VIDEOSERVER = "/api/admin/videoserver";

interface VideoServer {
  _id: string;
  userId: string;
  publicKey?: string;
  privateKey?: string;
  secretKey?: string;
  otp?: string;
}

// Fetch a single VideoServer record
export const useGetVideoServer = () => {
  return useQuery({
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL_VIDEOSERVER}`);
      return data.data as VideoServer;
    },
    queryKey: ["videoserver"],
  });
};

// Create VideoServer record
export const useCreateVideoServer = (
  onSuccess?: (data?: VideoServer) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (
      videoServer: Omit<VideoServer, "userId" | "_id">
    ) => {
      const { data } = await axios.post(API_URL_VIDEOSERVER, videoServer);
      return data.data as VideoServer;
    },
    onSuccess,
    onError,
  });
};

// Update VideoServer record
export const useUpdateVideoServer = (
  onSuccess?: (data?: VideoServer) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (
      videoServer: Omit<VideoServer, "userId" | "_id">
    ) => {
      const { data } = await axios.put(`${API_URL_VIDEOSERVER}`, videoServer);
      return data.data as VideoServer;
    },
    onSuccess,
    onError,
  });
};

// Delete VideoServer record
export const useDeleteVideoServer = (
  onSuccess?: (data?: any) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async () => {
      await axios.delete(`${API_URL_VIDEOSERVER}`);
    },
    onSuccess,
    onError,
  });
};
