import Icon from '@/components/presentation/foundation/icon';
import { useTranslate } from '@tolgee/react';
import * as Application from 'expo-application';
import { chevronColor } from '../shared/grouped-settings-list.styles';
import { settingsKey } from '../shared/settings-i18n';
import * as S from './release-card.styles';
import { CardShell } from './card-shell';
import { BackupSeparator } from './backup-card.styles';

const BULLET_KEYS = [
  'settings.backup.release.bullet_1',
  'settings.backup.release.bullet_2',
  'settings.backup.release.bullet_3',
  'settings.backup.release.bullet_4',
  'settings.backup.release.bullet_5',
] as const;

/**
 * Release card (settings-dark.md Screen 6): brand tile, the real
 * app version/build from expo-application (never a fabricated build
 * number), NEW pill while unread, and the five contract bullets.
 * Shared by the backup screen (standalone) and the what's-new route (with
 * "View all release notes" scrolling to the real entries).
 */
export function ReleaseCard({
  isNew,
  onViewAll,
}: {
  /** True while any release entry is unread. */
  isNew: boolean;
  /** When set, renders "View all release notes" → onViewAll. */
  onViewAll?: () => void;
}) {
  const { t } = useTranslate();

  // Real values from the native shell; the fallbacks match app.json.
  const version = Application.nativeApplicationVersion ?? '1.0.0';
  const build = Application.nativeBuildVersion ?? '1';

  return (
    <CardShell>
      <S.ReleaseHeader>
        <S.ReleaseTileBase colors={['#FFB03A', '#FF6A3D', '#FF2D55']} start={{ x: 0, y: 0 }} end={{ x: 0.6, y: 1 }}>
          <S.ReleaseTileGlossBase
            colors={['rgba(255,255,255,0.30)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            pointerEvents="none"
          />
          <Icon source="star" size={20} color="#FFFFFF" />
        </S.ReleaseTileBase>
        <S.ReleaseHeaderText>
          <S.ReleaseTitle>{t(settingsKey('settings.backup.release.title'), { version })}</S.ReleaseTitle>
          <S.ReleaseMeta>{t(settingsKey('settings.backup.release.meta'), { build })}</S.ReleaseMeta>
        </S.ReleaseHeaderText>
        {isNew ? (
          <S.ReleasePill accessibilityLabel={t(settingsKey('settings.backup.release.badge'))}>
            <S.ReleasePillText>{t(settingsKey('settings.backup.release.badge'))}</S.ReleasePillText>
          </S.ReleasePill>
        ) : undefined}
      </S.ReleaseHeader>
      <S.ReleaseBullets>
        {BULLET_KEYS.map((key) => (
          <S.ReleaseBullet key={key}>
            <S.ReleaseBulletDot />
            <S.ReleaseBulletText>{t(settingsKey(key))}</S.ReleaseBulletText>
          </S.ReleaseBullet>
        ))}
      </S.ReleaseBullets>
      {onViewAll ? (
        <>
          <BackupSeparator />
          <S.ReleaseMoreRow accessibilityRole="button" onPress={onViewAll}>
            <S.ReleaseMoreText>{t(settingsKey('settings.backup.release.view_all'))}</S.ReleaseMoreText>
            <Icon source="chevronRight" size={18} color={chevronColor} />
          </S.ReleaseMoreRow>
        </>
      ) : undefined}
    </CardShell>
  );
}
