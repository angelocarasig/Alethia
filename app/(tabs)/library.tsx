import { useEffect, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { YStack, Text } from 'tamagui';

import SearchInput from 'components/base/searchInput';
import MangaCard from 'components/library/manga';

import useDatabase from 'hooks/useDatabase';
import { Manga } from 'types/manga';
import { useManga } from 'hooks/useManga';

export default function LibraryScreen() {
  const { setSelectedManga } = useManga();
  const { library, refreshLibrary } = useDatabase();
  const [filteredData, setFilteredData] = useState(library);
  const router = useRouter();

  useEffect(() => {
    setFilteredData(library);
  }, [library]);

  const handleSearch = (searchText: string) => {
    const filtered = library.filter(manga =>
      manga.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleCardPress = (manga: Manga) => {
    Haptics.selectionAsync();
    setSelectedManga(manga);
    router.push(`/library/${manga.id}`);
  };

  return (
    <YStack f={1} ai="center" gap="$4" pt="$5">
      {library.length > 0 && (
        <SearchInput
          placeholder='Search Library'
          onSearchChange={handleSearch}
        />
      )}
      <SafeAreaView style={{ flex: 1, width: "100%" }}>
        <FlashList
          data={filteredData}
          renderItem={({ item }) => (
            <MangaCard manga={item} onPress={() => handleCardPress(item)} />
          )}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={{ padding: 10 }}
          refreshing={false} // TODO: Trigger update
          onRefresh={() => refreshLibrary()}
          estimatedItemSize={175}
          ListEmptyComponent={<Text>Nothing in Library!</Text>}
        />
      </SafeAreaView>
    </YStack>
  )
}
