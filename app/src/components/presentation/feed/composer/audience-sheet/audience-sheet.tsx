import { CheckGlyph } from '../../shared/feed-glyphs';
import { ComposerSheet } from '../composer-sheet/composer-sheet';
import { GlobeGlyph, LockGlyph, PeopleGlyph } from '../composer-glyphs';
import { useComposerT } from '../composer-i18n';
import { AUDIENCES, type ComposerAudience } from '../composer-types';
import { useAppTheme } from '@/hooks/useAppTheme';
import * as S from './audience-sheet.styles';

interface AudienceSheetProps {
  visible: boolean;
  audience: ComposerAudience;
  /** Mutual friends from the social graph; 0/unknown omits the number. */
  friendCount: number;
  onSelect: (audience: ComposerAudience) => void;
  onClose: () => void;
}

const ROWS: {
  key: ComposerAudience;
  labelKey: string;
  labelFallback: string;
  glyph: (color: string) => React.ReactNode;
}[] = [
  {
    key: 'friends',
    labelKey: 'feed.composer.audience.friends',
    labelFallback: 'Friends',
    glyph: (color) => <PeopleGlyph size={18} color={color} />,
  },
  {
    key: 'public',
    labelKey: 'feed.composer.audience.public',
    labelFallback: 'Public',
    glyph: (color) => <GlobeGlyph size={18} color={color} />,
  },
  {
    key: 'private',
    labelKey: 'feed.composer.audience.private',
    labelFallback: 'Private',
    glyph: (color) => <LockGlyph size={18} color={color} />,
  },
];

const ROW_DETAILS: Record<ComposerAudience, { key: string; fallback: string }> = {
  friends: { key: 'feed.composer.audience.friends.detail', fallback: '{count} mutual friends' },
  public: { key: 'feed.composer.audience.public.detail', fallback: 'Anyone on Alcedo' },
  private: { key: 'feed.composer.audience.private.detail', fallback: 'Only you' },
};

export function AudienceSheet({ visible, audience, friendCount, onSelect, onClose }: AudienceSheetProps) {
  const theme = useAppTheme();
  const t = useComposerT();
  const iconColor = theme.isDark ? '#C7C7CC' : '#3C3C43';

  const friendsDetail =
    friendCount > 0
      ? t('feed.composer.audience.friends.detail', '{count} mutual friends', { count: friendCount })
      : t('feed.composer.audience.friends.detail.unknown', 'Mutual friends');

  return (
    <ComposerSheet
      visible={visible}
      onClose={onClose}
      title={t('feed.composer.audience.sheet.title', 'Who can see this?')}
    >
      <S.Rows>
        {AUDIENCES.map((key) => {
          const row = ROWS.find((r) => r.key === key)!;
          const selected = key === audience;
          const detail = key === 'friends' ? friendsDetail : t(ROW_DETAILS[key].key, ROW_DETAILS[key].fallback);
          return (
            <S.Row
              key={key}
              onPress={() => {
                onSelect(key);
                onClose();
              }}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={t(row.labelKey, row.labelFallback)}
            >
              <S.IconWell>{row.glyph(iconColor)}</S.IconWell>
              <S.RowText>
                <S.RowLabel>{t(row.labelKey, row.labelFallback)}</S.RowLabel>
                <S.RowDetail>{detail}</S.RowDetail>
              </S.RowText>
              {selected ? <CheckGlyph size={16} color="#FF9F0A" strokeWidth={2.2} /> : null}
            </S.Row>
          );
        })}
      </S.Rows>
    </ComposerSheet>
  );
}
