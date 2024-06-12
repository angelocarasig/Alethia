import { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';

import {
  Paragraph,
  ScrollView,
  Text,
  XStack,
  YStack,
  Image,
  H3,
  View,
  Button
} from 'tamagui';

import { SAMPLE_DATA } from 'lib/utils';

import { Manga } from 'types/manga/manga';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Book,
  ExternalLink,
  Loader,
  Palette,
  Pencil,
  RefreshCcw,
  Share
} from '@tamagui/lucide-icons';
import { useMangadex } from 'hooks/sources/useMangadex';

const MangaStack = () => {
  const { id } = useLocalSearchParams();
  const { loading, getManga, getRecent } = useMangadex();
  const [manga, setManga] = useState<Manga | null>(null);
  const [blurHeader, setBlurHeader] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [expandDescription, setExpandDescription] = useState(false);

  const screenHeight = Dimensions.get('window').height;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    getManga(id as string)
      .then(res => setManga(res))
  }, []);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.y;
    const size = e.nativeEvent.contentSize.height;
    const measurement = e.nativeEvent.layoutMeasurement.height;

    const scrollPercentage = (offset / (size - measurement)) * 100;

    if (scrollPercentage <= 45) {
      const transformedValue = (scrollPercentage / 45) * 100;
      setBlurHeader(transformedValue);
    }
  };

  const interpolateColor = (value: number) => {
    const alpha = Math.min(1, Math.max(0, value / 100));
    return `rgba(0, 0, 0, ${alpha})`;
  };

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
      <Image
        style={{ width: "100%", height: 650, position: "absolute" }}
        source={{ uri: manga.coverUrl }}>
      </Image>
      <LinearGradient
        colors={['transparent', '#000000']}
        locations={[0, 1]}
        end={{ x: 0.5, y: 0.7 }}
        dither={false}
        style={{
          width: "100%",
          height: 650,
          position: 'absolute'
        }}
      ></LinearGradient>
      <SafeAreaView>
        <ScrollView
          onScroll={handleScroll}
          contentContainerStyle={{
            alignItems: 'center',
          }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <YStack f={1} backgroundColor={interpolateColor(blurHeader)} paddingTop={screenHeight / 4} paddingHorizontal="$4" gap="$4">
            <View>
              <H3>{manga.title}</H3>
              <XStack gap="$2">
                {manga.author && (
                  <Text><Pencil size={16} /> {manga.author}</Text>
                )}

                {manga.artist && (
                  <Text><Palette size={16} /> {manga.artist}</Text>
                )}
              </XStack>
            </View>

            <XStack gap="$2" ai="center">
              <Button f={1} size="$3.5" icon={<Book size="$1" />}>Read Now</Button>
              <Button onPress={() => getRecent()} f={1} size="$3.5" icon={<RefreshCcw size="$1" />}>Tracking</Button>
              <ExternalLink pl="$4" />
              <Share />
            </XStack>

            <TouchableOpacity onPress={() => setExpandDescription(!expandDescription)}>
              <Paragraph numberOfLines={expandDescription ? undefined : 4}>
                {manga.description}
              </Paragraph>
            </TouchableOpacity>
            <XStack mt="$2" gap="$2" flexWrap="wrap">
              {manga.tags.map((tag, index) => (
                <Button key={index} size="$2">{tag.title}</Button>
              ))}
            </XStack>

          </YStack>
        </ScrollView>
      </SafeAreaView>
    </YStack>
  );
}

export default MangaStack;