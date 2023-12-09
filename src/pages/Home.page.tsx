import { useCallback, useEffect, useState } from 'react';
import { Button, Center, Container, Input, Paper, Select, Stack } from '@mantine/core';
import { SafeAuthPack, SafeAuthConfig, SafeAuthInitOptions } from '@safe-global/auth-kit';
import classes from './Home.module.css';

import { NetworkUtil } from '../logic/networks';
import { useSafeAuth } from '@/context';

function HomePage() {
  // const [authState, setAuthState] = useState(null);
  // const fetchData = useCallback(async () => {
  //   try {
  //     const safeAuthConfig: SafeAuthConfig = {
  //       txServiceUrl: 'https://safe-transaction-goerli.safe.global',
  //     };

  //     const safeAuthInitOptions: SafeAuthInitOptions = {
  //       enableLogging: true,
  //       buildEnv: 'production',
  //       showWidgetButton: false,
  //       chainConfig: {
  //         chainId: '0x5',
  //         rpcTarget: NetworkUtil.getNetworkById(5)?.url!,
  //       },
  //     };

  //     const safeAuthPack = new SafeAuthPack(safeAuthConfig);
  //     await safeAuthPack.init(safeAuthInitOptions);
  //     //@ts-ignore
  //     setAuthState(safeAuthPack);
  //     // const signInInfo = await safeAuthPack?.signIn();
  //   } catch (e) {
  //     console.warn(e);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  // const loginHandle = async () => {
  //   try {
  //     //@ts-ignore
  //     const signInInfo = await authState?.signIn();

  //     console.log('signin info', signInInfo);
  //   } catch (error) {
  //     console.log('something went wrong....');
  //   }
  // };

  const { signIn } = useSafeAuth();

  return (
    <Container>
      <Container className={classes.homeScreenContainer}>
        <Container
          style={{
            padding: 0,
            marginTop: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Paper
            className={classes.innerContainer}
            shadow="xl"
            withBorder
            radius="md"
            p="xl"
            style={{
              marginTop: 30,
              // width: 700
            }}
          >
            <div style={{ padding: 0, display: 'flex', justifyContent: 'center' }}>
              <img className={classes.heroImage} />
            </div>
            <div
              style={{
                paddingLeft: 80,
                paddingRight: 80,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <p className={classes.p}>Share your crypto with link</p>
            </div>

            <div
              style={{
                padding: 0,
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <img className={classes.heroImage} />
            </div>
            <div style={{ padding: 0, display: 'flex', justifyContent: 'center' }}>
              <Button
                onClick={signIn}
                size="lg"
                radius="md"
                color="#20283D"
                variant="filled"
                style={{
                  backgroundColor: '#20283D',
                }}
              >
                Get Started
              </Button>
            </div>
          </Paper>
        </Container>
        <div className={classes.actionsContainer} />
      </Container>
    </Container>
  );
}

export default HomePage;
