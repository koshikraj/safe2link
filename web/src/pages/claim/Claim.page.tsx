import { useCallback, useEffect, useState, } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Input,
  Loader,
  LoadingOverlay,
  Modal,
  Paper,
  Select,
  Skeleton,
  Stack,
} from '@mantine/core';
import { getWebAuthnAttestation, TurnkeyClient } from "@turnkey/http";
import classes from './Claim.module.css';
import { useNavigate } from 'react-router-dom';

import { NetworkUtil } from '../../logic/networks';
import { useDisclosure } from '@mantine/hooks';
import { createLink, claimLink, getLinkDetails } from '../../logic/module';
import { formatEther, parseEther, ZeroAddress, formatUnits } from 'ethers';
import { createSafeAccount } from '@/logic/permissionless';

import Base from '../../assets/icons/base.png';
import ETH from '../../assets/icons/eth.svg';
import Gnosis from '../../assets/icons/gno.svg';
import { IconSun } from '@tabler/icons';
import { RoutePath } from '@/navigation';
import useLinkStore from '@/store/link/link.store';
import { base64UrlEncode, generateRandomBuffer, getTokenBalance, getTokenDecimals } from '@/logic/utils';
import { CreateSubOrgWithPrivateKeyRequest, createUser, loginUser } from '@/logic/auth';
import { WebauthnStamper } from "@turnkey/webauthn-stamper";
import { TWalletDetails } from '@/logic/types';
import { getTokenInfo } from '@/logic/tokens';
import { getJsonRpcProvider } from '@/logic/web3';


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

const stamper = new WebauthnStamper({
  rpId: process.env.NEXT_PUBLIC_RPID!,
});

const passkeyHttpClient = new TurnkeyClient(
  {
    baseUrl: import.meta.env.VITE_TURNKEY_API_BASE_URL!,
  },
  stamper
);



function ClaimPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const [queryParams, setQueryParams]: any = useState();
  const [linkDetails, setLinkDetails]: any = useState({});
  const [linkLoading, setLinkLoading] = useState(true);
  const [walletName, setWalletName] = useState<string>('');
  const [network, setNetwork] = useState('');
  const [ message, setMessage ] = useState('');
  const { confirming, setConfirming, setConfirmed, setClaimDetails, claimDetails } = useLinkStore((state: any) => state);


  console.log(linkDetails)
  function getAllQueryParameters(url: any) {
    const queryString = url.split('?')[1];
    if (!queryString) {
      return null;
    }

    const params = new URLSearchParams(queryString);
    const parameters: any = {};

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

      try {
      let { claimed, amount, tokenAddress }: any = await getLinkDetails(
        qParams.c,
        qParams.i
      );

      const provider = await getJsonRpcProvider(qParams.c);

      if(tokenAddress == ZeroAddress) {
        amount = formatEther(amount)
        } else {
          amount = formatUnits(amount, await getTokenDecimals(tokenAddress, provider))
        }
      setLinkDetails({ claimed: claimed, amount: amount, token: tokenAddress, chainId: qParams.c });

      setNetwork(
        `${NetworkUtil.getNetworkById(Number(qParams.c))?.name} ${NetworkUtil.getNetworkById(
          Number(qParams.c)
        )?.type}`
      );
        }
       catch(e) {

        setLinkLoading(false)

       }
       setLinkLoading(false) 
    })();
  }, []);


  return (
  
    <>
      <Modal opened={opened} onClose={close} title="Claim via Safe Account" centered>
      <LoadingOverlay
          visible={confirming}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'green' , children: <Paper
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'inherit',
            padding: '20px'
          }}
        ><p className={classes.loader}>
           { message }.</p>
          <p className={classes.subHeading}> Buckle up! Our digital hamsters are on their morning jog—this'll be quicker than a cat video. 🏃‍♂️💨
        </p><Loader color="green" type="dots"  size='xl'/> </Paper>}}
        />

      <div className={classes.formContainer}>
            <div>
              <h1 className={classes.heading}>Claim in one click with PassKey</h1>
            </div>
            <p className={classes.subHeading}>
            First time at Safe2Link?
            </p>
            <div className={classes.accountInputContainer}>
            
             <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '20px',
                  marginBottom: '20px',
                  alignItems: 'center',
                }}
              >

              <Input.Wrapper >
                <Input
                  type="text"
                  size="lg"
                  value={walletName}
                  onChange={(event: any) => setWalletName(event.currentTarget.value)}
                  placeholder="Wallet Name"
                  className={classes.input}
                />
              </Input.Wrapper>
          
            <Button
              type="button"
              size="lg" radius="md" 
              fullWidth
              variant="outline"
              color="green"
              style={{
                marginLeft: "20px"}}
              onClick={ async() => { 

                try {
                setConfirming(true);
                setMessage('Authenticating you ...');
                const user = await createUser(walletName)
                const safeAccount = await createSafeAccount(parseInt(queryParams.c), user)

                setMessage('Confirming the claim transaction');


                const response = await claimLink(
                  queryParams.c,
                  queryParams.i,
                  queryParams.p,
                  safeAccount
                );
                setClaimDetails({ account: safeAccount, amount: linkDetails.amount, chainId: parseInt(queryParams.c), token: linkDetails.token })
  
                setConfirming(false);
                navigate(RoutePath.account);
                }
                catch(e) {

                  setConfirming(false);

                }

              }}
              loading={ false}
            >
            Create & Claim
            </Button>
            </div>

            <p className={classes.footerHeading}>
              This will claim the funds to a new Safe Account (with 4337 module) created via passkey.
            </p>

            <Divider my="xs" label="OR" labelPosition="center" />

              
            <p className={classes.subHeading}>
              Already have an account?
              </p>

            <div
                style={{
                  display: 'flex',
                  marginTop: '20px',
                  marginBottom: '20px',
                  alignItems: 'center',
                  justifyContent: 'center',

                }}
              >
            <Button
              type="button"
              size="lg" radius="md" 
              fullWidth
              color="green"
              className={classes.btn}
              onClick={ async() => { 

                try {
                setConfirming(true);
                setMessage('Authenticating you ...');
                const user = await loginUser()
                setMessage('Confirming the claim transaction');
                const safeAccount = await createSafeAccount(parseInt(queryParams.c), user )
                setConfirming(true);


              const response = await claimLink(
                queryParams.c,
                queryParams.i,
                queryParams.p,
                safeAccount
              );
             
              setClaimDetails({ account: safeAccount, amount: linkDetails.amount, chainId: parseInt(queryParams.c), token: linkDetails.token })

              setConfirming(false);

              navigate(RoutePath.account);
              }
              catch(e) {

                setConfirming(false);

              }
                
              
              }}
              loading={ false}
            >
            Login & Claim
            </Button>
            </div>   
            </div>
          </div>
        
      </Modal>
      <div className={classes.homeContainer}>
        <Paper className={classes.claimContainer} shadow="md" radius="md">
       
          {linkLoading ? <><Skeleton style={{marginBottom: '10px'}} height={20} width={200} mt={6} radius="xl" /> 
          <Skeleton style={{marginBottom: '20px'}} height={20} width={200} mt={6} radius="xl" /> 
          <Skeleton style={{marginBottom: '20px'}} height={40} width={150} mt={6} radius="md" />
          </>
          :
             <>
            { linkDetails.amount && ! linkDetails.claimed ? 
            
            <div>
            <h1 className={classes.claimHeading}>
              You have 
              <h1 className={classes.claimInner}>
              {linkDetails.amount ? linkDetails.amount : 0}{' '}
            
              {getTokenInfo(linkDetails.chainId, linkDetails.token)?.label}  <Avatar src={getTokenInfo(linkDetails.chainId, linkDetails.token)?.image} ></Avatar>
              
           
              </h1>
           
            </h1>
            <h1 className={classes.links}>    to claim  🎉 😍
            </h1>
            
          </div> :
            <div>
            <h1 className={classes.claimHeading}>
              Looks like there is nothing to claim
            </h1>
           <h1 className={classes.links}> 👀 😢
            </h1>   
          </div> 
          }
          

         { linkDetails.amount && ! linkDetails.claimed && <Button
            size="lg" radius="md" 
            style={{width: '50%', marginTop: "20px"}}
            fullWidth
            color="teal"
            type="button"
            className={classes.btn}
            onClick={async () => {
              open();

            }}
          >
            Claim Now
          </Button> }</>}
    
        </Paper>
      </div>
      {/* show confetti when claim is success */}
    
    </>
  );
}

export default ClaimPage;
