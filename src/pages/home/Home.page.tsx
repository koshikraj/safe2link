import { useCallback, useEffect, useState } from 'react';
import { Button, Center, Container, Input, Modal, Paper, Select, Stack } from '@mantine/core';
import { SafeAuthPack, SafeAuthConfig, SafeAuthInitOptions } from '@safe-global/auth-kit';
import classes from './Home.module.css';

import { NetworkUtil } from '../../logic/networks';
import { useSafeAuth } from '@/context';
import { useDisclosure } from '@mantine/hooks';
import { createLink } from '../../logic/module';
import { ZeroAddress } from 'ethers';

function HomePage() {
  const [opened, { open, close }] = useDisclosure(false);

  const { signIn } = useSafeAuth();

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
      <Modal opened={opened} onClose={close} title="Authentication" centered>
        {/* Modal content */}
        <h1>model</h1>
      </Modal>
      <div className={classes.homeContainer}>
        <div className={classes.formContainer}>
          <div>
            <h1>Send crypto effortlessly with Safe2Link!</h1>
            <p>
              Select your preferred blockchain, specify the amount, and confirm the transaction.
              Receive a trustless payment link that allows recipients to claim the funds in any
              token on any blockchain. Seamless and secure transactions made simple.
            </p>
          </div>
          <div>
            <input type="text" placeholder="enter the value" />

            <div onClick={open}>Select Token</div>
          </div>
          <button type="button" onClick={async () => { console.log(await createLink('0x0A5B7706DcFb703Bc672e8Bbe0b672B12Ada69d4', ZeroAddress, "0.01"))  }}>Send</button>
          <p className="helperText">something....</p>
        </div>
      </div>
    </>
  );
}

export default HomePage;
