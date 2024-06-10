import { Image, StyleSheet, Dimensions, Pressable, TouchableHighlight } from 'react-native';
import { Text, YStack } from 'tamagui';

import { Manga } from 'types/manga/manga';

interface MangaCardProps {
  manga: Manga;
  onPress: () => void;
}

const MangaCard = ({ manga, onPress }: MangaCardProps) => {
  const windowWidth = Dimensions.get('window').width;

  const getSourceHeight = () => {
    if (windowWidth < 375) {
      return 125;
    }
    else if (windowWidth < 420) {
      return 150;
    }
    else return 175;
  }

  return (
    <TouchableHighlight onPress={onPress}>
      <YStack py="$2">
        <Image
          source={{ uri: manga.coverUrl, height: getSourceHeight() }}
          style={styles.image}
          resizeMode="cover"
        />
        <Text
          letterSpacing={-0.35}
          lineHeight={18}
          numberOfLines={2}
          pt="$2"
          width="$10"
        >
          {manga.title}
        </Text>
      </YStack>
    </TouchableHighlight >
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 8,
    aspectRatio: 11 / 16,
  },
});

export default MangaCard;
