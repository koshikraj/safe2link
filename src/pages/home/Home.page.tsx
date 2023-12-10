import { useCallback, useEffect, useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Center,
  Container,
  CopyButton,
  Input,
  InputLabel,
  Modal,
  Paper,
  Select,
  Stack,
} from '@mantine/core';
import { SafeAuthPack, SafeAuthConfig, SafeAuthInitOptions } from '@safe-global/auth-kit';
import classes from './Home.module.css';

import { NetworkUtil } from '../../logic/networks';
import { useSafeAuth } from '@/context';
import { useDisclosure } from '@mantine/hooks';
import { createLink } from '../../logic/module';
import { ZeroAddress } from 'ethers';

import Confetti from 'react-confetti';
import { IconSun } from '@tabler/icons';

import Base from '../../assets/icons/base.png';
import Celo from '../../assets/icons/celo.svg';
import ETH from '../../assets/icons/eth.svg';
import Gnosis from '../../assets/icons/gno.svg';
import Matic from '../../assets/icons/matic.svg';
import { getProvider } from '@/logic/web3';
import { useNavigate } from 'react-router-dom';

const badgeIcons = [
  { ids: ['84531', '8453'], img: Base },
  { ids: ['11155111', '5', '1'], img: ETH },
  { ids: ['100'], img: Gnosis },
  { ids: ['42220'], img: Celo },
  { ids: ['1101', '137', '80001'], img: Matic },
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

function HomePage() {
  const [opened, { open, close }] = useDisclosure(false);



  const [mock, setMock] = useState({});

  const [tokenValue, setTokenValue] = useState('0');
  const [seletcedToken, setSelectedToken] = useState<string | null>('');

  const [seletcedNetwork, setSelectedNetwork] = useState<string | null>('');
  // { i: Number(index), p: randomSeed, c: chainId }
  const [network, setNetwork] = useState('');
  const [chainId, setChainId] = useState(84531);

  const [isLinkCreated, setIsLinkCreated] = useState(false);
  const [sharableLink, setSharableLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const create = async () => {
    setIsLoading(true);
    try {
      const result = await createLink(
        ZeroAddress,
        tokenValue
      );
      //@ts-ignore
      const queryString = new URLSearchParams(result)?.toString();
      const url = `${window.location.href}#/claim?${queryString}`;
      console.log('url', url);
      setSharableLink(url);
      setIsLinkCreated(false);
      setIsLoading(false);
      setSharableLink(url);
    } catch (e) {
      setIsLoading(false);
    }
    setIsLinkCreated(true);
  };

  useEffect(() => {
    (async () => {
      const provider = await getProvider();

      const chainId = (await provider.getNetwork()).chainId;
      setChainId(Number(chainId));
      setNetwork(
        `${NetworkUtil.getNetworkById(Number(chainId))?.name} ${NetworkUtil.getNetworkById(
          Number(chainId)
        )?.type}`
      );
    })();
  }, []);

  return (
    <>
      {sharableLink.length > 0 ? (
        <>
          <Confetti width={2000} height={1200} />
          <div className={classes.successContainer}>
            <div className={classes.formContainer}>
              <h1 className={classes.heading}>Yay!!!</h1>

              <p className={classes.subheading} style={{ textAlign: 'center' }}>
                Share this link with Anyone, so that they can claim the funds
              </p>

              <div className={classes.copyContainer}>
                <Input
                  className={classes.input}
                  // style={{ width: '400px' }}
                  value={sharableLink}
                  placeholder={sharableLink}
                />

                <CopyButton value={sharableLink}>
                  {({ copied, copy }) => (
                    <Button
                      className={classes.btn}
                      color={copied ? 'green' : 'teal'}
                      onClick={copy}
                    >
                      {copied ? 'Copied Link' : 'Copy Link'}
                    </Button>
                  )}
                </CopyButton>
              </div>
              <div className={classes.goBack}>
                <Button variant="primary" onClick={() => setSharableLink('')}>
                  Create new Link
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={classes.homeContainer}>
          <div className={classes.formContainer}>
            <div>
              <h1 className={classes.heading}>Send crypto effortlessly with Safe2Link!</h1>
            </div>
            <div className={classes.inputContainer}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '20px',
                  marginBottom: '20px',
                  alignItems: 'center',
                }}
              >
                <Select
                  // label="Select the Token"
                  placeholder="ETH"
                  data={['USDT', 'Matic', 'ETH', 'FIL']}
                  defaultValue="ETH"
                  value={seletcedToken}
                  onChange={setSelectedToken}
                />

                <Badge
                  pl={0}
                  color="gray"
                  variant="light"
                  leftSection={
                    <Avatar alt="Avatar for badge" size={24} mr={5} src={getIconForId(chainId)} />
                  }
                  size="lg"
                  className={classes.network}
                
                >
                  {network}
                </Badge>
              </div>

              <Input.Wrapper label="Enter Value">
                <Input
                  type="number"
                  value={tokenValue}
                  onChange={(e) => setTokenValue(e?.target?.value)}
                  placeholder="enter the value"
                  className={classes.input}
                />
              </Input.Wrapper>
            </div>
            <Button
              type="button"
              fullWidth
              color="green"
              className={classes.btn}
              onClick={create}
              loading={isLoading}
              // onClick={async () => {
              //   setMock({ i: 0, p: 'randomSeed', c: 1 });
              //   console.log(
              //     'click'
              //     // await createLink('0x0A5B7706DcFb703Bc672e8Bbe0b672B12Ada69d4', ZeroAddress, '0.01')
              //   );
              // }}
            >
              {isLoading ? 'Creating Link ...' : 'Create Link'}
            </Button>

            <p className={classes.subheading}>
              Specify the amount. Receive a trustless payment link that allows recipients to claim
              the funds in any token on any blockchain.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;

// show dropdown. no model. list all token
