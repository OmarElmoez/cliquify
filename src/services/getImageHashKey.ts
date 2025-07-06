import axiosInstance from "@/lib/axios"

type GetImageHashResposne = {
  image_url: string;
  image_hash: {
    hash: string;
  }
}

const getImageHashKey = async (file: File): Promise<GetImageHashResposne> => {
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const response = await axiosInstance.post<GetImageHashResposne>('/images/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export default getImageHashKey;