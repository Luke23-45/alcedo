import { useTranslate } from '@tolgee/react';
import { Stack } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Alert, Dimensions, FlatList, I18nManager, NativeScrollEvent, NativeSyntheticEvent, Platform, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store';
import {
  addMessage,
  ChatMessage,
  initChat,
  restartChat,
  selectIsLoadingAiPlannerMessage,
  stopAiGenerator,
} from '@/store/ai-planner';
import { uuid } from '@/utils/uuid';
import { useScroll } from '@/hooks/useScrollListener';
import { useMountEffect } from '@/hooks/useMountEffect';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatBubble } from '@/components/presentation/ai-planner/chat-bubble';
import { DayDivider } from '@/components/presentation/ai-planner/day-divider';
import { ShareProgramButton } from '@/components/presentation/ai-planner/share-program-button';
import { ArrowUpGlyph, RestartGlyph, StopGlyph } from '@/components/presentation/foundation/glyphs';
import {
  canSendChatMessage,
  dayDividerLabel,
  isChatOutOfDate,
  sanitizeChatInput,
  showsDayDivider,
} from '@/components/smart/planner-chat-logic';
import * as S from '@/components/presentation/ai-planner/planner-chat.styles';

const COMPOSER_GAP = 8; // theme.space.sm

/** Header restart action: 44pt target, native destructive confirmation. */
function RestartChatButton() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const confirm = () =>
    Alert.alert(t('ai.restart_chat.confirm.title'), t('ai.restart_chat.confirm.body'), [
      { text: t('ai.restart_chat.confirm.cancel'), style: 'cancel' },
      {
        text: t('ai.restart_chat.confirm.restart'),
        style: 'destructive',
        onPress: () => dispatch(restartChat()),
      },
    ]);
  return (
    <S.HeaderTouch
      onPress={confirm}
      accessibilityRole="button"
      accessibilityLabel={t('ai.restart_chat.button')}
    >
      <S.HeaderCircle>
        <RestartGlyph color="#0A84FF" size={18} />
      </S.HeaderCircle>
    </S.HeaderTouch>
  );
}

export default function AiPlannerChat() {
  const { t } = useTranslate();

  const dispatch = useDispatch();
  const messages = useAppSelector((x) => x.aiPlanner.plannerChat);
  const { handleScroll } = useScroll(true);
  const isLoadingResponse = useAppSelector(selectIsLoadingAiPlannerMessage);
  // The server told us this app is out of date; block further input until updated.
  const isOutOfDate = isChatOutOfDate(messages);
  const baseInsets = useSafeAreaInsets();
  const insets = { ...baseInsets, bottom: Platform.select({ ios: baseInsets.bottom }) ?? 0 };
  const keyboard = useReanimatedKeyboardAnimation();
  // Distance from the composer's resting input to the physical screen bottom. On iOS the chat sits
  // under the translucent tab bar, so this is just the safe area; on Android the native tab bar
  // pushes it up, so it also includes that band. The keyboard height is measured from the physical
  // bottom, so we slide the whole chat up by only (keyboardHeight - restGap) to land the composer
  // on the keyboard rather than overshooting past it.
  const [restGap, setRestGap] = useState(0);
  const composerRef = useRef<View>(null);
  const listRef = useRef<FlatList>(null);
  // Inverted list: offset 0 is the newest message. Track whether the user has
  // scrolled up to read history, so streaming updates don't yank them back.
  const userScrolledAway = useRef(false);
  const handleChatScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    handleScroll(event);
    userScrolledAway.current = event.nativeEvent.contentOffset.y > 120;
  };
  const onComposerLayout = useCallback(() => {
    composerRef.current?.measureInWindow((_x, y, _width, height) => {
      // measureInWindow gives the composer's outer bottom; the input sits above it by the
      // composer's own bottom padding, so add that back to land the input on the keyboard.
      // The composer's resting bottom never moves (multiline growth extends it upward), and
      // measuring while the chat is translated for the keyboard would be wrong, so freeze the
      // first (at-rest) measurement.
      const bottomGap = Math.max(0, Dimensions.get('screen').height - (y + height));
      setRestGap((prev) => prev || bottomGap + insets.bottom + COMPOSER_GAP);
    });
  }, [insets.bottom]);

  const chatStyle = useAnimatedStyle(
    () => ({
      flex: 1,
      transform: [{ translateY: Math.min(0, keyboard.height.value + restGap) }],
    }),
    [restGap],
  );

  useMountEffect(() => {
    dispatch(initChat());
  });

  const [messageText, setMessageText] = useState('');
  // The AI placeholder is added by an async effect after dispatch; until it
  // arrives the newest message is our own unanswered send. Blocking on that
  // closes the double-send window the store flag cannot see yet.
  const awaitingAiReply = messages[0]?.from === 'User';
  const sendGate = { isLoadingResponse, isOutOfDate, awaitingAiReply };
  const canSend = canSendChatMessage(sendGate, messageText);
  const sendMessage = (message: string) => {
    const trimmed = sanitizeChatInput(message);
    if (canSendChatMessage(sendGate, message)) {
      setMessageText('');
      dispatch(
        addMessage({
          from: 'User',
          message: trimmed,
          id: uuid(),
          type: 'messageResponse',
        }),
      );
    }
  };

  const now = Date.now();
  const todayLabel = t('ai.chat.day.today');
  const yesterdayLabel = t('ai.chat.day.yesterday');
  const locale = useAppSelector((x) => x.settings.preferredLanguage) ?? undefined;

  return (
    <S.Screen style={{ paddingLeft: insets.left, paddingRight: insets.right }}>
      <Stack.Screen
        options={{
          scrollEdgeEffects: { top: 'hidden' },
          headerBlurEffect: 'systemMaterial',
          title: t('ai.chat.title'),
          headerRight: () => <RestartChatButton />,
        }}
      />
      <Animated.View style={chatStyle}>
        {isOutOfDate && (
          <S.OutOfDateBanner>
            <S.OutOfDateTitle>{t('ai.chat.out_of_date.title')}</S.OutOfDateTitle>
            <S.OutOfDateBody>{t('ai.chat.out_of_date.body')}</S.OutOfDateBody>
          </S.OutOfDateBanner>
        )}
        {messages.length === 0 ? (
          <S.EmptyWrap>
            <S.EmptyTitle>{t('ai.chat.empty.title')}</S.EmptyTitle>
            <S.EmptyBody>{t('ai.chat.empty.body')}</S.EmptyBody>
          </S.EmptyWrap>
        ) : (
          <FlatList<ChatMessage>
            ref={listRef}
            style={{ flex: 1 }}
            onScroll={handleChatScroll}
            scrollEventThrottle={16}
            keyboardDismissMode="interactive"
            automaticallyAdjustContentInsets={false}
            contentInsetAdjustmentBehavior="never"
            onContentSizeChange={() => {
              // Follow new messages only when the user is already at the
              // newest; never yank them away from history they're reading.
              if (!userScrolledAway.current) {
                listRef.current?.scrollToOffset({ offset: 0, animated: false });
              }
            }}
            data={messages}
            inverted
            contentContainerStyle={{
              gap: 4,
              paddingHorizontal: 16,
              paddingTop: COMPOSER_GAP,
            }}
            keyExtractor={(x) => x.id}
            renderItem={({ item, index }) => {
              const messageBelow = messages[index - 1]; // visually below (next in inverted list)
              const messageAbove = messages[index + 1]; // visually above (previous in inverted list)
              const isLastMessage = index === 0; // In inverted list, index 0 is the last (newest) message

              return (
                <S.ItemColumn>
                  {showsDayDivider(messages, index) && item.sentAt != null && (
                    <DayDivider
                      label={dayDividerLabel(item.sentAt, now, todayLabel, yesterdayLabel, locale)}
                    />
                  )}
                  <ChatBubble
                    message={item}
                    sameSenderBelow={messageBelow?.from === item.from}
                    sameSenderAbove={messageAbove?.from === item.from}
                    isLastMessage={isLastMessage}
                  />
                </S.ItemColumn>
              );
            }}
          />
        )}
        <View
          ref={composerRef}
          collapsable={false}
          onLayout={onComposerLayout}
        >
          <S.ComposerRow
            style={{ paddingBottom: insets.bottom + COMPOSER_GAP }}
          >
          <ShareProgramButton disabled={isLoadingResponse || isOutOfDate} />

          <S.Pill>
            <S.Field
              value={messageText}
              editable={!isOutOfDate}
              onChangeText={setMessageText}
              multiline
              placeholder={t('ai.type_your_message.placeholder')}
              placeholderTextColor="#8E8E93"
              returnKeyType="default"
              textAlignVertical="center"
              accessibilityLabel={t('ai.type_your_message.placeholder')}
            />
          </S.Pill>

          {isLoadingResponse ? (
            <S.SendTouch
              onPress={() => dispatch(stopAiGenerator())}
              accessibilityRole="button"
              accessibilityLabel={t('ai.stop_generating.button')}
            >
              <S.SendCircle
                colors={[...S.SEND_BLUE]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <StopGlyph color="#FFFFFF" size={16} />
              </S.SendCircle>
            </S.SendTouch>
          ) : (
            <S.SendTouch
              onPress={() => sendMessage(messageText)}
              disabled={!canSend}
              accessibilityRole="button"
              accessibilityLabel={t('ai.send_message.button')}
              accessibilityState={{ disabled: !canSend }}
            >
              <S.SendCircle
                colors={[...S.SEND_BLUE]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined}>
                  <ArrowUpGlyph color="#FFFFFF" size={18} />
                </View>
              </S.SendCircle>
            </S.SendTouch>
          )}
          </S.ComposerRow>
        </View>
      </Animated.View>
    </S.Screen>
  );
}
