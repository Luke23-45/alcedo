import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { CheckCircleGlyph, XCircleGlyph } from '@/components/presentation/foundation/glyphs';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ActivityIndicator } from 'react-native';
import * as S from './probe-status-card.styles';

export type ProbeStatus =
  | { status: 'checking' }
  | { status: 'done'; ok: boolean; title: string; body: string };

/**
 * The connection-test result card: a spinner while checking, then a green
 * check or red cross with exactly what the probe returned.
 */
export function ProbeStatusCard({ probe, checkingLabel }: { probe: ProbeStatus; checkingLabel: string }) {
  const theme = useAppTheme();
  return (
    <S.Wrap accessibilityLiveRegion="polite">
      <HomeCard radius={20} pad={16}>
        <S.Row>
          <S.IconSlot>
            {probe.status === 'checking' ? (
              <ActivityIndicator size="small" color={theme.color.content.secondary} />
            ) : probe.ok ? (
              <CheckCircleGlyph color={theme.color.status.success.base} size={28} />
            ) : (
              <XCircleGlyph color={theme.color.status.danger.base} size={28} />
            )}
          </S.IconSlot>
          <S.TextSlot>
            {probe.status === 'checking' ? (
              <S.Title>{checkingLabel}</S.Title>
            ) : (
              <>
                <S.Title>{probe.title}</S.Title>
                {probe.body ? <S.Body>{probe.body}</S.Body> : null}
              </>
            )}
          </S.TextSlot>
        </S.Row>
      </HomeCard>
    </S.Wrap>
  );
}
