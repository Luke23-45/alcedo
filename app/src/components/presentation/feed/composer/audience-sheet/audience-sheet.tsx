import { CheckGlyph } from '../../shared/feed-glyphs';
import { ComposerSheet } from '../composer-sheet/composer-sheet';
import { GlobeGlyph, LockGlyph, PeopleGlyph } from '../composer-glyphs';
import { useComposerT } from '../composer-i18n';
import { AUDIENCES, AUDIENCE_FRIEND_COUNT, type ComposerAudience } from '../composer-types';
import { useAppTheme } from '@/hooks/useAppTheme';
import * as S from './audience-sheet.styles';

interface AudienceSheetProps {
  visible: boolean;
  audience: ComposerAudience;
  onSelect: (audience: ComposerAudience) => void;
  onClose: () => void;
}

const ROWS: {
  key: ComposerAudience;
  labelKey: string;
  labelFallback: string;
  detailKey: string;
  detailFallback: string;
  glyph: (color: string) => React.ReactNode;
}[] = [
  {
    key: 'friends',
    labelKey: 'feed.composer.audience.friends',
    labelFallback: 'Friends',
    detailKey: 'feed.composer.audience.friends.detail',
    detailFallback: `${AUDIENCE_FRIEND_COUNT} mutual friends`,
    glyph: (color) => <PeopleGlyph size={18} color={color} />,
  },
  {
    key: 'public',
    labelKey: 'feed.composer.audience.public',
    labelFallback: 'Public',
    detailKey: 'feed.composer.audience.public.detail',
    detailFallback: 'Anyone on Kinetic',
    glyph: (color) => <GlobeGlyph size={18} color={color} />,
  },
  {
    key: 'private',
    labelKey: 'feed.composer.audience.private',
    labelFallback: 'Private',
    detailKey: 'feed.composer.audience.private.detail',
    detailFallback: 'Only you',
    glyph: (color) => <LockGlyph size={18} color={color} />,
  },
];

export function AudienceSheet({ visible, audience, onSelect, onClose }: AudienceSheetProps) {
  const theme = useAppTheme();
  const t = useComposerT();
  const iconColor = theme.isDark ? '#C7C7CC' : '#3C3C43';

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
                <S.RowDetail>{t(row.detailKey, row.detailFallback)}</S.RowDetail>
              </S.RowText>
              {selected ? <CheckGlyph size={16} color="#FF9F0A" strokeWidth={2.2} /> : null}
            </S.Row>
          );
        })}
      </S.Rows>
    </ComposerSheet>
  );
}
