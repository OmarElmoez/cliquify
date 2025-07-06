import axiosInstance from "@/lib/axios"


export type CreativeAd = {
  id: string;
  name: string;
  object_story_spec: {
    page_id: string;
    link_data: {
      link: string;
      message: string;
      name: string;
    };
  };
};


type getAdsResponse = {
  response: CreativeAd[];
}

const getCreativeAds = async ({account_id}: {account_id: string}): Promise<getAdsResponse> => {
  try {
    const res = await axiosInstance.get<getAdsResponse>(`/creatives/list/?account_id=${account_id}`);
    return res.data;
  } catch (error) {
    throw error('faild to fetch createive ads: ', error)
  }
}

export default getCreativeAds;