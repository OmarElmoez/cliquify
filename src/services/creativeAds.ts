import axiosInstance from "@/lib/axios"


export type CreativeAd = {
  creative_id: string;
  name: string;
  // there are more fields, but we just get what we need
};

export type TGetCreativeAdsResponse = {
  response: CreativeAd[]
}

const getCreativeAds = async ({account_id}: {account_id: string}): Promise<TGetCreativeAdsResponse> => {
  try {
    const res = await axiosInstance.get<TGetCreativeAdsResponse>(`/adcreative/list/?account_id=${account_id}`);
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