import Button from '@/components/presentation/foundation/button';
import IconButton from '@/components/presentation/foundation/icon-button';
import { Pager } from '@/components/presentation/foundation/pager';
import { useAppTheme } from '@/hooks/useAppTheme';
import { latestWhatsNewId, WhatsNewEntry } from '@/models/whats-new';
import { useAppSelector } from '@/store';
import { selectUnseenWhatsNew, setLastSeenWhatsNewId } from '@/store/settings';
import { T } from '@tolgee/react';
import { Href, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { shallowEqual, useDispatch } from 'react-redux';

export function WhatsNewBanner() {
  const theme = useAppTheme();
  const unseen = useAppSelector(selectUnseenWhatsNew, shallowEqual);
  const dispatch = useDispatch();
  const { push } = useRouter();

  if (!unseen.length) {
    return null;
  }

  const dismiss = () => dispatch(setLastSeenWhatsNewId(latestWhatsNewId));

  const goToFeature = (route: Href) => {
    push(route);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.color.status.info.surface }]}>
      <View style={styles.header}>
        <Text variant="labelSmall" style={{ color: theme.color.status.info.content, letterSpacing: 1 }}>
          <T keyName="whats_new.eyebrow" />
        </Text>
        <IconButton icon="close" size={18} onPress={dismiss} iconColor={theme.color.status.info.content} />
      </View>

      <Pager indicatorColor={theme.color.status.info.content}>
        {unseen.map((entry) => (
          <Feature key={entry.id} entry={entry} onPress={goToFeature} />
        ))}
      </Pager>
    </View>
  );
}

function Feature({ entry, onPress }: { entry: WhatsNewEntry; onPress: (route: Href) => void }) {
  const theme = useAppTheme();
  return (
    <>
      <View style={styles.featureRow}>
        <View style={[styles.iconWell, { backgroundColor: theme.color.status.info.base }]}>
          <Icon source={entry.icon} size={22} color={theme.color.status.info.content} />
        </View>
        <Text variant="titleMedium" style={{ color: theme.color.status.info.content, flexShrink: 1 }}>
          <T keyName={entry.titleKey} />
        </Text>
      </View>
      <Text
        variant="bodySmall"
        style={{ color: theme.color.status.info.content, marginTop: theme.space.sm, opacity: 0.9 }}
      >
        <T keyName={entry.bodyKey} />
      </Text>
      {entry.cta && (
        <View style={styles.ctaRow}>
          <Button mode="text" textColor={theme.color.status.info.content} onPress={() => onPress(entry.cta!.route)}>
            <T keyName={entry.cta.labelKey} />
          </Button>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // Home tile radius (24) so the banner reads as one home card family.
    borderRadius: 24,
    padding: 16,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWell: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
});
