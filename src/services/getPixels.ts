import axiosInstance from "@/lib/axios";

export type TPixel = {
  id: string,
  name: string,
}

type GetPixelsResponse = {
  response: TPixel[],
}

const getPixels = async ({account_id}: {account_id: string}): Promise<TPixel[]> => {
  try {
    const res = await axiosInstance.get<GetPixelsResponse>(`/pixels/?account_id=${account_id}`)
    return res.data.response;
  } catch (error) {
    return error.response?.data?.error || 'An error occurred while fetching pixels'
  }
}

export default getPixels;