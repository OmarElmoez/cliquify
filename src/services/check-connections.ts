import axiosInstance from "@/lib/axios";

export type Connection = {
  user: number;
  provider: string;
  provider_user_id: string;
  email: string;
  business_account_id: string;
  advertiser_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CheckConnectionsResponse = {
  connections: Connection[];
};

const checkConnections = async (): Promise<CheckConnectionsResponse> => {
  try {
    const res = await axiosInstance.get<CheckConnectionsResponse>('/connections/');
    return res.data;
  } catch (error) {
    console.log('faild to check connections:', error);
    throw error;
  }
}

export default checkConnections;