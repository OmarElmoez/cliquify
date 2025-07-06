import axiosInstance from "@/lib/axios";
import { CampaignData } from "@/schemas/campaignSchema";

const createCampaign = async (campaign: CampaignData) => {
  try {
    const response = await axiosInstance.post('/ad/create/', {
      data: campaign
    });
    return response.data;
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
};

export default createCampaign;