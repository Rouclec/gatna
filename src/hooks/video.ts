/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/role.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface PlaybackInfo {
  otp: string;
  playbackInfo: string;
}

const API_URL = "/api/video";

// Fetch roles
export const useGetVideoPlaybackInfo = (videoID: string) => {
  return useQuery({
    queryKey: ["videos", videoID, "playbackInfo"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API_URL}/${videoID}/get-playback-info`
      );
      return data.data as PlaybackInfo;
    },
    enabled: !!videoID,
  });
};
