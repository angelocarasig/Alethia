import { useState } from 'react';
import { Image, Dimensions, TouchableHighlight, View, StyleSheet } from 'react-native';
import { Text, Button, useTheme, YStack } from 'tamagui';
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';

import { Manga } from 'types/manga/manga';
import useDatabase from 'hooks/useDatabase';

interface MangaCardProps {
  manga: Manga;
  onPress: () => void;
  inBrowse?: boolean;
}

const styles = StyleSheet.create({
  tag: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    top: -5,
    left: -5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#2e65a3',
    fontSize: 10,
  }
})

const MangaCard = ({ manga, onPress, inBrowse }: MangaCardProps) => {
  const theme = useTheme();
  const { mangaInLibrary } = useDatabase();
  const [imageLoading, setImageLoading] = useState(true);
  const windowWidth = Dimensions.get('window').width;

  const getSourceHeight = () => {
    if (windowWidth < 375) {
      return 125;
    } else if (windowWidth < 420) {
      return 150;
    } else return 175;
  };

  const getSourceWidth = () => {
    return getSourceHeight() * (11 / 16);
  };

  return (
    <TouchableHighlight onPress={onPress}>
      <YStack py="$2">
        {imageLoading && (
          <MotiView
            transition={{
              type: 'timing',
            }}
            animate={{ backgroundColor: theme.background.val }}
          >
            <Skeleton width={getSourceWidth()} height={getSourceHeight()} />
          </MotiView>
        )}
        <View
          style={{
            position: imageLoading ? 'absolute' : 'relative',
            width: getSourceWidth(),
            height: getSourceHeight(),
            opacity: imageLoading ? 0 : 1,
          }}
        >
          {inBrowse && (
            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.8)',
                zIndex: 1,
                display: mangaInLibrary(manga) ? 'flex' : 'none'
              }}
            >
              <Button size='$1' style={styles.tag}>In Library</Button>
            </View>
          )}
          <Image
            style={{
              borderRadius: 8,
              aspectRatio: 11 / 16,
              height: getSourceHeight(),
              width: getSourceWidth(),
            }}
            source={{ uri: manga.coverUrl + '.512.jpg', cache: 'force-cache' }}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
        </View>
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
    </TouchableHighlight>
  );
}

export default MangaCard;
