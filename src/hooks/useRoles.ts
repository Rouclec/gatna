/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/role.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

interface Role {
  _id: string;
  name: string;
  code: string;
}

const API_URL = "/api/roles";

// Fetch roles
export const useGetRoles = (filter: { code?: string; name?: string }) => {
  return useQuery({
    queryKey: ["roles", filter],
    queryFn: async () => {
      const { data } = await axios.get(API_URL, { params: filter });
      return data.data as Role[];
    },
  });
};

// Fetch a single role
export const useGetRole = (id: string) => {
  return useQuery({
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/${id}`);
      return data.data as Role;
    },
    queryKey: ["role", id],
  });
};

// Create role
export const useCreateRole = (
  onSuccess?: (data?: any) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (newRole: { name: string }) => {
      const { data } = await axios.post(API_URL, newRole);
      return data.data;
    },
    onSuccess,
    onError,
  });
};

// // Update role
// export const useUpdateRole = (id: string) => {
//   const queryClient = useQueryClient();

//   return useMutation(
//     async (updatedRole: { name: string }) => {
//       const { data } = await axios.put(`${API_URL}/${id}`, updatedRole);
//       return data.data;
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(["roles"]);
//         queryClient.invalidateQueries(["role", id]);
//       },
//     }
//   );
// };

// Delete role
export const useDeleteRole = (
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
