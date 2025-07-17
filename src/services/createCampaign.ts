import axiosInstance from "@/lib/axios";
import { CampaignData } from "@/schemas/campaignSchema";

type CreateCampaignResponse = {
  campaign_id: string;
  adset_id: string;
  creative_id: string;
  ad_id: string;
}

const createCampaign = async (campaign: CampaignData): Promise<CreateCampaignResponse> => {
  try {
    const response = await axiosInstance.post<CreateCampaignResponse>('/ad/create/', {
      data: campaign
    });
    return response.data;
  } catch (error) {
    return error.response.data.error
  }
};

export default createCampaign;