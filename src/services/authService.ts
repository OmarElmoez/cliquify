import axiosInstance from "@/lib/axios";

const baseURL = 'https://cliquifyapi.otomatika.tech/api/v1'

export function signInWithGoogle() {
  window.location.href = `${baseURL}/google/login/`;
} 

// export function signInWithMeta() {
//   window.location.href = `${baseURL}/meta/login/`;
// }

type MetaResponse = {
  url: string;
}

export const signInWithMeta = async () => {
  try {
    const response = await axiosInstance.get<MetaResponse>('/meta/login/');
    return response.data.url
  } catch(error) {
    console.log('failed to sign in with meta', error);
    throw error;
  }
}