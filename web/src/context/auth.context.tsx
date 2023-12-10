import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  SafeAuthPack,
  SafeAuthConfig,
  SafeAuthInitOptions,
  SafeAuthUserInfo,
  AuthKitSignInData,
} from '@safe-global/auth-kit';
import { BrowserProvider, Eip1193Provider, ethers } from 'ethers';
import { NetworkUtil } from '@/logic/networks';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }: any) => {
  const [authInstance, setAuthInstance] = useState<SafeAuthPack>();
  const [accountInfo, setAccountInfo] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<SafeAuthUserInfo | null>(null);
  const [chainId, setChainId] = useState(84531);
  const [balance, setBalance] = useState<string>();
  const [safeAuthSignInResponse, setSafeAuthSignInResponse] = useState<AuthKitSignInData | null>(
    null
  );
  const [network, setNetwork] = useState('');
  const [provider, setProvider] = useState<BrowserProvider>();

  const fetchData = useCallback(async () => {
    try {
      const safeAuthConfig: SafeAuthConfig = {
        txServiceUrl: 'https://safe-transaction-goerli.safe.global',
      };

      const safeAuthInitOptions: SafeAuthInitOptions = {
        enableLogging: true,
        buildEnv: 'production',
        showWidgetButton: false,
        chainConfig: {
          chainId: '0x5',
          rpcTarget: NetworkUtil.getNetworkById(5)?.url!,
        },
      };

      const safeAuthPack = new SafeAuthPack(safeAuthConfig);
      await safeAuthPack.init(safeAuthInitOptions);
      //@ts-ignore
      setAuthInstance(safeAuthPack);
      // const signInInfo = await safeAuthPack?.signIn();
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!authInstance || !isAuthenticated) return;
    (async () => {
      const web3Provider = authInstance.getProvider();
      const info = await authInstance.getUserInfo();

      setUserInfo(info);

      if (web3Provider) {
        const p = new BrowserProvider(authInstance.getProvider() as Eip1193Provider);
        console.log('ppppprovider----', p);

        const signer = await p.getSigner();
        const signerAddress = await signer.getAddress();

        console.log(signer)
        //@ts-ignore
        // eslint-disable-next-line no-unsafe-optional-chaining
        setChainId((await p?.getNetwork()).chainId.toString());
        setBalance(ethers.formatEther((await p.getBalance(signerAddress)) as ethers.BigNumberish));
        setProvider(provider);
      }
    })();
  }, [isAuthenticated]);

  console.log(provider, balance, chainId);

  // Sign in func
  const signIn = async (): Promise<any> => {
    try {
      //@ts-ignore
      const signInInfo = await authInstance?.signIn();
      setSafeAuthSignInResponse(signInInfo!);
      setIsAuthenticated(true);
      const p = new BrowserProvider(authInstance?.getProvider() as Eip1193Provider);

      const signer = await p.getSigner();

      return(signer)

    } catch (error) {
      console.log('something went wrong....');
    }
  };

  const signOut = async () => {
    //@ts-ignore

    await authInstance?.signOut();

    setSafeAuthSignInResponse(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      //@ts-ignore
      value={{
        isAuthenticated,
        signIn,
        authInstance,
        setAccountInfo,
        accountInfo,
        signOut,
        chainId,
        setChainId,
        network,
        setNetwork,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useSafeAuth = () => useContext(AuthContext);
