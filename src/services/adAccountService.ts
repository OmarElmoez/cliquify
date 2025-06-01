
import axiosInstance from '@/lib/axios';

export interface AdAccount {
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

export const fetchAdAccounts = async (): Promise<AdAccount[]> => {
  try {
    const response = await axiosInstance.post('/meta/data/adaccount/list/', {
      external_id: "1"
    });
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching ad accounts:', error);
    throw error;
  }
};
