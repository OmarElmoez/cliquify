
import axiosInstance from '@/lib/axios';

export type Campaign = {
  campaign_id: string;
  name: string;
  status: string;
  buying_type: string;
  objective: string;
  created_time: string;
}

export type CampaignsResponse = {
  results: Campaign[];
  count: number;
  next: string | null;
  previous: string | null;
}

type CampaignsProps = {
  account_id: string;
  page?: number;
}

export type CampaignStatus = "ACTIVE" | "PAUSED" | 'ARCHIVED'

export interface StatusUpdateResponse {
  message: string;
  new_status: {
    success: boolean;
  };
}

export const getCampaigns = async ({account_id, page = 1}: CampaignsProps): Promise<CampaignsResponse> => {
  let url = `/campaigns/list/?account_id=${account_id}`;

  if (page) {
    url += `&page=${page}`;
  }

  try {
    const response = await axiosInstance.get<CampaignsResponse>(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};

export const updateCampaignStatus = async (
  campaignId: string,
  status: CampaignStatus,
): Promise<StatusUpdateResponse> => {
  try {
    // Changed to use URL parameters instead of request body
    const response = await axiosInstance.post(`/campaigns/status/?campaign_id=${campaignId}&status=${status}`);
    return response.data;
  } catch (error) {
    console.error('Error updating campaign status:', error);
    throw error;
  }
};
