import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { useAppTheme } from '@/hooks/useAppTheme';
import * as S from './connection-card.styles';

export interface ConnectionCardFieldProps {
  label: string;
  value: string;
  error: string;
  placeholder?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'url' | 'email-address';
  onChange: (value: string) => void;
  onBlur: () => void;
}

function FieldRow({ label, value, error, placeholder, autoCapitalize, keyboardType, onChange, onBlur }: ConnectionCardFieldProps) {
  const theme = useAppTheme();
  return (
    <S.FieldRow>
      <S.FieldLabel>{label}</S.FieldLabel>
      <S.FieldInput
        value={value}
        onChangeText={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={theme.color.content.tertiary}
        selectionColor={theme.color.interactive.tint}
        autoCorrect={false}
        autoCapitalize={autoCapitalize ?? 'sentences'}
        keyboardType={keyboardType ?? 'default'}
        accessibilityLabel={label}
      />
      {error ? (
        <S.FieldError accessibilityLiveRegion="polite" role="alert">
          {error}
        </S.FieldError>
      ) : null}
      {error ? <S.ErrorOutline pointerEvents="none" /> : null}
    </S.FieldRow>
  );
}

/** The grouped Connection card: label-above-field rows for name and server URL. */
export function ConnectionCard(props: {
  nameField: ConnectionCardFieldProps;
  urlField: ConnectionCardFieldProps;
}) {
  return (
    <HomeCard radius={20} pad={0}>
      <FieldRow {...props.nameField} />
      <S.Hairline />
      <FieldRow {...props.urlField} />
    </HomeCard>
  );
}
