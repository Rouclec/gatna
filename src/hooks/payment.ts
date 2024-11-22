/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// Define API URL for initiating payment
const API_URL = "/api/payment/initiate";

export interface PaymentResponse {
  amount: string;
  txn_id: string;
  address: string;
  confirms_needed: string;
  timeout: number;
  checkout_url: string;
  status_url: string;
  qrcode_url: string;
}
// Initiate payment
export const useInitiatePayment = (
  onSuccess?: (data?: PaymentResponse) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (body: { userId: string; packageId: string }) => {
      const { data } = await axios.post(API_URL, body);
      return data.data as PaymentResponse; // You can adjust the response structure as needed
    },
    onSuccess,
    onError,
  });
};
