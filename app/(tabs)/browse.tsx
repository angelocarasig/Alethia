import { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { YStack } from 'tamagui';
import { FlashList } from '@shopify/flash-list';

import MangaCard from 'components/library/manga';
import { Manga } from 'types/manga/manga';
import { useMangadex } from 'hooks/sources/useMangadex';
import { useManga } from 'hooks/useManga';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

export default function BrowseScreen() {
  const [pageNumber, setPageNumber] = useState(0);
  const [recentData, setRecentData] = useState<Manga[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const { setSelectedManga } = useManga();
  const { getRecent } = useMangadex();
  const initialLoadRef = useRef(true);

  const fetchData = async (pageNumber: number, reset: boolean = false) => {
    const recentManga = await getRecent(60, pageNumber);
    setRecentData((prevData) => {
      const existingIds = new Set(prevData.map(item => item.id));
      const newManga = recentManga.filter(item => !existingIds.has(item.id));
      return reset ? recentManga : [...prevData, ...newManga];
    });
  };

  useEffect(() => {
    console.log("Current Page Number: ", pageNumber);
    fetchData(pageNumber).then(() => {
      if (initialLoadRef.current) {
        initialLoadRef.current = false;
      }
    });
  }, [pageNumber]);

  const handleCardPress = (manga: Manga) => {
    Haptics.selectionAsync();
    setSelectedManga(manga);
    router.push(`/manga/${manga.id}`);
  };

  const handleLoadMore = () => {
    if (!initialLoadRef.current) {
      Haptics.selectionAsync();
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };

  const handleRefresh = async () => {
    Haptics.impactAsync();
    setIsRefreshing(true);
    setPageNumber(0);
    await fetchData(0, true);
    setIsRefreshing(false);
    initialLoadRef.current = false; // Reset initial load flag after refresh
  };

  return (
    <YStack f={1} ai="center" gap="$4" pt="$5">
      <SafeAreaView style={styles.container}>
        <FlashList
          data={recentData}
          renderItem={({ item }) => (
            <MangaCard inBrowse manga={item} onPress={() => handleCardPress(item)} />
          )}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={{ padding: 10 }}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.01}
          estimatedItemSize={175}
        />
      </SafeAreaView>
    </YStack>
  );
}
