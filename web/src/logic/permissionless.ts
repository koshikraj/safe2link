import { base, celo, gnosis, sepolia, baseGoerli, goerli, polygon } from 'viem/chains';
import { LocalAccount, WalletClient, http, createPublicClient, Chain, createWalletClient, SendTransactionParameters, extractChain } from "viem"
import { createBundlerClient, createSmartAccountClient } from 'permissionless';
import { createPimlicoPaymasterClient, createPimlicoBundlerClient  } from "permissionless/clients/pimlico";
import { privateKeyToSafeSmartAccount, signerToSafeSmartAccount } from "permissionless/accounts";
import { NetworkUtil } from './networks';

import { createAccount } from '@turnkey/viem';

import { Contract, parseEther, ZeroAddress } from 'ethers';
import { passkeyHttpClient, publicClient } from './utils';


const getChain = (chainId: string) : Chain => {

  return [base, celo, gnosis, sepolia, baseGoerli, goerli, polygon].find((chain: any) => chain.id == chainId) as Chain;
  

}

export const sendTransaction = async(chainId: string, to: string, data: string, safeAccount: any, value: BigInt = 0n) => {

  const chain = getChain(chainId);
  // console.log(NetworkUtil.getNetworkById(parseInt(chainId))?.url)

  // const publicClient = createPublicClient({
  //   transport: http(NetworkUtil.getNetworkById(parseInt(chainId))?.url),
  // });

  const bundlerClient = createPimlicoBundlerClient({ 
    transport: http(
      `https://api.pimlico.io/v1/${chain.name.toLowerCase().replace(/\s+/g, '-')}/rpc?apikey=${import.meta.env.VITE_PIMLICO_API_KEY}`,
    ),
  });


  const paymasterClient = createPimlicoPaymasterClient({
    transport: http(
      `https://api.pimlico.io/v2/${chain.name.toLowerCase().replace(/\s+/g, '-')}/rpc?apikey=${import.meta.env.VITE_PIMLICO_API_KEY}`,
    ),
  })



    const smartAccountClient = createSmartAccountClient({
      account: safeAccount,
      chain: chain,
      transport: http(
        `https://api.pimlico.io/v1/${chain.name.toLowerCase().replace(/\s+/g, '-')}/rpc?apikey=${import.meta.env.VITE_PIMLICO_API_KEY}`,
      ),
      sponsorUserOperation: paymasterClient.sponsorUserOperation, // optional
    });

    console.log(smartAccountClient)

    const gasPrices = await bundlerClient.getUserOperationGasPrice();


    try {
      

    const txHash = await smartAccountClient.sendTransaction({
      to: to as `0x${string}`,
      data:  data as `0x${string}`,
      value: value,
      maxFeePerGas: gasPrices.fast.maxFeePerGas, // if using Pimlico
      maxPriorityFeePerGas: gasPrices.fast.maxPriorityFeePerGas, // if using Pimlico
    } as SendTransactionParameters);
    
    console.log(txHash)
     
    return txHash;

  } catch(e) {
    
    console.log(e)
    return false;
  }

}


export const createSafeAccount = async (chainId: number, wallet: any) => {

  const chain = getChain(chainId.toString());

  const viemAccount = await createAccount({
      client: passkeyHttpClient,
      organizationId: wallet.subOrgId,
      signWith: wallet.address,
      ethereumAddress: wallet.address,
  });

  const viemClient = createWalletClient({
      account: viemAccount,
      chain: chain,
      transport: http(),
  });
  try {
  const account = await signerToSafeSmartAccount(publicClient(chainId), {
      signer: viemClient.account,
      entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
      safeVersion: "1.4.1",
      safe4337ModuleAddress: "0xa581c4A4DB7175302464fF3C06380BC3270b4037",
      addModuleLibAddress: "0x8EcD4ec46D4D2a6B64fE960B3D64e8B94B2234eb",
  });
  console.log(account)

  return account;

    } catch(e) {
      console.log(e)
    }


  

  // const safeAccount = await signerToSafeSmartAccount(publicClient, {
  //   signer: signer,
  //   safeVersion: "1.4.1",
  //   entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // global entrypoint
  //   // saltNonce: 0, // optional
  //   addModuleLibAddress: "0x191EFDC03615B575922289DC339F4c70aC5C30Af",
  //   safe4337ModuleAddress: "0x39E54Bb2b3Aa444b4B39DEe15De3b7809c36Fc38",
  //   safeProxyFactoryAddress: "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67",
  //   safeSingletonAddress: "0x41675C099F32341bf84BFc5382aF534df5C7461a",
  //   multiSendAddress: "0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526",
  //   multiSendCallOnlyAddress: "0x9641d764fc13c8B624c04430C7356C1C7C8102e2",

  // });
}
