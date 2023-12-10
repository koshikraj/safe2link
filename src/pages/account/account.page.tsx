import { Button } from '@mantine/core';
import classes from './account.module.css';
import { useState } from 'react';

export const AccountPage = () => {
  const [test, setTest] = useState();

  function shortenAddress(address: string) {
    const start = address.slice(0, 6);
    const end = address.slice(-4);
    return `${start}...${end}`;
  }
  return (
    <div className={classes.accountContainer}>
      <div className={classes.formContainer}>
        <div className={classes.avatarContainer}>
          <img
            className={classes.avatar}
            src="https://pbs.twimg.com/profile_images/1643941027898613760/gyhYEOCE_400x400.jpg"
            alt="avatar"
            height={100}
            width={100}
          />
          <p>{shortenAddress('0x9ccca0a968a9bc5916e0de43ea2d68321655ae67')}</p>
        </div>

        <div className={classes.actionsContainer}>
          <p className={classes.balance}> balance : 0.01 ETH</p>
          <div className={classes.actions}>
            <Button style={{ width: '110px' }} className={classes.btn} color="teal">
              Send
            </Button>
            <Button style={{ width: '110px' }}>Withdraw</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
