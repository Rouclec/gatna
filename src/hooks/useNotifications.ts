/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/socials.ts

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Notification {
  _id: string;
  title: string;
  body: string;
  read: boolean;
}

const API_URL = "/api/notifications";

// Fetch the user's socials
export const useGetNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await axios.get(API_URL, { withCredentials: true });
      return data.data as Notification[];
    },
  });
};

export const useMarkNotificationsRead = () => {
  return useMutation({
    mutationFn: async (body: { ids: string[] }) => {
      const { data } = await axios.post(`${API_URL}/mark-read`, body);
      return data.message as string;
    },
  });
};
