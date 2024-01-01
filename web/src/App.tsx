import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

import { AppLayout } from './components';
import { Navigation } from './navigation';
import { theme } from './theme';
import { HashRouter } from 'react-router-dom';

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <HashRouter>
        <AppLayout>
          <Navigation />
        </AppLayout>
        </HashRouter>
    </MantineProvider>
  );
}
