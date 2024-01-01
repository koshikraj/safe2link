import create from 'zustand';

const useLinkStore = create((set) => ({
  fetching: false,
  accountDetails: {},
  authDetails: {},
  chainId: localStorage.getItem('chainId') ? parseInt(localStorage.getItem('chainId')!) : 11155111,
  confirming: false,
  confirmed: false,
  claimDetails: {chainId: 11155111},
  wallet: {},

  setChainId: (id: number) => {
    set((state: any) => ({
      ...state,
      chainId: id,
    }));
  },

  setClaimDetails: (details: object) => {
    set((state: any) => ({
      ...state,
      claimDetails: details,
    }));
  },

  setWallet: (wallet: object) => {
    set((state: any) => ({
      ...state,
      wallet: wallet,
    }));
  },

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
