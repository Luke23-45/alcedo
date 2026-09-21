import { useAppTheme } from '@/hooks/useAppTheme';
import { TagGlyph } from '../composer-glyphs';
import { useComposerT } from '../composer-i18n';
import * as S from './attach-row.styles';

interface AttachRowProps {
  onTagPress: () => void;
}

export function AttachRow({ onTagPress }: AttachRowProps) {
  const theme = useAppTheme();
  const t = useComposerT();

  return (
    <S.AttachRow>
      <S.AttachPill
        onPress={onTagPress}
        accessibilityRole="button"
        accessibilityLabel={t('feed.composer.attach.tag', 'Tag')}
      >
        <TagGlyph size={15} color={theme.isDark ? '#C7C7CC' : '#3C3C43'} />
        <S.AttachLabel>{t('feed.composer.attach.tag', 'Tag')}</S.AttachLabel>
      </S.AttachPill>
    </S.AttachRow>
  );
}
