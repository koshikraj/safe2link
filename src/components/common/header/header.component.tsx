//@ts-nocheck
import {
  Group,
  Image,
  ThemeIcon,
  Avatar,
  useMantineTheme,
  AppShell,
  Burger,
  Chip,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { ActionIcon, Switch, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoonStars, IconBrandDiscord, IconBrandGithub } from '@tabler/icons';
import { useState, useEffect } from 'react';
import { Badge } from '@mantine/core';
import LogoLight from '../../../assets/logo/logo-light.svg';
import LogoDark from '../../../assets/logo/logo-dark.svg';
import Base from '../../../assets/icons/base.png';
import ETH from '../../../assets/icons/eth.svg';
import Gnosis from '../../../assets/icons/gno.svg';
import { RoutePath } from '../../../navigation/route-path';
import { NetworkUtil } from '../../../logic/networks';

import useLinkStore from '../../../store/link/link.store';
import { getProvider } from '../../../logic/web3';
import classes from './header.component.module.css';

const badgeIcons = [
  { ids: ['84531'], img: Base },
  { ids: ['11155111', '5', '1'], img: ETH },
  { ids: ['100'], img: Gnosis },
  // Add more mappings as needed
];

function getIconForId(id) {
  for (const icon of badgeIcons) {
    if (icon.ids.includes(id.toString())) {
      return icon.img;
    }
  }
  // Return a default icon or handle the case when no mapping is found
  return 'defaultIcon';
}

export const Head = (props) => {
  const { setOpened, opened } = props;
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const [network, setNetwork] = useState('');
  const [chainId, setChainId] = useState(84531);

  const {} = useLinkStore((state: any) => state);
  const dark = colorScheme === 'dark';

  // const [ opened, setOpened ] = useState(false);

  // const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const provider = await getProvider();

      const { chainId } = await provider.getNetwork();
      setChainId(chainId);
      setNetwork(
        `${NetworkUtil.getNetworkById(parseInt(chainId))?.name} ${NetworkUtil.getNetworkById(
          parseInt(chainId)
        )?.type}`
      );
    })();
  }, []);

  return (
    <AppShell.Header>
      <nav className={classes.nav}>
        <div className={classes.wrapper}>
          <Group position="apart" className={classes.maincontainer}>
            <Group className={classes.container}>
              <Image
                onClick={() => {
                  navigate(RoutePath.home);
                }}
                style={{ cursor: 'pointer', width: '200px' }}
                src={dark ? LogoDark : LogoLight}
                alt="Logo"
              />
            </Group>

            <Group className={classes.mode}>
              <Badge
                pl={0}
                color="gray"
                variant="light"
                leftSection={
                  <Avatar alt="Avatar for badge" size={24} mr={5} src={getIconForId(chainId)} />
                }
                size="lg"
                className={classes.network}
                checked={false}
                icon={<IconSun />}
              >
                {network}
              </Badge>

              {/* <Group className={classes.container} position="center"> */}
              <div className={classes.container}>
                {dark ? (
                  <IconSun
                    size={24}
                    stroke={1.5}
                    onClick={() => toggleColorScheme()}
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <IconMoonStars
                    size={24}
                    stroke={1.5}
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleColorScheme()}
                  />
                )}
              </div>
              {/* </Group> */}
            </Group>
          </Group>

          {/* </div> */}
        </div>
      </nav>
    </AppShell.Header>
  );
};
