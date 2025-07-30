import axiosInstance from "@/lib/axios";
import { AudienceData } from "@/schemas/audience";

export type Audience = {
  id: string;
  name: string;
  rule: string;
};

export const getAudiences = async ({account_id}: {account_id: string}): Promise<Audience[]> => {
  // const url = paginationUrl ? `${paginationUrl}` : '/custom-audiences/';
  const url = `/custom-audiences/?account_id=${account_id}`;
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching audiences:', error);
    throw error;
  }
};

export const createAudience = async (data: AudienceData) => {
  try {
    const res = await axiosInstance.post('/custom-audiences/create/', data)
    return res.data
  } catch (error) {
    console.error('faild to create audience, ', error) 
  }
}
