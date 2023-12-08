import { Flex, Grid, Text, Code, Button } from '@radix-ui/themes';
import { useAccount, useContractWrite, useNetwork, usePrepareContractWrite } from 'wagmi';
import { sepolia, baseGoerli } from 'viem/chains';
import { http, createPublicClient, parseEther } from "viem"

import abi from '@/onchain/contract/Custom1155';
import useCollectionMetadata from '../hooks/useCollectionMetadata';
import NotConnected from './NotConnected';
import SwitchNetwork from './SwitchNetwork';
import { createBundlerClient, createSmartAccountClient } from 'permissionless';
import { createPimlicoPaymasterClient, createPimlicoBundlerClient  } from "permissionless/clients/pimlico";
import { privateKeyToSafeSmartAccount } from "permissionless/accounts";
import { useEffect } from 'react';


// A future enhancement would be to support multiple mints, getting chain, abi, and
// contract address through dynamic routes, like `/mints/[tokenType]/[chain]/[contractAddress]`
const CONTRACT_ADDRESS: `0x${string}` = '0xBB955f815131818D62A220F70F5938daF812522d';
const EXPECTED_CHAIN = baseGoerli;

const CONTRACT = {
  abi,
  address: CONTRACT_ADDRESS,
};

export function Mint() {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();

  const onCorrectNetwork = chain?.id === EXPECTED_CHAIN.id;




useEffect(() => {
  // Code inside this block will run after the component renders

  // Example: Fetching data from an API
  const fetchData = async () => {
    try {

      const publicClient = createPublicClient({
        transport: http("https://eth-sepolia.g.alchemy.com/v2/eCr9bFDzgYgDrox-mnXPPh7_koP-agKo"),
      });

       const bundlerClient = createPimlicoBundlerClient({
        transport: http(
          "https://api.pimlico.io/v1/sepolia/rpc?apikey=b2f7a42a-e993-46df-8fa7-b7f8bec44b81",
        ),
      });
       
    
    const paymasterClient = createPimlicoPaymasterClient({
      transport: http(
        "https://api.pimlico.io/v2/sepolia/rpc?apikey=b2f7a42a-e993-46df-8fa7-b7f8bec44b81",
      ),
    })

    


    const safeAccount = await privateKeyToSafeSmartAccount(publicClient, {
      privateKey: "",
      safeVersion: "1.4.1",
      entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // global entrypoint
      // saltNonce: 0, // optional
      addModuleLibAddress: "0x191EFDC03615B575922289DC339F4c70aC5C30Af",
      safe4337ModuleAddress: "0x39E54Bb2b3Aa444b4B39DEe15De3b7809c36Fc38",
      safeProxyFactoryAddress: "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67",
      safeSingletonAddress: "0x41675C099F32341bf84BFc5382aF534df5C7461a",
      multiSendAddress: "0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526",
      multiSendCallOnlyAddress: "0x9641d764fc13c8B624c04430C7356C1C7C8102e2",

    });

    console.log(paymasterClient.sponsorUserOperation)
    const smartAccountClient = createSmartAccountClient({
      account: safeAccount,
      chain: sepolia,
      transport: http(
        "https://api.pimlico.io/v1/sepolia/rpc?apikey=b2f7a42a-e993-46df-8fa7-b7f8bec44b81",
      ),
      sponsorUserOperation: paymasterClient.sponsorUserOperation, // optional
    });

    console.log(smartAccountClient)

    const gasPrices = await bundlerClient.getUserOperationGasPrice();
    console.log(gasPrices)
    const txHash = await smartAccountClient.sendTransaction({
      to: "0x958543756A4c7AC6fB361f0efBfeCD98E4D297Db",
      value: parseEther("0.001"),
      maxFeePerGas: gasPrices.fast.maxFeePerGas, // if using Pimlico
      maxPriorityFeePerGas: gasPrices.fast.maxPriorityFeePerGas, // if using Pimlico
    });

    console.log(txHash)
   

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData(); // Call the function

  // Cleanup function (optional)
  return () => {
    // Code inside this block will run when the component unmounts or when the dependencies change
    // It is used for cleanup tasks or cancelling asynchronous operations
  };

}, []); 

  const { collectionName, description, imageAddress, isLoading } =
    useCollectionMetadata(onCorrectNetwork);

  const { config } = usePrepareContractWrite({
    ...CONTRACT,
    functionName: 'mint',
    args: address ? [address, BigInt(1), BigInt(1), address] : undefined,
    enabled: onCorrectNetwork,
  });

  // A future enhancement would be to use the `isLoading` and `isSuccess`
  // properties returned by `useContractWrite` to indicate transaction
  // status in the UI.
  const { write: mint } = useContractWrite(config);

  if (!isConnected) {
    return <NotConnected />;
  }

  if (!onCorrectNetwork) {
    return <SwitchNetwork />;
  }

  if (isLoading) {
    // A future enhancement would be a nicer spinner here.
    return <Text size="5">loading...</Text>;
  }

  return (
    <Grid columns={{ md: '420px 1fr' }} gap={{ md: '9' }}>
      <Flex direction="column" align="center" gap="5">
        <img src={imageAddress} alt={collectionName} />
      </Flex>
      <Flex direction="column" align="center" gap="5">
        <Text size="5" weight="bold" mb="1">
          <Code color="crimson">{collectionName}</Code>
        </Text>
        <Text>{description}</Text>
        <Button onClick={mint}>Mint for free (requires gas)</Button>
      </Flex>
    </Grid>
  );
}
