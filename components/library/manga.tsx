import { Image, StyleSheet, Dimensions } from 'react-native';
import { Text, YStack } from 'tamagui';
import { Manga } from 'types/manga/manga';

function MangaCard({ manga }: { manga: Manga }) {
  const windowWidth = Dimensions.get('window').width;

  return (
    <YStack py="$2">
      <Image
        source={{ uri: manga.coverUrl, height: windowWidth < 400 ? 150 : 175 }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text
        letterSpacing={-0.35}
        lineHeight={16}
        numberOfLines={2}
        pt="$2"
        width="$10"
      >
        {manga.title}
      </Text>
    </YStack>
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 8,
    aspectRatio: 11 / 16,
  },
});

export default MangaCard;
