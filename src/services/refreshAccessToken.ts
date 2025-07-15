import axiosInstance from "@/lib/axios";

type TRefreshResponse = {
  access: string,
  refresh: string
}

const refreshAccessToken = async (): Promise<TRefreshResponse> => {
  const refresh_token = localStorage.getItem('refresh_token')

  if (!refresh_token) {
    console.error('No refresh token provided');
    return;
  };

  const data = {
    refresh: refresh_token
  }

  try {
    const res = await axiosInstance.post<TRefreshResponse>('/api/token/refresh/', data)
    return res.data
  } catch (error) {
    console.error('Failed to refresh token:', error)
  }
}

export default refreshAccessToken;