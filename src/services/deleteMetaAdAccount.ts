import axiosInstance from "@/lib/axios";

type TDeleteAccountResponse = {
  response: string
}

const deleteMetaAdAccount = async ({account_id}: {account_id: string}): Promise<TDeleteAccountResponse> => {
  try {
    const res = await axiosInstance.delete<TDeleteAccountResponse>(`/account/delete/${account_id}/`);
    return res.data;
  } catch (error) {
    console.error('failed to delete account: ', error)
  }
}

export default deleteMetaAdAccount;