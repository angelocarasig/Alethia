import { useState } from 'react';
import { StyleSheet } from 'react-native'
import { Stack } from 'expo-router';
import { BlurView } from 'expo-blur';

import {
  Text,
  YStack,

} from 'tamagui';

import MangaDetails from 'components/base/mangaDetails';
import { useManga } from 'hooks/useManga';

const MangaStack = () => {
  const { selectedManga } = useManga();
  const [blurHeader, setBlurHeader] = useState(0);

  if (!selectedManga) {
    return (
      <YStack f={1} jc="center" ai="center">
        <Text>No details found.</Text>
      </YStack>
    );
  }

  return (
    <YStack>
      <Stack.Screen
        options={{
          headerBackTitle: "Library",
          headerBackButtonMenuEnabled: false,
          headerTitle: "",
          headerTransparent: true,
          headerBackground: () => (
            <BlurView
              tint="prominent"
              experimentalBlurMethod="dimezisBlurView"
              intensity={blurHeader}
              style={StyleSheet.absoluteFill} />
          ),
        }} />
      <MangaDetails manga={selectedManga} blurHeader={blurHeader} setBlurHeader={setBlurHeader} />
    </YStack>
  );
}

export default MangaStack;