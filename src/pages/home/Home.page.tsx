import { useCallback, useEffect, useState } from 'react';
import {
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

function HomePage() {
  const [opened, { open, close }] = useDisclosure(false);

  const [mock, setMock] = useState({});

  const [tokenValue, setTokenValue] = useState('0');
  const [seletcedToken, setSelectedToken] = useState<string | null>('');

  const [seletcedNetwork, setSelectedNetwork] = useState<string | null>('');
  // { i: Number(index), p: randomSeed, c: chainId }
  const { signIn, accountInfo, getChainId, network } = useSafeAuth();
  console.log('account info', accountInfo);

  const [isLinkCreated, setIsLinkCreated] = useState(false);
  const [sharableLink, setSharableLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const create = async () => {
    setIsLinkCreated(true);
    setIsLoading(true);
    const apiUrl = 'http://localhost:5721';
    const obj = { i: 659, p: 'hZuTKaw5CaI3TfEF', c: 10 };
    //@ts-ignore
    const queryString = new URLSearchParams(obj)?.toString();
    const url = `${apiUrl}/claim#${queryString}`;

    console.log('url', url);
    setSharableLink(url);
    setIsLinkCreated(false);
    setIsLoading(false);
  };

  console.log('seletced network', seletcedNetwork, seletcedToken, tokenValue);

  return (
    <>
      {sharableLink.length > 0 ? (
        <>
          <Confetti width={2000} height={1200} />
          <div className={classes.successContainer}>
            <div className={classes.formContainer}>
              <h1 className={classes.heading}>Yay!!!</h1>

              <p className={classes.subheading}>
                Share this link with Anyone, so that they can claim the funds
              </p>

              <div className={classes.copyContainer}>
                <Input style={{ width: '400px' }} value={sharableLink} disabled />
                <CopyButton value={sharableLink}>
                  {({ copied, copy }) => (
                    <Button color={copied ? 'green' : 'teal'} onClick={copy}>
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
              <Input.Wrapper label="Enter Value">
                <Input
                  type="number"
                  value={tokenValue}
                  onChange={(e) => setTokenValue(e?.target?.value)}
                  placeholder="enter the value"
                  className={classes.input}
                />
              </Input.Wrapper>

              <Select
                label="Select the Token"
                placeholder="Select the token"
                data={['USDT', 'Matic', 'ETH', 'FIL']}
                value={seletcedToken}
                onChange={setSelectedToken}
              />
              <Select
                label="Select Network"
                placeholder={network}
                data={['Base', 'Goerli', 'Opmitism', 'Celo']}
                value={seletcedNetwork}
                disabled
                onChange={setSelectedNetwork}
              />
            </div>
            <Button
              type="button"
              fullWidth
              color="green"
              className={classes.btn}
              onClick={create}
              // onClick={async () => {
              //   setMock({ i: 0, p: 'randomSeed', c: 1 });
              //   console.log(
              //     'click'
              //     // await createLink('0x0A5B7706DcFb703Bc672e8Bbe0b672B12Ada69d4', ZeroAddress, '0.01')
              //   );
              // }}
            >
              {isLoading ? 'Creating Link' : 'Create Link'}
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
