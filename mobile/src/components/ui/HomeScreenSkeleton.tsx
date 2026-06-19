import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../theme/ThemeProvider';
import { Skeleton } from './Skeleton';

export function HomeScreenSkeleton() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + theme.spacing.md, paddingBottom: insets.bottom + 96 },
      ]}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: theme.colors.background }}
    >
      <View style={styles.section}>
        <Skeleton height={18} width="42%" />
        <Skeleton height={32} style={{ marginTop: 12 }} width="55%" />
        <Skeleton height={16} style={{ marginTop: 10 }} width="88%" />
        <Skeleton borderRadius={theme.radii.xl} height={52} style={{ marginTop: 20 }} />
      </View>

      <View style={styles.section}>
        <Skeleton height={20} width="38%" />
        <View style={styles.grid}>
          <Skeleton borderRadius={theme.radii.lg} height={108} style={styles.gridItem} />
          <Skeleton borderRadius={theme.radii.lg} height={108} style={styles.gridItem} />
          <Skeleton borderRadius={theme.radii.lg} height={108} style={styles.gridItem} />
          <Skeleton borderRadius={theme.radii.lg} height={108} style={styles.gridItem} />
        </View>
      </View>

      <View style={styles.section}>
        <Skeleton height={20} width="44%" />
        <View style={styles.row}>
          <Skeleton borderRadius={theme.radii.lg} height={168} width={156} />
          <Skeleton borderRadius={theme.radii.lg} height={168} width={156} />
        </View>
      </View>

      <View style={styles.section}>
        <Skeleton height={20} width="34%" />
        <Skeleton borderRadius={20} height={88} style={{ marginTop: 12 }} />
        <View style={styles.chips}>
          <Skeleton borderRadius={999} height={36} width="46%" />
          <Skeleton borderRadius={999} height={36} width="52%" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    gap: 32,
  },
  section: {
    gap: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  gridItem: {
    width: '47%',
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
});
