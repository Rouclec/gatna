/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/course.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface Course {
  _id?: string;
  package: {
    _id: string;
    tag: string;
    name: string;
    price: number;
    currency: string;
    previewVideo: {
      _id: string;
      id: string;
      length: number;
      title: string;
      description: string;
      fileType: string;
    };
    parent?: string;
  };
  videos: {
    _id: string;
    id: string;
    length: number;
    title: string;
    description: string;
    fileType: string;
  }[];
  pdfs: {
    _id: string;
    id: string;
    title: string;
    description: string;
    fileType: string;
    length?: number;
  }[];
  duration?: number;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCourseRequest {
  package: string;
  videoID: string | null;
  pdf: string | null;
  title: string;
  description: string;
}

const API_URL = "/api/course";

// Fetch all courses
export const useGetCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data } = await axios.get(API_URL, { withCredentials: true });
      return data.data as Course[];
    },
  });
};

// Get user's courses
export const useGetUserCourses = () => {
  return useQuery({
    queryKey: ["courses", "user"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/user`, {
        withCredentials: true,
      });
      return data.data as Course[];
    },
  });
};

// Fetch a single course by ID
export const useGetCourse = (id: string) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/${id}`, {
        withCredentials: true,
      });
      return data.data as Course;
    },
    enabled: !!id, // Only fetch if ID is provided
  });
};

// Create or Update a course
export const useSaveCourse = (
  onSuccess?: (data?: Course) => void,
  onError?: (error?: any) => void
) => {
  return useMutation({
    mutationFn: async (courseData: CreateCourseRequest) => {
      // If `_id` exists, it's an update; otherwise, it's a creation
      const { data } = await axios.put(API_URL, courseData, {
        withCredentials: true,
      });
      return data.data as Course;
    },
    onSuccess,
    onError,
  });
};
