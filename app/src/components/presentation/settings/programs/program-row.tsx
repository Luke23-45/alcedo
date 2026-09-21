import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelectorWithArg } from '@/store';
import { selectProgram } from '@/store/program';
import { useTranslate } from '@tolgee/react';
import { settingsKey } from '@/components/presentation/settings/shared/settings-i18n';
import { ItemMenu } from '@/components/smart/program-list-item';
import { DumbbellGlyph } from './program-hero-card';
import { RowCaption, RowCard, RowHighlight, RowIconWell, RowName, RowText } from './program-row.styles';

/** Tinted icon wells cycle per row, in the spec's blue/green/amber/violet family. */
const WELLS: { well: string; glyph: string }[] = [
  { well: 'rgba(10,132,255,0.16)', glyph: '#5EB0FF' },
  { well: 'rgba(48,209,88,0.15)', glyph: '#4ADE80' },
  { well: 'rgba(255,159,10,0.15)', glyph: '#FFB84D' },
  { well: 'rgba(142,123,255,0.16)', glyph: '#A78BFA' },
];

/**
 * A non-active program row. Tapping sets it active (the existing select flow
 * with undo); long-press opens the editor; the overflow menu keeps edit /
 * duplicate / share / export / delete.
 */
export function ProgramRow({
  id,
  index,
  highlight,
  onSelect,
}: {
  id: string;
  index: number;
  highlight?: boolean;
  onSelect: () => void;
}) {
  const { t } = useTranslate();
  const { push } = useRouter();
  const program = useAppSelectorWithArg(selectProgram, id);
  const tint = WELLS[index % WELLS.length]!;

  if (!program) {
    return null;
  }

  return (
    <Pressable
      onPress={onSelect}
      onLongPress={() => push(`/settings/manage-workouts/${id}`)}
      accessibilityRole="button"
      accessibilityLabel={t(settingsKey('settings.programs.row.activate'), { name: program.name })}
    >
      <RowCard>
        <RowIconWell $tint={tint.well}>
          <DumbbellGlyph color={tint.glyph} scale={0.72} />
        </RowIconWell>
        <RowText>
          <RowName numberOfLines={1}>{program.name}</RowName>
          <RowCaption>
            {t(settingsKey('settings.programs.row.sessions'), { count: program.sessions.length })}
          </RowCaption>
        </RowText>
        <ItemMenu id={id} />
        {highlight ? <RowHighlight pointerEvents="none" /> : undefined}
      </RowCard>
    </Pressable>
  );
}
