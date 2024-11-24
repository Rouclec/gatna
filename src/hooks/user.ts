import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface User {
  _id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  walletBalance?: string;
  referalCode?: string;
  createdAt?: string;
  updatedAt?: string;
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
