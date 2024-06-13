import React, { useState, useEffect } from 'react';
import { Image, Dimensions, TouchableHighlight } from 'react-native';
import { Text, useTheme, YStack } from 'tamagui';
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';

import { Manga } from 'types/manga/manga';

interface MangaCardProps {
  manga: Manga;
  onPress: () => void;
}

const MangaCard = ({ manga, onPress }: MangaCardProps) => {
  const theme = useTheme();
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
        <Image
          style={{
            borderRadius: 8,
            aspectRatio: 11 / 16,
            height: getSourceHeight(),
            width: getSourceWidth(),
            opacity: imageLoading ? 0 : 1,
          }}
          source={{ uri: manga.coverUrl + '.512.jpg' }}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
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
    </TouchableHighlight>
  );
}

export default MangaCard;
