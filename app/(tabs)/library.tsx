import { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { YStack } from 'tamagui';

import SearchInput from 'components/base/searchInput';
import MangaCard from 'components/library/manga';

import { SAMPLE_DATA } from 'lib/utils';

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
})

export default function LibraryScreen() {
  const [filteredData, setFilteredData] = useState(SAMPLE_DATA);
  const router = useRouter();
  
  const handleSearch = (searchText: string) => {
    const filtered = SAMPLE_DATA.filter(manga =>
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
      </SafeAreaView>
    </YStack>
  )
}
