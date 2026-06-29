import { ShareIntentProvider } from 'expo-share-intent';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { AppProviders } from './src/providers/AppProviders';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <KeyboardProvider>
      <ShareIntentProvider>
        <AppProviders>
          <RootNavigator />
        </AppProviders>
      </ShareIntentProvider>
    </KeyboardProvider>
  );
}
