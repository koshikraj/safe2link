import { useCallback, useEffect, useState } from 'react';
import { Button, Center, Container, Input, Paper, Select, Stack } from "@mantine/core";
import classes from "./Home.module.css";

import {
  SafeAuthPack,
  SafeAuthConfig,
  SafeAuthInitOptions,
} from '@safe-global/auth-kit'
import { NetworkUtil } from '../logic/networks';

import { createLink } from '../logic/module';
import { ZeroAddress } from 'ethers';


function HomePage() {



  const fetchData = useCallback(async () => {
    try {


      const safeAuthConfig: SafeAuthConfig = {
                    txServiceUrl: "https://safe-transaction-goerli.safe.global",
                };


      const safeAuthInitOptions: SafeAuthInitOptions = {
        enableLogging: true,
        buildEnv: "production",
        showWidgetButton: false,
        chainConfig: {
          chainId: '0x5',
          rpcTarget: NetworkUtil.getNetworkById(5)?.url!
        },
      }
      
      // You can also pass the SafeAuthConfig as a parameter to the SafeAuthPack constructor if you are using a custom txServiceUrl domain
      // e.g. const safeAuthConfig: SafeAuthConfig = {
      //   txServiceUrl: 'https://safe-transaction-mainnet.safe.global'
      // }
      const safeAuthPack = new SafeAuthPack(safeAuthConfig)
      // await safeAuthPack.init(safeAuthInitOptions)
      // const signInInfo = await safeAuthPack?.signIn();
      

      
    } catch (e) {
      console.warn(e)
    }
  }, [])

  
  useEffect(() => {
      fetchData();
  }, [fetchData])


  return (

    <Container>
    <Container className={classes.homeScreenContainer}>
      <Container style={{ padding: 0, marginTop: "150px", display: "flex", alignItems: "center",  justifyContent: "center"}}>
      <Paper className={classes.innerContainer} shadow="xl" withBorder radius="md" p="xl" style={{
                    marginTop: 30, 
                    // width: 700
                  }}>
      <div style={{ padding: 0,  display: "flex",  justifyContent: "center"}}>
       <img className={classes.heroImage}  />
          </div>
        <div style={{ paddingLeft: 80,  paddingRight: 80,  display: "flex",  justifyContent: "center"}}>
        <p className={classes.p}>Share your crypto with link</p> 
      </div>
      
      <div style={{ padding: 0,  display: "flex",  justifyContent: "center", marginBottom: "20px"}}>
       <img className={classes.heroImage}  />
          </div>
      <div style={{ padding: 0,  display: "flex",  justifyContent: "center"}}>
        
      
      <Button
                onClick={async () => { console.log(await createLink('0x0A5B7706DcFb703Bc672e8Bbe0b672B12Ada69d4', ZeroAddress, "0.01"))  }}
                size="lg"
                radius="md"
                color={ "#20283D" }
                variant={ "filled"  }
                style={{
                  backgroundColor: "#20283D"
                }}
              >
                Get Started
              </Button>
      </div>
      
       </Paper>
      </Container>
      <div className={classes.actionsContainer}>

      </div>

    </Container>
  </Container>
  );
}


export default HomePage;
