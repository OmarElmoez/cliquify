import axiosInstance from "@/lib/axios"


export type CreativeAd = {
  creative__creative_id: string;
  creative__name: string;
  // there are more fields, but we just get what we need
};

const getCreativeAds = async (): Promise<CreativeAd[]> => {
  try {
    const res = await axiosInstance.get<CreativeAd[]>(`/adcreative/list/`);
    return res.data;
  } catch (error) {
    throw error('faild to fetch createive ads: ', error)
  }
}

export default getCreativeAds;