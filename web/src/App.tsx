import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

import { AppLayout } from './components';
import { Navigation } from './navigation';
import { theme } from './theme';
import { AuthProvider } from './context';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <AuthProvider>
        <AppLayout>
          <Navigation />
        </AppLayout>
      </AuthProvider>
    </MantineProvider>
  );
}
