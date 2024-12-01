/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/socials.ts

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Package } from "./package";

export interface Transaction {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    referalCode: string;
    referredBy?: string;
  };
  package: Package;
  transactionId: string;
  status: string;
  amount: string;
  currency1: string;
  type?: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

const API_URL = "/api/transaction";

// Fetch the user's socials
export const useGetTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data } = await axios.get(API_URL, { withCredentials: true });
      return data.data as Transaction[];
    },
  });
};
