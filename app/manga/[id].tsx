import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';

import { Text, YStack } from 'tamagui';

import { Manga } from 'types/manga/manga';
import { Loader } from '@tamagui/lucide-icons';
import { useMangadex } from 'hooks/sources/useMangadex';
import MangaDetails from 'components/base/mangaDetails';

const MangaStack = () => {
  const { id } = useLocalSearchParams();
  const { loading, getManga } = useMangadex();
  const [manga, setManga] = useState<Manga | null>(null);
  const [blurHeader, setBlurHeader] = useState(0);

  useEffect(() => {
    getManga(id as string)
      .then(res => setManga(res))
  }, []);

  if (loading) {
    return (
      <Loader />
    )
  }

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
          headerBackTitle: "Browse",
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