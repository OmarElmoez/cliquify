import axiosInstance from "@/lib/axios";

const refreshCampaigns = async () => {
  try {
    const res = await axiosInstance.post('/sync/');
    return res.data;
  } catch (error) {
    return error.response.data.error || 'An error occurred while refreshing campaigns';
  }
}

export default refreshCampaigns;