/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "/api/email/contact-us";

// contact us
export const useContactUs = (
  onSuccess?: (data?: string) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (body: {
      name: string;
      surname: string;
      phoneNumber: string;
      message: string;
      email: string;
    }) => {
      const { data } = await axios.post(API_URL, body);
      return data.data;
    },
    onSuccess,
    onError,
  });
};
