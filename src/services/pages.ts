import axiosInstance from "@/lib/axios";

export type Page = {
  id: string;
  name: string;
  // there are more fields, but we don't need them for now
}

type PagesResponse = {
  pages: Page[];
}

export const getPages = async (): Promise<PagesResponse> => {
  try {
    const response = await axiosInstance.get<PagesResponse>(`/pages/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pages:', error);
    throw error;
  }
};