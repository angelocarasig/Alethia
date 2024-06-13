import { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { YStack, Text } from 'tamagui';

import SearchInput from 'components/base/searchInput';
import MangaCard from 'components/library/manga';

import { Manga } from 'types/manga/manga';
import { useMangadex } from 'hooks/sources/useMangadex';
import { useManga } from 'hooks/useManga';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  columnWrapper: {
    gap: 12
  }
});

export default function BrowseScreen() {
  const [pageNumber, setPageNumber] = useState(0);
  const [recentData, setRecentData] = useState<Manga[]>([]);
  const router = useRouter();
  const { setSelectedManga } = useManga();
  const { loading, getRecent } = useMangadex();

  useEffect(() => {
    const fetchData = async () => {
      const recentManga = await getRecent(60, pageNumber);
      setRecentData(prevData => [...prevData, ...recentManga]);
    };

    fetchData();
  }, [pageNumber]);

  const handleCardPress = (manga: Manga) => {
    Haptics.selectionAsync();
    setSelectedManga(manga);
    router.push(`/manga/${manga.id}`);
  };

  const handleLoadMore = () => {
    setPageNumber(pageNumber + 1);
  }

  return (
    <YStack f={1} ai="center" gap="$4" pt="$5">
      <SafeAreaView style={styles.container}>
        <FlatList
          data={recentData}
          renderItem={({ item }) => <MangaCard manga={item} onPress={() => handleCardPress(item)} />}
          keyExtractor={item => item.id}
          numColumns={3}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          columnWrapperStyle={{ gap: 12 }}
          refreshing={loading}
          onRefresh={() => getRecent()}
          ListEmptyComponent={<Text>No Results!</Text>}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
        />
      </SafeAreaView>
    </YStack>
  );
}
