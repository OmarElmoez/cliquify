import axiosInstance from "@/lib/axios";

export type Adset = {
  id: string;
  name: string;
  // there are more fields, but we don't need them for now
}

type AdsetsResponse = {
  response: Adset[];
}

const getAdsets = async ({campaign_id}: {campaign_id: string}): Promise<AdsetsResponse> => {
  try {
    const res = await axiosInstance.get<AdsetsResponse>(`/adsets/?campaign_id=${campaign_id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching adsets:', error);
    throw error;
  }
};

export default getAdsets;