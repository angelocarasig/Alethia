import { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

import { YStack, Text, useTheme } from 'tamagui';

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
  const [filteredData, setFilteredData] = useState<Manga[]>([]);
  const { setSelectedManga } = useManga();
  const router = useRouter();
  const { loading, getRecent } = useMangadex();

  useEffect(() => {
    const fetchData = async () => {
      const recentManga = await getRecent();
      setFilteredData(recentManga);
    };

    fetchData();
  }, []);

  const handleSearch = (searchText: string) => {
    const filtered = filteredData.filter(manga =>
      manga.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleCardPress = (manga: Manga) => {
    setSelectedManga(manga);
    router.push(`/manga/${manga.id}`);
  };

  return (
    <YStack f={1} ai="center" gap="$4" pt="$5">
      <SearchInput
        placeholder='Search Library'
        onSearchChange={handleSearch}
      />
      <SafeAreaView style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={filteredData}
            renderItem={({ item }) => <MangaCard manga={item} onPress={() => handleCardPress(item)} />}
            keyExtractor={item => item.id}
            numColumns={3}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            columnWrapperStyle={{ gap: 12 }}
            refreshing={loading}
            onRefresh={() => getRecent()}
            ListEmptyComponent={<Text>No Results!</Text>}
          />
        )}
      </SafeAreaView>
    </YStack>
  );
}
