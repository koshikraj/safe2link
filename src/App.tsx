import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

import { AppLayout } from "./components";
import { Navigation } from './navigation';
import { theme } from './theme';


export default function App() {
  return (
    <MantineProvider theme={theme}>
      <AppLayout>
      <Navigation />
      </AppLayout>
    </MantineProvider>
  );
}
