import React from 'react';
import { Button as PaperButton, ButtonProps as PaperButtonProps } from 'react-native-paper';
import { StyleSheet, ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export type AppButtonProps = Omit<PaperButtonProps, 'mode'> & {
  inverted?: boolean;
  style?: ViewStyle;
  mode?: 'contained' | 'outlined' | 'text';
};

export function AppButton({ inverted = false, style, mode: propMode, ...props }: AppButtonProps) {
  // Use theme colors
  const background = useThemeColor({}, 'tint');
  const text = useThemeColor({}, 'background');
  const border = useThemeColor({}, 'tint');

  let mode: 'contained' | 'outlined' | 'text' = propMode || 'contained';
  let buttonStyle = [styles.button, style];
  let labelStyle: any[] = [styles.label];

  if (inverted) {
    // Invert colors for logout or special cases
    mode = 'outlined';
    buttonStyle.push({ borderColor: border });
    labelStyle.push({ color: background } as any);
  } else if (mode === 'contained') {
    buttonStyle.push({ backgroundColor: background });
    labelStyle.push({ color: text } as any);
  } else if (mode === 'outlined') {
    buttonStyle.push({ borderColor: border });
    labelStyle.push({ color: background } as any);
  }

  return (
    <PaperButton
      {...props}
      mode={mode}
      style={buttonStyle}
      labelStyle={labelStyle}
      contentStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    height: 48,
  },
});
