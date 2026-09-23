import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { tabularNumbers } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useComposerT } from '../composer-i18n';
import { CAPTION_MAX_LENGTH } from '../composer-types';
import * as S from './caption-input.styles';

interface CaptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * The focused caption card: 1.8pt brand border + brand glow while focused,
 * hairline edge when idle. Live "{count} / 280" counter, 280 max.
 */
export function CaptionInput({ value, onChange }: CaptionInputProps) {
  const theme = useAppTheme();
  const t = useComposerT();
  const [focused, setFocused] = useState(false);

  return (
    <S.CardWrap>
      <S.FocusShadow $focused={focused}>
        <S.BorderFill $focused={focused}>
          {focused ? (
            <LinearGradient
              colors={['#FFB03A', '#FF6A3D', '#FF2D55']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.6, y: 1 }}
              style={S.fill}
            />
          ) : null}
          <S.CardBody>
            <LinearGradient
              colors={theme.isDark ? ['#1F1F23', '#17171A', '#131316'] : ['#FFFFFF', '#FAFAFC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.45, y: 1 }}
              style={S.fill}
            />
            <S.HeaderRow>
              <S.ComposerLabel>{t('feed.composer.caption.label', 'SAY SOMETHING')}</S.ComposerLabel>
              <S.Counter style={tabularNumbers as any}>
                {t('feed.composer.caption.counter', '{count} / 280', { count: value.length })}
              </S.Counter>
            </S.HeaderRow>
            <S.Input
              value={value}
              onChangeText={onChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              multiline
              maxLength={CAPTION_MAX_LENGTH}
              autoFocus
              placeholder={t('feed.composer.caption.placeholder', 'Say something about this session…')}
              placeholderTextColor={theme.isDark ? '#6C6C70' : '#8E8E93'}
              selectionColor="#FF6A3D"
              accessibilityLabel={t('feed.composer.caption.label', 'SAY SOMETHING')}
            />
          </S.CardBody>
        </S.BorderFill>
      </S.FocusShadow>
    </S.CardWrap>
  );
}
