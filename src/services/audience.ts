import axiosInstance from "@/lib/axios";

export type Audience = {
  id: string;
  name: string;
  rule: string;
};

const getAudiences = async (paginationUrl?: string): Promise<Audience[]> => {
  // const url = paginationUrl ? `${paginationUrl}` : '/custom-audiences/';
  const url = '/custom-audiences/';
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching audiences:', error);
    throw error;
  }
};

export default getAudiences;