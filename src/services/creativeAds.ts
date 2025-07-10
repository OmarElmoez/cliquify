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

// not deployed
/*
  Changes to be done:
    - endpoint will take ?account_id=act_483489024830589
    - in response there will be a key response holds data => response: []
    - id key will be creative_id in response
    - name key in response will be just name
*/