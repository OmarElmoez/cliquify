
import axiosInstance from '@/lib/axios';

export type AdAccount = {
  id: string;
  name: string;
  account_id: string;
  account_status: number;
  business_name: string;
  currency: string;
  timezone_name: string;
  amount_spent: string;
  owner: string;
}

type adAccountResponse = {
  data: AdAccount[];
}

export const getAdAccounts = async (): Promise<adAccountResponse> => {
  try {
    const response = await axiosInstance.get('/adaccounts/list/');
    return response.data;
  } catch (error) {
    return error.response.data.error;
    // console.error('Error fetching ad accounts:', error);
    // throw error;
  }
};
