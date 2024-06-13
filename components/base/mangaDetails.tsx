import { useCallback, useState } from 'react';
import {
  Dimensions,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity
} from 'react-native'

import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

import {
  Paragraph,
  ScrollView,
  Text,
  XStack,
  YStack,
  H3,
  View,
  Button,
  useTheme
} from 'tamagui';

import {
  ExternalLink,
  Heart,
  Palette,
  Pencil,
  PlusCircle,
  RefreshCcw,
  Share2
} from '@tamagui/lucide-icons';

import { Manga } from 'types/manga';
import useDatabase from 'hooks/useDatabase';
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';

interface MangaDetailProps {
  manga: Manga;
  blurHeader: number;
  setBlurHeader: (value: number) => void;
}

const MangaDetails = ({ manga, blurHeader, setBlurHeader }: MangaDetailProps) => {
  const theme = useTheme();
  const { addToLibrary, deleteFromLibrary, mangaInLibrary } = useDatabase();
  const [refreshing, setRefreshing] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [expandDescription, setExpandDescription] = useState(false);

  const screenHeight = Dimensions.get('window').height;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

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

  if (!manga) {
    return (
      <YStack f={1} jc="center" ai="center">
        <Text>No manga details found.</Text>
      </YStack>
    );
  }

  return (
    <>
      {imageLoading && (
        <MotiView
          transition={{
            type: 'timing',
          }}
          style={{ flex: 1, justifyContent: 'center' }}
          animate={{ backgroundColor: theme.background.val }}
        >
          <Skeleton width={'100%'} height={1000} />
        </MotiView>
      )}
      <Image
        style={{ width: "100%", height: 650, position: "absolute" }}
        source={{ uri: manga.coverUrl }}
        onLoad={() => setImageLoading(false)}
        onError={() => setImageLoading(false)}>
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
              {mangaInLibrary(manga) ?
                (
                  <Button themeInverse f={1} size="$3.5" icon={<Heart size="$1" />} onPress={() => { deleteFromLibrary(manga); Haptics.selectionAsync() }}>In Library</Button>
                ) : (
                  <Button onPress={() => { addToLibrary(manga); Haptics.selectionAsync() }} f={1} size="$3.5" icon={<PlusCircle size="$1" />}>Add To Library</Button>
                )}
              <Button onPress={() => Haptics.selectionAsync()} size="$3.5" icon={<RefreshCcw size="$1" />}>Tracking</Button>
              <XStack pl="$2" gap="$3">
                <ExternalLink pl="$4" onPress={() => openLink(manga.url)} />
                <Share2 />
              </XStack>
            </XStack>

            <TouchableOpacity onPress={() => {setExpandDescription(!expandDescription); Haptics.selectionAsync()}}>
              <Paragraph numberOfLines={expandDescription ? undefined : 6}>
                {manga.description || "No Description Available."}
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
    </>
  )
}

export default MangaDetails;