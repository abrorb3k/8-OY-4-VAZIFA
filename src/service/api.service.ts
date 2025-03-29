import axios from "axios";
import { VideoType } from "../types";

const BASE_URL = `https://youtube-v2.p.rapidapi.com`;

axios.interceptors.request.use((config) => {
  config.baseURL = BASE_URL;
  config.headers.set("x-rapidapi-key", import.meta.env.VITE_XRAPIDAPIKEY);
  config.headers.set("x-rapidapi-host", import.meta.env.VITE_XRAPIDAPIHOST);
  return config;
});

export const YTService = {
  getVideoDetails: async (id: string): Promise<VideoType> => {
    const { data } = await axios.get(`/video/details?video_id=${id}`);
    console.log(data);
    
    return data;
  },

  getVideoComments: async (
    id: string
  ): Promise<{ author: string; text: string }[]> => {
    try {
      const { data } = await axios.get(`/video/comments?video_id=${id}`);
      return data.data.map((comment: any) => ({
        author: comment.author,
        text: comment.text,
      }));
    } catch (error) {
      console.error("Izohlarni olishda xatolik:", error);
      return [];
    }
  },
};
