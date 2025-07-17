import axiosInstance from "@/lib/axios";

export type Adset = {
  id: number,
  adset_id: string;
  name: string;
  status: string;
  start_time: string;
  end_time: string;
  optimization_goal: string;
  billing_event: string;
  bid_amount: number;
  bid_strategy: string | null;
  daily_budget: string | null;
  lifetime_budget: string | null;
  targeting: Record<string, any>;
  campaign: number;
  created_time: string | null;
  updated_time: string | null;
  // there are more fields, but we don't need them for now
}

export type paginatedAdsetsResponse = {
  count: number,
  next: string | null,
  previous: string | null,
  results: Adset[];
}

export const getPaginatedAdsets = async ({id, getFor, page}: {id: string, getFor: 'account' | 'campaign', page: number}): Promise<paginatedAdsetsResponse> => {
  let url = "/adsets/"
  
  if (getFor === 'campaign') {
    url += `?campaign_id=${id}`
  } else {
    url += `?account_id=${id}`
  }

  if (page) {
    url += `&page=${page}`
  }

  try {
    const res = await axiosInstance.get<paginatedAdsetsResponse>(url);
    return res.data;
  } catch (error) {
    console.error('Error fetching adsets:', error);
    throw error;
  }
};

type AdsetsResponse = {
  response: Adset[];
}

export const getAdsets = async ({campaign_id}: {campaign_id: string}): Promise<AdsetsResponse> => {
  try {
    const res = await axiosInstance.get<AdsetsResponse>(`/adsets/list/?campaign_id=${campaign_id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching adsets:', error);
    throw error;
  }
};
