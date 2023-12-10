import create from 'zustand';

const useLinkStore = create((set) => ({
  fetching: false,
  accountDetails: {},
  authDetails: {},
  chainId: localStorage.getItem('chainId') ? parseInt(localStorage.getItem('chainId')!) : 84531,
  confirming: false,
  confirmed: false,
  // address: '',

  setChainId: (id: number) => {
    set((state: any) => ({
      ...state,
      chainId: id,
    }));
  },

  // setAddress: (address: string) => {
  //   set((state: any) => ({
  //     ...state,
  //     address: address,
  //   }));
  // },

  setConfirming: (status: boolean) => {
    set((state: any) => ({
      ...state,
      confirming: status,
    }));
  },

  setConfirmed: (status: boolean) => {
    set((state: any) => ({
      ...state,
      confirmed: status,
    }));
  },

  setFetching: (status: boolean) => {
    set((state: any) => ({
      ...state,
      fetching: status,
    }));
  },

  setAccountDetails: (data: object) =>
    set((state: any) => ({
      accountDetails: data,
    })),
  setAuthDetails: (data: object) =>
    set((state: any) => ({
      authDetails: data,
    })),

}));
export default useLinkStore;
