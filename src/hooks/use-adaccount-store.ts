import { create } from 'zustand'

type AdAccountState = {
  selectedAdAccountId: string,
  setSelectedAdAccountId: (id: string) => void
}

const useAdAccountStore = create<AdAccountState>((set) => ({
  selectedAdAccountId: "",
  setSelectedAdAccountId: (id: string) => set({selectedAdAccountId: id})
}))

export default useAdAccountStore;