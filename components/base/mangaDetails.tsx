import { useEffect, useState } from 'react';
import {
  Dimensions,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';

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
  useTheme,
  ListItem,
  YGroup,
  Separator,
} from 'tamagui';

import {
  ChevronDown,
  DownloadCloud,
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
import { useMangadex } from 'hooks/sources/useMangadex';
import { FlashList } from '@shopify/flash-list';

interface MangaDetailProps {
  manga: Manga;
  blurHeader: number;
  setBlurHeader: (value: number) => void;
}

const MangaDetails = ({ manga, blurHeader, setBlurHeader }: MangaDetailProps) => {
  const theme = useTheme();
  const { addToLibrary, deleteFromLibrary, mangaInLibrary } = useDatabase();
  const [imageLoading, setImageLoading] = useState(true);
  const [expandDescription, setExpandDescription] = useState(false);
  const [chapters, setChapters] = useState<Array<any>>([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const { getChapters } = useMangadex();

  const screenHeight = Dimensions.get('window').height;

  const fetchChapters = async () => {
    setLoadingChapters(true);
    try {
      const chapters = await getChapters(manga);
      setChapters(chapters);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    } finally {
      setLoadingChapters(false);
    }
  }

  useEffect(() => {
    fetchChapters();
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

  const styles = StyleSheet.create({
    coreDetails: {
      flex: 1,
      backgroundColor: interpolateColor(blurHeader),
      paddingTop: screenHeight / 4,
      paddingHorizontal: 12,
      gap: 12
    },
    moreDropdown: {
      position: 'absolute',
      bottom: -30,
      right: 0,
      fontSize: 14,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center'
    }
  })

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
          <Skeleton width={'100%'} height={650} />
        </MotiView>
      )}
      <Image
        style={{ width: "100%", height: 650, position: "absolute" }}
        source={{ uri: manga.coverUrl }}
        onLoad={() => setImageLoading(false)}
        onError={() => setImageLoading(false)}
      />
      <LinearGradient
        colors={['transparent', theme.background.val]}
        locations={[0, 1]}
        end={{ x: 0.5, y: 0.6 }}
        dither={false}
        style={{
          width: "100%",
          height: 650,
          position: 'absolute'
        }}
      />
      <SafeAreaView>
        <ScrollView
          onScroll={handleScroll}
          contentContainerStyle={{ alignItems: 'center' }}
          refreshControl={<RefreshControl refreshing={loadingChapters} onRefresh={fetchChapters} />}
        >
          <YStack style={styles.coreDetails}>
            <View style={{ gap: 4 }}>
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

            <TouchableWithoutFeedback onPress={() => { setExpandDescription(!expandDescription); Haptics.selectionAsync() }}>
              <View animation="bouncy" style={{ flex: 1, position: 'relative' }}>
                <Paragraph userSelect='none' numberOfLines={expandDescription ? undefined : 6}>
                  {manga.description || "No Description Available."}
                </Paragraph>
                {!expandDescription && (
                  <View style={styles.moreDropdown}>
                    <Paragraph>More</Paragraph>
                    <ChevronDown />
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>

            <XStack mt="$6" pb="$6" gap="$2" flexWrap="wrap">
              {manga.tags.map((tag, index) => (
                <Button key={index} size="$2">{tag.title}</Button>
              ))}
            </XStack>
          </YStack>

          <YGroup als="center" w="100%" size="$4" backgroundColor="black">
            <FlashList
              data={chapters}
              contentContainerStyle={{}}
              estimatedItemSize={83}
              refreshing={loadingChapters}
              renderItem={({ item }) => (
                <>
                  <YGroup.Item>
                    <ListItem
                      hoverTheme
                      title={`Chapter ${item.chapterNumber} ${item.title != null ? '- ' + item.title : ''}`}
                      subTitle={new Date(item.date).toLocaleString()}
                      iconAfter={Math.random() > 0.5 ? <DownloadCloud /> : <></>} // TODO: Icon if downloaded
                      scaleIcon={1.5}
                    />
                  </YGroup.Item>
                  <Separator alignSelf="stretch" />
                </>
              )}
            />
          </YGroup>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

export default MangaDetails;
