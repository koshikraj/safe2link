import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { SafeAuthPack, SafeAuthConfig, SafeAuthInitOptions } from '@safe-global/auth-kit';
import { NetworkUtil } from '@/logic/networks';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }: any) => {
  const [authInstance, setAuthInstance] = useState(null);
  const [accountInfo, setAccountInfo] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      console.warn(e);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sign in func
  const signIn = async () => {
    try {
      //@ts-ignore
      const signInInfo = await authInstance?.signIn();
      setAccountInfo(signInInfo);
      setIsAuthenticated(true);
      console.log('signin info', signInInfo);
    } catch (error) {
      console.log('something went wrong....');
    }
  };

  const signOut = async () => {
    //@ts-ignore
    await authInstance?.signOut();
    setAuthInstance(null);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useSafeAuth = () => useContext(AuthContext);
