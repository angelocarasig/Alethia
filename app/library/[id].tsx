import { useState } from 'react';
import { StyleSheet } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';

import {
  Text,
  YStack,

} from 'tamagui';

import useDatabase from 'hooks/useDatabase';
import MangaDetails from 'components/base/mangaDetails';

const MangaStack = () => {
  const { id } = useLocalSearchParams();
  const { getManga } = useDatabase();
  const manga = getManga(id as string);

  const [blurHeader, setBlurHeader] = useState(0);

  if (!manga) {
    return (
      <YStack f={1} jc="center" ai="center">
        <Text>No manga details found.</Text>
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
      <MangaDetails manga={manga} blurHeader={blurHeader} setBlurHeader={setBlurHeader} />
    </YStack>
  );
}

export default MangaStack;