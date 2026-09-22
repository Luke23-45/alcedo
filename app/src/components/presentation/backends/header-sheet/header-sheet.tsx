import { HomeCard } from '@/components/presentation/home/shared/home-card';
import SegmentedPicker from '@/components/presentation/foundation/segmented-picker';
import { EyeGlyph, EyeOffGlyph } from '@/components/presentation/foundation/glyphs';
import { useAppTheme } from '@/hooks/useAppTheme';
import { basicAuthHeaderValue, BackendHeader, parseBasicAuthHeaderValue } from '@/models/backend';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { useState } from 'react';
import { Modal } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as S from './header-sheet.styles';

const commonHeaderNames = ['Authorization', 'Proxy-Authorization', 'X-API-Key'];

const secretHeaderNames = ['authorization', 'proxy-authorization', 'x-api-key'];

// Both carry the same `<scheme> <credentials>` value, so both can be filled in as a username and password.
const basicAuthHeaderNames = ['authorization', 'proxy-authorization'];

const takesBasicAuth = (name: string) => basicAuthHeaderNames.includes(name.trim().toLowerCase());

const isSecretHeader = (name: string) => secretHeaderNames.includes(name.trim().toLowerCase());

export interface HeaderSheetLabels {
  name: string;
  value: string;
  username: string;
  password: string;
  schemeLabel: string;
  schemeBasic: string;
  schemeRaw: string;
  cancel: string;
  save: string;
  show: string;
  hide: string;
}

function RevealToggle({
  revealed,
  showLabel,
  hideLabel,
  onToggle,
}: {
  revealed: boolean;
  showLabel: string;
  hideLabel: string;
  onToggle: () => void;
}) {
  const theme = useAppTheme();
  const Glyph = revealed ? EyeOffGlyph : EyeGlyph;
  return (
    <S.RevealButton
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={revealed ? hideLabel : showLabel}
      accessibilityState={{ selected: revealed }}
    >
      <Glyph color={theme.color.content.secondary} size={22} />
    </S.RevealButton>
  );
}

/**
 * The add/edit HTTP header sheet: Cancel/Save nav, suggestion pills for
 * common names, a native scheme toggle for auth headers, and a reveal
 * control on secret values. Slides up over a dimmed backdrop.
 */
export function HeaderSheet(props: {
  visible: boolean;
  title: string;
  initial: BackendHeader;
  isNew: boolean;
  labels: HeaderSheetLabels;
  onCancel: () => void;
  onConfirm: (header: BackendHeader) => void;
}) {
  const theme = useAppTheme();
  const initialCredentials = takesBasicAuth(props.initial.name)
    ? parseBasicAuthHeaderValue(props.initial.value)
    : undefined;
  const [name, setName] = useState(props.initial.name);
  const [value, setValue] = useState(initialCredentials ? '' : props.initial.value);
  const [scheme, setScheme] = useState<'basic' | 'raw'>(initialCredentials ? 'basic' : 'raw');
  const [username, setUsername] = useState(initialCredentials?.username ?? '');
  const [password, setPassword] = useState(initialCredentials?.password ?? '');
  const [revealed, setRevealed] = useState(false);

  const isBasic = takesBasicAuth(name) && scheme === 'basic';
  const canConfirm = !!name.trim() && (isBasic ? !!username.trim() : !!value.trim());
  const confirm = () => {
    void impactAsync(ImpactFeedbackStyle.Light);
    props.onConfirm({
      name: name.trim(),
      value: isBasic ? basicAuthHeaderValue(username.trim(), password) : value.trim(),
    });
  };

  const revealProps = {
    revealed,
    showLabel: props.labels.show,
    hideLabel: props.labels.hide,
    onToggle: () => setRevealed(!revealed),
  };

  return (
    <Modal
      visible={props.visible}
      transparent
      animationType="slide"
      onRequestClose={props.onCancel}
      statusBarTranslucent
    >
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <S.Backdrop onPress={props.onCancel} accessibilityRole="button" accessibilityLabel={props.labels.cancel}>
          <S.Sheet onStartShouldSetResponder={() => true}>
            <S.Grabber />
            <S.NavBar>
              <S.NavButton onPress={props.onCancel} accessibilityRole="button">
                <S.NavButtonLabel>{props.labels.cancel}</S.NavButtonLabel>
              </S.NavButton>
              <S.NavTitle>{props.title}</S.NavTitle>
              <S.NavButton
                onPress={confirm}
                disabled={!canConfirm}
                accessibilityRole="button"
                accessibilityState={{ disabled: !canConfirm }}
              >
                <S.NavButtonLabel $primary>{props.labels.save}</S.NavButtonLabel>
              </S.NavButton>
            </S.NavBar>
            <S.Content>
              <S.SectionCaption>{props.labels.name}</S.SectionCaption>
              <HomeCard radius={16} pad={0}>
                <S.FieldRow>
                  <S.FieldInput
                    value={name}
                    onChangeText={setName}
                    autoFocus={props.isNew}
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholderTextColor={theme.color.content.tertiary}
                    selectionColor={theme.color.interactive.tint}
                    accessibilityLabel={props.labels.name}
                    returnKeyType="done"
                  />
                </S.FieldRow>
              </HomeCard>
              <S.SuggestionRow>
                {commonHeaderNames.map((suggestion) => {
                  const selected = name.trim().toLowerCase() === suggestion.toLowerCase();
                  return (
                    <S.SuggestionPill
                      key={suggestion}
                      $selected={selected}
                      onPress={() => setName(suggestion)}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                    >
                      <S.SuggestionLabel $selected={selected}>{suggestion}</S.SuggestionLabel>
                    </S.SuggestionPill>
                  );
                })}
              </S.SuggestionRow>

              {takesBasicAuth(name) ? (
                <>
                  <S.SectionCaption>{props.labels.schemeLabel}</S.SectionCaption>
                  <SegmentedPicker
                    value={scheme}
                    onChange={setScheme}
                    options={[
                      { value: 'basic', label: props.labels.schemeBasic },
                      { value: 'raw', label: props.labels.schemeRaw },
                    ]}
                  />
                </>
              ) : null}

              {isBasic ? (
                <>
                  <S.SectionCaption>{props.labels.username}</S.SectionCaption>
                  <HomeCard radius={16} pad={0}>
                    <S.FieldRow>
                      <S.FieldInput
                        value={username}
                        onChangeText={setUsername}
                        autoCorrect={false}
                        autoCapitalize="none"
                        textContentType="username"
                        placeholderTextColor={theme.color.content.tertiary}
                        selectionColor={theme.color.interactive.tint}
                        accessibilityLabel={props.labels.username}
                      />
                    </S.FieldRow>
                    <S.Hairline />
                    <S.FieldRow>
                      <S.InputRow>
                        <S.FieldInput
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry={!revealed}
                          autoCorrect={false}
                          autoCapitalize="none"
                          textContentType="password"
                          placeholderTextColor={theme.color.content.tertiary}
                          selectionColor={theme.color.interactive.tint}
                          accessibilityLabel={props.labels.password}
                        />
                        <RevealToggle {...revealProps} />
                      </S.InputRow>
                    </S.FieldRow>
                  </HomeCard>
                </>
              ) : (
                <>
                  <S.SectionCaption>{props.labels.value}</S.SectionCaption>
                  <HomeCard radius={16} pad={0}>
                    <S.FieldRow>
                      <S.InputRow>
                        <S.FieldInput
                          value={value}
                          onChangeText={setValue}
                          secureTextEntry={isSecretHeader(name) && !revealed}
                          autoCorrect={false}
                          autoCapitalize="none"
                          placeholderTextColor={theme.color.content.tertiary}
                          selectionColor={theme.color.interactive.tint}
                          accessibilityLabel={props.labels.value}
                        />
                        {isSecretHeader(name) ? <RevealToggle {...revealProps} /> : null}
                      </S.InputRow>
                    </S.FieldRow>
                  </HomeCard>
                </>
              )}
            </S.Content>
          </S.Sheet>
        </S.Backdrop>
      </KeyboardAvoidingView>
    </Modal>
  );
}
