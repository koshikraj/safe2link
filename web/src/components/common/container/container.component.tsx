import { Dialog, Notification, useMantineTheme } from '@mantine/core';
import { IconCheck } from '@tabler/icons';
import useLinkStore from '../../../store/link/link.store';
import styled from 'styled-components';

const StyledContainer = styled.div`
  margin: 0 auto;
  background-color: 'light-dark(var(--mantine-color-black),var(--mantine-color-white));',
  @media (max-width: 900px) {
    max-width: '100%';
  }
`;

interface ContainerComponentProps {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerComponentProps> = (props) => {
  const { children } = props;
  const theme = useMantineTheme();

  const { confirming, confirmed } = useLinkStore((state: any) => state);

  return (
    <StyledContainer>
      <Dialog
        position={{ bottom: 20, right: 100 }}
        opened={confirming}
        withCloseButton
        size="lg"
        radius="md"
        style={{
          // backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
          backgroundColor: 'light-dark(var(--mantine-color-black),var(--mantine-color-white));',
        }}
      >
        <Notification
          withBorder={false}
          withCloseButton={false}
          style={{
            margin: 10,
            // backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
            backgroundColor: 'light-dark(var(--mantine-color-black),var(--mantine-color-white));',
          }}
          loading
          title="Confirming the transaction"
        >
          Waiting for the transaction to get confirmed
        </Notification>
      </Dialog>

      <Dialog
        position={{ bottom: 20, right: 100 }}
        opened={confirmed}
        withCloseButton
        size="lg"
        radius="md"
        style={{
          // backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
          backgroundColor: 'light-dark(var(--mantine-color-black),var(--mantine-color-white));',
        }}
      >
        <Notification
          withBorder={false}
          withCloseButton={false}
          style={{
            margin: 10,
            // backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
            backgroundColor: 'light-dark(var(--mantine-color-black),var(--mantine-color-white));',
          }}
          // icon={<IconCheck size="1.1rem" />} color="teal"
          title="Transaction confirmed!"
        >
          Transaction has been confirmed now
        </Notification>
      </Dialog>

      {children}
    </StyledContainer>
  );
};
