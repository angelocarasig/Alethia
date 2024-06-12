import { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { YStack } from 'tamagui';

import SearchInput from 'components/base/searchInput';
import MangaCard from 'components/library/manga';

import { Manga } from 'types/manga/manga';
import { useMangadex } from 'hooks/sources/useMangadex';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  columnWrapper: {
    gap: 12
  },
  flatList: {
    paddingHorizontal: 10,
  }
});

export default function BrowseScreen() {
  const [filteredData, setFilteredData] = useState<Manga[]>([]);
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

  const handleCardPress = (id: string) => {
    router.push(`/manga/${id}`);
  };

  return (
    <YStack f={1} ai="center" gap="$4" pt="$5">
      <SearchInput
        placeholder='Search Library'
        onSearchChange={handleSearch}
      />
      <SafeAreaView style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#000000" />
        ) : (
          <FlatList
            data={filteredData}
            renderItem={({ item }) => <MangaCard manga={item} onPress={() => handleCardPress(item.id)} />}
            keyExtractor={item => item.id}
            numColumns={3}
            style={styles.flatList}
            columnWrapperStyle={styles.columnWrapper}
            refreshing={false}
            onRefresh={() => { }}
          />
        )}
      </SafeAreaView>
    </YStack>
  );
}
