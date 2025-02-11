import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { store, persistor } from './feature/store.tsx';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider value={defaultSystem}>
          <App />
        </ChakraProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
