import { useAppTheme } from '@/hooks/useAppTheme';
import { useState } from 'react';
import { TextInput } from 'react-native';
import { MagnifierGlyph } from '../picker-icons';
import { BorderGradient, FieldInner, SearchOuter } from './picker-search.styles';

/**
 * Search field. Focused state per the reference: white .08 fill, 1.8pt
 * brand-gradient stroke, soft glow, #FF6A3D caret.
 */
export function PickerSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const theme = useAppTheme();
  const [focused, setFocused] = useState(false);
  return (
    <SearchOuter $focused={focused}>
      {focused ? <BorderGradient /> : null}
      <FieldInner $focused={focused}>
        <MagnifierGlyph color="#8E8E93" />
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#6C6C70"
          selectionColor="#FF6A3D"
          cursorColor="#FF6A3D"
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={placeholder}
          style={{
            flex: 1,
            height: '100%',
            fontSize: 15,
            fontWeight: '400',
            letterSpacing: -0.2,
            color: theme.color.content.primary,
          }}
        />
      </FieldInner>
    </SearchOuter>
  );
}
