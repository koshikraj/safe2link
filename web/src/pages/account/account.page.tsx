import { Text, ActionIcon, Alert, Anchor, Avatar, Badge, Button, CopyButton, Divider, Input, Modal, Paper, Popover, rem, Tooltip, InputBase, Combobox, useCombobox, Group, TextInput, Skeleton } from '@mantine/core';
import classes from './account.module.css';
import { useEffect, useState } from 'react';
import useLinkStore from '@/store/link/link.store';
import { formatEther, parseEther, parseUnits, ZeroAddress } from 'ethers';
import { buildTransferToken, getTokenBalance, getTokenDecimals, publicClient } from '@/logic/utils';
import { createSafeAccount, sendTransaction } from '@/logic/permissionless';
import { createUser, loginUser } from '@/logic/auth';
import { useDisclosure } from '@mantine/hooks';
import { Icon2fa, IconCheck, IconChevronDown, IconCoin, IconConfetti, IconCopy, IconDownload, IconGif, IconGift, IconHomeDown, IconSend, IconTransferOut } from '@tabler/icons';
import { NetworkUtil } from '@/logic/networks';
import Confetti from 'react-confetti';
import { getIconForId, getTokenInfo, getTokenList, tokenList } from '@/logic/tokens';
import { send } from 'process';
import { getJsonRpcProvider } from '@/logic/web3';



export const AccountPage = () => {
  const { claimDetails, setClaimDetails} = useLinkStore((state: any) => state);
  
  const [ balance, setBalance ] = useState<any>(0);
  const [opened, { open, close }] = useDisclosure(false);
  const [sendModal, setSendModal] = useState(false);
  const [tokenValue, setTokenValue] = useState(0);
  const [sendAddress, setSendAddress] = useState('');
  const [sendSuccess, setSendSuccess] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [sendLoader, setSendLoader] = useState(false);
  const [walletName, setWalletName] = useState<string>('');
  const [ authenticating, setAuthenticating ] = useState(false);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [chainId, setChainId] = useState<number>(claimDetails.chainId);
  const [value, setValue] = useState<string>("0x0000000000000000000000000000000000000000");

  

  const availableTestChains = Object.keys(tokenList).filter(chainId => NetworkUtil.getNetworkById(
    Number(chainId)
  )?.type == 'testnet').map(
    (chainId: string) => 
    ({label: `${NetworkUtil.getNetworkById(Number(chainId))?.name}`, type: `${NetworkUtil.getNetworkById(
      Number(chainId)
    )?.type}`, image: getIconForId(chainId), value: chainId }))

    const availableMainnetChains = Object.keys(tokenList).filter(chainId => NetworkUtil.getNetworkById(
      Number(chainId)
    )?.type == 'mainnet').map(
      (chainId: string) => 
      ({label: `${NetworkUtil.getNetworkById(Number(chainId))?.name}`, type: `${NetworkUtil.getNetworkById(
        Number(chainId)
      )?.type}`, image: getIconForId(chainId), value: chainId }))
  
  
  const mainnetOptions = availableMainnetChains.map((item: any) => (
    <Combobox.Option value={item.value} key={item.value}>
      <SelectOption {...item} />
    </Combobox.Option>
  ));

  const testnetOptions = availableTestChains.map((item: any) => (
    <Combobox.Option value={item.value} key={item.value}>
      <SelectOption {...item} />
    </Combobox.Option>
  ));

  const options = (<Combobox.Options>
          <Combobox.Group >
            {mainnetOptions}
          </Combobox.Group>

          <Combobox.Group label="TESTNETS">
          {testnetOptions}
          </Combobox.Group>
        </Combobox.Options>)

  const chainCombobox = useCombobox({
    onDropdownClose: () => chainCombobox.resetSelectedOption(),
  });
  const tokenCombobox = useCombobox({
    onDropdownClose: () => tokenCombobox.resetSelectedOption(),
  });

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


  const selectedToken = getTokenInfo(chainId, value);

  const tokenOptions = getTokenList(chainId).map((item: any) => (
    <Combobox.Option value={item.value} key={item.value}>
      <TokenOption {...item} />
    </Combobox.Option>
  ));

  interface TokenProps extends React.ComponentPropsWithoutRef<'div'> {
    image: string
    label: string
    description: string
  }

   
  function TokenOption({ image, label }: TokenProps) {
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

  async function sendAsset() {

    let safeAccount = claimDetails.account;
    setSendLoader(true);
    try {
    if(await claimDetails.account.client.getChainId() != chainId) {

      safeAccount = await createSafeAccount(chainId, await loginUser())
      setClaimDetails({ account: safeAccount, amount: 0, chainId: chainId})

      
    }

    let parseAmount, data='0x', toAddress = sendAddress ;
    if(value == ZeroAddress) {
            parseAmount = parseEther(tokenValue.toString());
        } else {
          const provider = await getJsonRpcProvider(chainId.toString())
            parseAmount = parseUnits(tokenValue.toString(), await  getTokenDecimals(value, provider))
            data = await buildTransferToken(value, toAddress, parseAmount, provider)
            parseAmount = 0n;
            toAddress = value;
        }
    const result = await sendTransaction(chainId.toString(), toAddress, data, safeAccount, parseAmount)
    if (!result)
    setSendSuccess(false);
    else
    setSendSuccess(true);
    
    
  } catch(e) {
    console.log('error')
    setSendLoader(false);  
  }  
  setSendLoader(false);

  }



  useEffect(() => {
    (async () => {
      if(!claimDetails.account) {
        open();
      }
      
      setBalanceLoading(true);
      const provider = await getJsonRpcProvider(chainId.toString());

      if(value == ZeroAddress) {
        setBalance(formatEther(await provider.getBalance(claimDetails?.account?.address )))
        } else {
        setBalance(await getTokenBalance(value, claimDetails?.account?.address , provider))
        }
      setBalanceLoading(false);
      window.addEventListener('resize', () => setDimensions({ width: window.innerWidth, height: window.innerHeight }));

      
    })();
  }, [claimDetails.account, chainId, sendSuccess, value]);


  console.log(balance)
  
  function shortenAddress(address: any) {
    const start = address.slice(0, 7);
    const end = address.slice(-5);
    return `${start}...${end}`;
  }
  return (
    <>
    <Modal opened={opened} onClose={close} title="Authenticate your Account" centered>

<div className={classes.formContainer}>
      <div>
        <h1 className={classes.heading}>Authenticate in one click with PassKey</h1>
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
        variant="outline"
        size="lg" radius="md" 
        fullWidth
        color="green"
        style={{
          marginLeft: "20px"}}
        onClick={ async() => { const safeAccount = await createSafeAccount(chainId, await createUser(walletName))

          setClaimDetails({ account: safeAccount, amount: 0, chainId: chainId})
          close();

        }}
      
      >
      Create Account
      </Button>
      </div>

      <p className={classes.footerHeading}>
        This will create a new Safe Account (with 4337 module) created via passkey.
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
        size="lg" radius="md" 
        type="button"
        fullWidth
        color="green"
        className={classes.btn}
        loaderProps={{ color: 'white', type: 'dots', size: 'md' }}
        onClick={ async() => {  setAuthenticating(true); 
          
        try {  
        const safeAccount = await createSafeAccount(chainId, await loginUser())
        setClaimDetails({ account: safeAccount, amount: 0, chainId: chainId})
        close();
        } 
        catch(e) {

          setAuthenticating(false);

        }


        
        }}
        loading={ authenticating}
      >
      Login
      </Button>
      </div>   
      </div>
    </div>
  
</Modal>

<Modal opened={sendModal} onClose={()=>{ setSendModal(false); setSendSuccess(false); setValue(ZeroAddress);}} title="Transfer your crypto" centered>

<div className={classes.formContainer}>
      <div>
        <h1 className={classes.heading}>Send crypto anywhere</h1>
      </div>
      <p className={classes.subHeading}>
        Send your crypto gas free.
      </p>
      <div className={classes.inputContainer}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '20px',
                  alignItems: 'center',
                }}
              >
                  <Combobox
                        store={tokenCombobox}
                        withinPortal={false}
                        onOptionSubmit={(val) => {
                          setValue(val);
                          tokenCombobox.closeDropdown();
                        }}
                      >
                        <Combobox.Target>
                          <InputBase
                          style={{width: '50%'}}
                            component="button"
                            type="button"
                            pointer
                            rightSection={<Combobox.Chevron />}
                            onClick={() => tokenCombobox.toggleDropdown()}
                            rightSectionPointerEvents="none"
                            multiline
                          >
                            {selectedToken ? (
                              <TokenOption {...selectedToken} />
                            ) : (
                              <Input.Placeholder>Pick Token</Input.Placeholder>
                            )} 
                          </InputBase>
                        </Combobox.Target>

                        <Combobox.Dropdown>
                          <Combobox.Options>{tokenOptions}</Combobox.Options>
                        </Combobox.Dropdown>
                      </Combobox>

             
                <Input
                  style={{ width: '40%'}}
                  type="number"
                  size='lg'
                  value={tokenValue}
                  onChange={(e: any) => setTokenValue(e?.target?.value)}
                  placeholder="Value"
                  className={classes.input}
                />
                


              </div>
              <Text size="sm" style={{cursor: 'pointer'}} onClick={()=>{ setTokenValue(balance)}}>
              { balanceLoading ? <Skeleton height={15} width={90} mt={6} radius="xl" /> : `Balance: ${balance} ${getTokenInfo(chainId, value)?.label}` } 
              </Text>

              <Input
                  type="string"
                  style={{ marginTop: '20px'}}
                  size='lg'
                  value={sendAddress}
                  onChange={(e: any) => setSendAddress(e?.target?.value)}
                  placeholder="Recipient Address"
                  className={classes.input}
                />

            </div>
            
              <Button
              size="lg" radius="md" 
              style={{marginBottom: '20px'}}
              fullWidth
              color="green"
              className={classes.btn}
              onClick={() => sendAsset()}
              loaderProps={{ color: 'white', type: 'dots', size: 'md' }}
              loading={sendLoader}
            >
              Send Now
            </Button>


      { sendSuccess && <Alert variant="light" color="lime" radius="md" title="Transfer Successful" icon={<IconConfetti/>}>
      Your crypto assets have safely landed in the Success Galaxy. Buckle up for a stellar financial journey! 🚀💰
    </Alert>
      }
            
    </div>
  
</Modal>

    <Paper className={classes.accountContainer} shadow="md" withBorder radius="md" p="xl" >
      
      <div className={classes.formContainer}>
     { Boolean(claimDetails.amount) && <Alert variant="light" color="green" radius="md" title="" icon={<IconGift />}>
        <b>{ `Successfully claimed  ${claimDetails.amount ? claimDetails.amount : 0}  ${getTokenInfo(claimDetails.chainId, claimDetails.token)?.label} from the link 🎉` }</b>
    </Alert> }
        <div className={classes.avatarContainer}>
          <img
            className={classes.avatar}
            src="https://pbs.twimg.com/profile_images/1643941027898613760/gyhYEOCE_400x400.jpg"
            alt="avatar"
            height={100}
            width={100}
          />
           <div className={classes.balanceContainer}>
         <Anchor href={`${NetworkUtil.getNetworkById(chainId)?.blockExplorer}/address/${claimDetails.account?.address}`} target="_blank" underline="hover">  <p> { shortenAddress( claimDetails.account?.address ? claimDetails.account?.address : ZeroAddress)}</p>
          </Anchor>
          <CopyButton value={claimDetails.account?.address} timeout={1000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                  <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                    {copied ? (
                      <IconCheck style={{ width: rem(16) }} />
                    ) : (
                      <IconCopy style={{ width: rem(16) }} />
                    )}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
            </div>

                   <Combobox
                        store={chainCombobox}
                        withinPortal={false}
                        onOptionSubmit={(val) => {
                          setChainId(Number(val));
                          chainCombobox.closeDropdown();
                        }}
                      >
                        <Combobox.Target>
                        <Badge
                                pl={0}
                                style={{ cursor: 'pointer', width: '200px', height: '40px', padding: '10px'}} 
                                
                                color="gray"
                                variant="light"
                                leftSection={
                                  <Avatar alt="Avatar for badge" size={24} mr={5} src={getIconForId(chainId)} />
                                }
                                rightSection={
                                  <IconChevronDown size={20} />
                                }
                                size="lg"
                                // className={classes.network}
                                // checked={false}
                                onClick={() => chainCombobox.toggleDropdown()}
                              > 
                                {`${NetworkUtil.getNetworkById(Number(chainId))?.name}`}
                </Badge>
                        </Combobox.Target>

                        <Combobox.Dropdown>
                          <Combobox.Options>{options}</Combobox.Options>
                        </Combobox.Dropdown>
                      </Combobox>


          <p className={classes.balance}>  { balanceLoading ? <Skeleton height={20} width={110} mt={6} radius="xl" /> : `${balance} ${getTokenInfo(chainId, ZeroAddress).label}` }   </p>
          
          
        </div>

        <div className={classes.actionsContainer}>

      
          <div className={classes.actions}>
            <Button size="lg" radius="md" style={{ width: '110px' }} className={classes.btn} color="teal" onClick={()=> setSendModal(true)}>
              Send
            </Button>
            <Button size="lg" radius="md"
                color={ "#49494f" }
                disabled
                variant={ "filled" } 
                style={{
                  // backgroundColor: "#20283D"
                }}>Swap</Button>
          </div>
        </div>
      </div>
    </Paper>
    {  Boolean(claimDetails.amount) && <Confetti width={dimensions.width} height={dimensions.height} /> }
    </>
  );
};
