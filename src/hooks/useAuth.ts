import { SafeAuthInitOptions, SafeAuthPack } from '@safe-global/auth-kit';

import { useCallback, useEffect, useState } from 'react';

export const useSafeAuth = () => {
  const [signInInfo, setSignInInfo] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const safeAuthConfig = {
        txServiceUrl: 'https://safe-transaction-goerli.safe.global',
      };

      const safeAuthInitOptions: SafeAuthInitOptions = {
        enableLogging: true,
        buildEnv: 'production',
        showWidgetButton: false,
        chainConfig: {
          chainId: '0x5',
          rpcTarget: x.getNetworkById(5)?.url!,
        },
      };

      const safeAuthPack = new SafeAuthPack(safeAuthConfig);
      await safeAuthPack.init(safeAuthInitOptions);
      const signIn = await safeAuthPack?.signIn();
      //@ts-ignore
      setSignInInfo(signIn);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { signInInfo, fetchData };
};


