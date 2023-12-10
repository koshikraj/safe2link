import { useCallback, useEffect, useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Center,
  Container,
  Input,
  Modal,
  Paper,
  Select,
  Stack,
} from '@mantine/core';
import { SafeAuthPack, SafeAuthConfig, SafeAuthInitOptions } from '@safe-global/auth-kit';
import classes from './Claim.module.css';
import Confetti from 'react-confetti';

import { NetworkUtil } from '../../logic/networks';
import { useSafeAuth } from '@/context';
import { useDisclosure } from '@mantine/hooks';
import { createLink, claimLink, getLinkDetails } from '../../logic/module';
import { formatEther, parseEther, ZeroAddress } from 'ethers';
import { sendTransaction } from '@/logic/permissionless';

import Base from '../../assets/icons/base.png';
import ETH from '../../assets/icons/eth.svg';
import Gnosis from '../../assets/icons/gno.svg';
import { IconSun } from '@tabler/icons';

const moduleAddress = '0x0A5B7706DcFb703Bc672e8Bbe0b672B12Ada69d4';

const badgeIcons = [
  { ids: ['84531'], img: Base },
  { ids: ['11155111', '5', '1'], img: ETH },
  { ids: ['100'], img: Gnosis },
  // Add more mappings as needed
];

function getIconForId(id: any) {
  for (const icon of badgeIcons) {
    if (icon.ids.includes(id.toString())) {
      return icon.img;
    }
  }
  // Return a default icon or handle the case when no mapping is found
  return 'defaultIcon';
}

function ClaimPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [queryParams, setQueryParams]: any = useState();
  const [linkDetails, setLinkDetails]: any = useState({});
  const [network, setNetwork] = useState('');

  const { signIn } = useSafeAuth();

  function getAllQueryParameters(url) {
    const queryString = url.split('?')[1];
    if (!queryString) {
      return null;
    }

    const params = new URLSearchParams(queryString);
    const parameters = {};

    for (const [key, value] of params.entries()) {
      parameters[key] = value;
    }

    return parameters;
  }

  useEffect(() => {
    // Get the current URL search parameters
    (async () => {
      const qParams: any = getAllQueryParameters(window.location.href);
      setQueryParams(qParams);

      const { claimed, amount, tokenAddress } = await getLinkDetails(
        moduleAddress,
        qParams.c,
        qParams.i
      );
      setLinkDetails({ claimed: claimed, amount: amount, token: tokenAddress, chainId: qParams.c });

      setNetwork(
        `${NetworkUtil.getNetworkById(Number(qParams.c))?.name} ${NetworkUtil.getNetworkById(
          Number(qParams.c)
        )?.type}`
      );
    })();
  }, []);

  console.log(linkDetails);

  return (
    // <Container>
    //   <Container className={classes.homeScreenContainer}>
    //     <Container
    //       style={{
    //         padding: 0,
    //         marginTop: '150px',
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //       }}
    //     >
    //       <Paper
    //         className={classes.innerContainer}
    //         shadow="xl"
    //         withBorder
    //         radius="md"
    //         p="xl"
    //         style={{
    //           marginTop: 30,
    //           // width: 700
    //         }}
    //       >
    //         <div style={{ padding: 0, display: 'flex', justifyContent: 'center' }}>
    //           <img className={classes.heroImage} />
    //         </div>
    //         <div
    //           style={{
    //             paddingLeft: 80,
    //             paddingRight: 80,
    //             display: 'flex',
    //             justifyContent: 'center',
    //           }}
    //         >
    //           <p className={classes.p}>Share your crypto with link</p>
    //         </div>

    //         <div
    //           style={{
    //             padding: 0,
    //             display: 'flex',
    //             justifyContent: 'center',
    //             marginBottom: '20px',
    //           }}
    //         >
    //           <img className={classes.heroImage} />
    //         </div>
    //         <div style={{ padding: 0, display: 'flex', justifyContent: 'center' }}>
    //           <Button
    //             onClick={signIn}
    //             size="lg"
    //             radius="md"
    //             color="#20283D"
    //             variant="filled"
    //             style={{
    //               backgroundColor: '#20283D',
    //             }}
    //           >
    //             Get Started
    //           </Button>
    //         </div>
    //       </Paper>
    //     </Container>
    //     <div className={classes.actionsContainer} />
    //   </Container>
    // </Container>
    <>
      <div className={classes.homeContainer}>
        <div className={classes.formContainer}>
          <div>
            {/* <Badge
                pl={0}
                color="gray"
                variant="light"
                leftSection={
                  <Avatar alt="Avatar for badge" size={24} mr={5} src={getIconForId(queryParams?.c)} />
                }
                size="lg"
                // className={classes.network}
                checked={false}
                icon={<IconSun />}
              >
                {network}
              </Badge> */}
            <h1 className={classes.heading}>
              You have {linkDetails.amount ? formatEther(linkDetails.amount) : 0}{' '}
              {linkDetails.token ? 'ETH' : ''} to claim..
            </h1>
          </div>

          <Button
            color="teal"
            type="button"
            className={classes.btn}
            onClick={async () => {
              await claimLink(
                queryParams.c,
                moduleAddress,
                queryParams.i,
                queryParams.p,
                '0x958543756A4c7AC6fB361f0efBfeCD98E4D297Db'
              );
            }}
          >
            Claim
          </Button>
          <p className="helperText">something....</p>
        </div>
      </div>
      {/* show confetti when claim is success */}
      <Confetti width={2000} height={1200} />
    </>
  );
}

export default ClaimPage;
