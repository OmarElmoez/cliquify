import axiosInstance from "@/lib/axios"

export type TAd = {
  id: number;
  ad_id: string;
  name: string;
  status: string;
  adset: number;
  creative: number;
  impressions: number;
  clicks: number;
  spend: string;
  created_time: string | null;
  updated_time: string | null;
  last_synced: string | null;
};


export type TAdsResponse = {
  count: number,
  next: string | null,
  previous: string | null,
  results: TAd[]
}

const getAds = async ({id, getFor, page = 1}: {id: string, getFor: 'adset' | 'account', page?: number}): Promise<TAdsResponse> => {
  let url = '/ads/list/'

  if (getFor === 'adset') {
    url += `?adset_id=${id}`
  } else {
    url += `?account_id=${id}`
  }

  if (page) {
    url += `&page=${page}`
  }

  try {
    const res = await axiosInstance.get<TAdsResponse>(url);
    return res.data
  } catch (error) {
    console.error('failed to load ads: ', error)
  }

}

export default getAds;