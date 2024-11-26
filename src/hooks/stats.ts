/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/socials.ts

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Stats {
  users: number;
  subscribers: number;
  videos: number;
  pendingRequests: number;
  sales: number;
}

const API_URL = "/api/admin/stats";

// Fetch the user's socials
export const useGetStats = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const { data } = await axios.get(API_URL, { withCredentials: true });
      return data.data as Stats;
    },
  });
};
