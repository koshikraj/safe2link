import { sepolia, baseGoerli, goerli } from 'viem/chains';
import { http, createPublicClient, parseEther } from "viem"
import { createBundlerClient, createSmartAccountClient } from 'permissionless';
import { createPimlicoPaymasterClient, createPimlicoBundlerClient  } from "permissionless/clients/pimlico";
import { privateKeyToSafeSmartAccount } from "permissionless/accounts";
import { NetworkUtil } from './networks';

import Safe2LinkModule from "./Safe2LinkModule.json"
import { getJsonRpcProvider } from './web3';
import { Contract, ZeroAddress } from 'ethers';


export const sendTransaction = async(chainId: string, to: string, data: string) => {

    const publicClient = createPublicClient({
        transport: http(NetworkUtil.getNetworkById(parseInt(chainId))?.url),
      });

       const bundlerClient = createPimlicoBundlerClient({
        transport: http(
          "https://api.pimlico.io/v1/goerli/rpc?apikey=b2f7a42a-e993-46df-8fa7-b7f8bec44b81",
        ),
      });


    const paymasterClient = createPimlicoPaymasterClient({
      transport: http(
        "https://api.pimlico.io/v2/goerli/rpc?apikey=b2f7a42a-e993-46df-8fa7-b7f8bec44b81",
      ),
    })



    // const safeAccount = await privateKeyToSafeSmartAccount(publicClient, {
    //   privateKey: "",
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

    // const smartAccountClient = createSmartAccountClient({
    //   account: safeAccount,
    //   chain: goerli,
    //   transport: http(
    //     "https://api.pimlico.io/v1/goerli/rpc?apikey=b2f7a42a-e993-46df-8fa7-b7f8bec44b81",
    //   ),
    //   sponsorUserOperation: paymasterClient.sponsorUserOperation, // optional
    // });

    // console.log(smartAccountClient)

    // const gasPrices = await bundlerClient.getUserOperationGasPrice();



    // const txHash = await smartAccountClient.sendTransaction({
    //   to: "0x0A5B7706DcFb703Bc672e8Bbe0b672B12Ada69d4",
    //   data:  data as `0x${string}`,
    //   maxFeePerGas: gasPrices.fast.maxFeePerGas, // if using Pimlico
    //   maxPriorityFeePerGas: gasPrices.fast.maxPriorityFeePerGas, // if using Pimlico
    // });
    
     
    // console.log(txHash)

}



