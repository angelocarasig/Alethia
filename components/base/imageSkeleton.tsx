import { DimensionValue, StyleSheet } from 'react-native';
import { useTheme, View } from 'tamagui';
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';

interface ImageSkeletonProps {
  width: number | DimensionValue;
  height: number | DimensionValue;
}

function ImageSkeleton({ width, height }: ImageSkeletonProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    }
  });


  return (
    <MotiView
      transition={{
        type: 'timing',
      }}
      style={[styles.container]}
      animate={{ backgroundColor: theme.background.val }}
    >
      <Skeleton width={width} height={height} />
    </MotiView>
  )
}

export default ImageSkeleton