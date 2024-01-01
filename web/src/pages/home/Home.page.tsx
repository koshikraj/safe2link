import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Text,
  Group,
  Input,
  Paper,
  Select,
  useMantineColorScheme,
  Combobox,
  useCombobox,
  InputBase,
  Anchor,
  Alert,
} from '@mantine/core';
import classes from './Home.module.css';
import ETHIndia from '../../assets/images/ethindia.svg';
import Safe from '../../assets/images/safe.svg';

import { NetworkUtil } from '../../logic/networks';
import { useDisclosure } from '@mantine/hooks';
import { createLink } from '../../logic/module';
import { ZeroAddress } from 'ethers';

import Confetti from 'react-confetti';
import { IconBrandGithub, IconCoin, IconCurrency, IconMoneybag, IconWallet} from '@tabler/icons';


import { useNavigate } from 'react-router-dom';
import { getProvider } from '@/logic/web3';
import { badgeIcons, getIconForId, getTokenInfo, getTokenList, tokenList } from '@/logic/tokens';

import {CopyToClipboard} from 'react-copy-to-clipboard';
import { getSafeInfo } from '@/logic/safeapp';
import { getTokenBalance } from '@/logic/utils';
import { formatEther } from 'viem';
import { IconBrandTwitterFilled, IconBrandX } from '@tabler/icons-react';



function HomePage() {
  const [opened, { open, close }] = useDisclosure(false);
  


  const { colorScheme } = useMantineColorScheme();

  const dark = colorScheme === 'dark';

  const [tokenValue, setTokenValue] = useState('0');
  const [seletcedToken, setSelectedToken] = useState<string | null>('');

  const [seletcedNetwork, setSelectedNetwork] = useState<string | null>('');
  const [network, setNetwork] = useState('');
  const [chainId, setChainId] = useState(5);

  const [isLinkCreated, setIsLinkCreated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sharableLink, setSharableLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [safeError, setSafeError] = useState(false);


  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [value, setValue] = useState<string>("0x0000000000000000000000000000000000000000");
  const [ balance, setBalance ] = useState<any>(0);

  const selectedOption = getTokenInfo(chainId, value);

  const options = getTokenList(chainId).map((item: any) => (
    <Combobox.Option value={item.value} key={item.value}>
      <SelectOption {...item} />
    </Combobox.Option>
  ));

  interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    image: string
    label: string
    description: string
  }


  function SelectOption({ image, label }: ItemProps) {
    return (
      <Group style={{width: '100%'}}>
        <Avatar src={image} >
        <IconCoin size="1.5rem" />
        </Avatar>
        <div >
          <Text fz="sm" fw={500}>
            {label}
          </Text>
        </div>
      </Group>
    );
  }




  const create = async () => {
    setIsLoading(true);
    try {
      // try {
      const result = await createLink(
        value,
        tokenValue
      );
      // }
      // catch(e) {
      //   setSafeError(true);
      // }
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
      setSafeError(true);
    }
    setIsLinkCreated(true);
  };

 
  useEffect(() => {
    (async () => {
      const provider = await getProvider();

      const chainId = (await provider.getNetwork()).chainId;

      setChainId(Number(chainId));
      setNetwork(
        `${NetworkUtil.getNetworkById(Number(chainId))?.name}`
      );

      try {
        const safeInfo = await getSafeInfo();
        if(value == ZeroAddress) {
        setBalance(formatEther(await provider.getBalance(safeInfo?.safeAddress)))
        } else {
        setBalance(await getTokenBalance(value, safeInfo?.safeAddress, provider))
        }
        }
        catch(e)
        {
          console.log('No safe found')
        }
        
    })();
  }, [value]);

  return (
    <>
      {sharableLink.length > 0 ? (
        <>
          <Confetti width={2000} height={1200} />
          <div className={classes.successContainer}>
            <Paper className={classes.formContainer} shadow="md" withBorder radius="md" >
              <h1 className={classes.heading}>Link is Ready!</h1>

              <p className={classes.subheading} style={{ textAlign: 'center' }}>
                
               Safeguard this link and share it with those you trust to spread the crypto love ❤️ ❤️
              </p>

              <div className={classes.copyContainer}>
                <Input
                  className={classes.input}
                  // style={{ width: '400px' }}
                  value={sharableLink}
                  placeholder={sharableLink}
                />
            
              </div>
              <div className={classes.actions}>
            
            <Button size="lg" radius="md"
              onClick={() => setSharableLink('')}
             style={{ width: '180px' }}        
                color={ dark ? "#49494f" : "#c3c3c3" } 
                variant={ "filled" } 
               >Create New</Button>
               <CopyToClipboard text={sharableLink}
                onCopy={() => setCopied(true)}>
          <Button size="lg" radius="md" style={{ width: '180px' }}  color="teal">
          {copied ? 'Link Copied' : 'Copy Link'}
            </Button>
            </CopyToClipboard >
          </div>
              {/* <div className={classes.goBack}>
                <Button variant="primary" onClick={() => setSharableLink('')}>
                  Create new Link
                </Button>
              </div> */}
            </Paper>
          </div>
        </>
      ) : (
        <>
        
        <div>      
              <h1 className={classes.heading}>Share crypto from your
              <div className={classes.safeContainer}>
              <img
            className={classes.safe}
            src={Safe}
            alt="avatar"
          />
          </div>
          

            </h1>
            <h1 className={classes.links}>via links 🔗

            </h1>
            </div>
        
        <div className={classes.homeContainer}>

        <Paper className={classes.formContainer} shadow="md" withBorder radius="md" p="xl" >

        { !Object.keys(tokenList).includes(chainId.toString()) && <Alert variant="light" color="yellow" radius="lg" title="Unsupported Network">
      Safe2Link is supports only these networks as of now <b> : <br/> {Object.keys(tokenList).map((chainId) => `${NetworkUtil.getNetworkById(Number(chainId))?.name} ${NetworkUtil.getNetworkById(Number(chainId))?.type}, `)} </b>
    </Alert> }

    { safeError && <Alert variant="light" color="yellow" radius="lg" title="Open as Safe App">

     Try this application as a <span/>
      <Anchor href="https://app.safe.global/share/safe-app?appUrl=https://safe2link.xyz&chain=sep">
      Safe App
        </Anchor> <span/>
        on Safe Wallet.
      
    </Alert> }
          
          
          
          {/* <div className={classes.formContainer}> */}
            
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
                  <Combobox
                        store={combobox}
                        withinPortal={false}
                        onOptionSubmit={(val) => {
                          setValue(val);
                          combobox.closeDropdown();
                        }}
                      >
                        <Combobox.Target>
                          <InputBase
                          style={{width: '50%'}}
                            component="button"
                            type="button"
                            pointer
                            rightSection={<Combobox.Chevron />}
                            onClick={() => combobox.toggleDropdown()}
                            rightSectionPointerEvents="none"
                            multiline
                          >
                            {selectedOption ? (
                              <SelectOption {...selectedOption} />
                            ) : (
                              <Input.Placeholder>Pick value</Input.Placeholder>
                            )} 
                          </InputBase>
                        </Combobox.Target>

                        <Combobox.Dropdown>
                          <Combobox.Options>{options}</Combobox.Options>
                        </Combobox.Dropdown>
                      </Combobox>

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

              <Input.Wrapper label={`Enter Value (Balance: ${balance})`}>
                <Input
                  type="number"
                  size="lg"
                  value={tokenValue}
                  onChange={(e) => setTokenValue(e?.target?.value)}
                  placeholder="enter the value"
                  className={classes.input}
                />
              </Input.Wrapper>
            </div>
            <Button
              size="lg" radius="md" 
              fullWidth
              color="green"
              className={classes.btn}
              onClick={create}
              loaderProps={{ color: 'white', type: 'dots', size: 'md' }}
              loading={isLoading}
            >
              {isLoading ? 'Creating Link ...' : 'Create Link'}
            </Button>
       

            <p className={classes.subHeading}>
              Just select the amount and asset to create a payment link 🔗 . The funds won't leave your account untill claimed ✨
            </p>
          </Paper>
          
        </div>
       
        <div className={classes.avatarContainer}>
        <Anchor href="https://x.com/rajkoshik/status/1734166408794394693?s=20" target="_blank" >
        <img
            className={classes.avatar}
            src={ETHIndia}
            alt="avatar"
            height={100}
            width={100}
          />
          </Anchor>
                    <Group className={classes.mode}>
              {/* <Group className={classes.container} position="center"> */}
              <IconBrandX 
                    size={30}
                    stroke={1.5}
                    onClick={() => window.open("https://x.com/safe2link")}
                    style={{ cursor: 'pointer' }}
                  />
              <IconBrandGithub
                size={30}
                stroke={1.5}
                onClick={() => window.open("https://github.com/koshikraj/safe2link")}
                style={{ cursor: 'pointer' }}
              />
      
              {/* </Group> */}
            {/* </Group> */}
          </Group>
          </div>
     
        </>
      )}
    </>
  );
}

export default HomePage;

// show dropdown. no model. list all token
