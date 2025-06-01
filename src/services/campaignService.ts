
import axiosInstance from '@/lib/axios';

export interface Campaign {
  id: string;
  name: string;
  status: string;
  buying_type: string;
  created_time: string;
  objective: string;
}

export interface CampaignsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Campaign[];
}

export interface StatusUpdateResponse {
  message: string;
  data: {
    success: boolean;
  };
}

export const fetchCampaigns = async (
  accountId: string, 
  externalId: string = "1", 
  page: number = 1
): Promise<CampaignsResponse> => {
  try {
    const response = await axiosInstance.get(`/meta/data/campaign/list/?account_id=${accountId}&external_id=${externalId}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};

export const updateCampaignStatus = async (
  campaignId: string,
  status: "ACTIVE" | "PAUSED",
  externalId: string = "1"
): Promise<StatusUpdateResponse> => {
  try {
    // Changed to use URL parameters instead of request body
    const response = await axiosInstance.post(`/meta/data/campaign/status-update/?campaign_id=${campaignId}&external_id=${externalId}&status=${status}`);
    return response.data;
  } catch (error) {
    console.error('Error updating campaign status:', error);
    throw error;
  }
};
