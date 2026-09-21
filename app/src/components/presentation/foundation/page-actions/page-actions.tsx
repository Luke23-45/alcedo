import { useAppTheme } from '@/hooks/useAppTheme';
import { PageAction, PageActionsProps } from './page-actions-props';
import { Button, HStack, Host } from '@expo/ui/swift-ui';
import {
  Animation,
  animation,
  buttonStyle,
  foregroundStyle,
  glassEffect,
  labelStyle,
  padding,
  shadow,
  disabled,
} from '@expo/ui/swift-ui/modifiers';
import { PageActionsAccessory } from './page-actions-accessory';
import { View } from 'react-native';

// iOS draws a commit and a recurring action the same way, so `primaryKind` is unused here:
// emphasis comes from the glass tint rather than from a different control.
export function PageActions({ primary, secondary = [], primaryExpanded, accessory }: PageActionsProps) {
  const theme = useAppTheme();

  // A page that never collapses keeps the centred glass stack. One that does anchors to the
  // trailing edge in both states, so collapsing only ever changes the button's width.
  const collapsible = primaryExpanded !== undefined;
  const expanded = primaryExpanded ?? true;

  const glassButton = (action: PageAction, isPrimary: boolean, showLabel = true) => (
    <Button
      key={action.label}
      label={action.label}
      systemImage={action.systemImage}
      onPress={action.onPress}
      modifiers={[
        buttonStyle('plain'),
        foregroundStyle(isPrimary ? theme.color.content.onAccent : theme.color.interactive.tint),
        // Hiding the title rather than swapping in an icon-only button keeps it the same SwiftUI
        // Label, which is what lets the collapse animate instead of snapping. The title still
        // reaches VoiceOver. Equal padding around the lone symbol turns the capsule into a circle.
        labelStyle(showLabel ? 'titleAndIcon' : 'iconOnly'),
        showLabel ? padding({ horizontal: 20, vertical: 14 }) : padding({ all: 15 }),
        glassEffect({
          glass: { variant: 'clear', interactive: true, tint: isPrimary ? theme.color.interactive.accent : undefined },
          shape: 'capsule',
        }),
        animation(Animation.spring({ duration: 0.35, bounce: 0.2 }), showLabel),
        disabled(!!action.disabled),
      ]}
    />
  );

  return (
    <View
      style={{
        alignItems: collapsible ? 'flex-end' : 'center',
        gap: theme.space.sm,
        paddingHorizontal: theme.layout.screenPadding,
        paddingBottom: theme.space.md,
        pointerEvents: 'box-none',
      }}
    >
      <Host matchContents seedColor={theme.color.interactive.tint} colorScheme={theme.mode}>
        {/* The shadow rides the stack, not the buttons: glass swallows a shadow set on itself. */}
        <HStack
          spacing={8}
          modifiers={[
            shadow({
              radius: theme.elevation.sm.shadowRadius,
              y: theme.elevation.sm.shadowOffset.height,
              color: theme.color.background.scrim,
            }),
          ]}
        >
          {glassButton(primary, true, expanded)}
          {secondary.map((action) => glassButton(action, false))}
        </HStack>
      </Host>
      <PageActionsAccessory>{accessory}</PageActionsAccessory>
    </View>
  );
}
