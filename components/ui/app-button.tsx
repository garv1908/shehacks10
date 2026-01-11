import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet, ViewStyle } from 'react-native';
import { Button as PaperButton, ButtonProps as PaperButtonProps } from 'react-native-paper';

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
    buttonStyle.push({ borderColor: border, borderWidth: 2 });
    labelStyle.push({ color: background } as any);
  } else if (mode === 'contained') {
    buttonStyle.push({ backgroundColor: background });
    labelStyle.push({ color: text } as any);
  } else if (mode === 'outlined') {
    buttonStyle.push({ borderColor: border, borderWidth: 2 });
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
    marginVertical: 8,
    borderRadius: 30, // Pill shape
    elevation: 2, // Slight shadow
    // No default border width for all, handled in logic
  },
  label: {
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  content: {
    height: 54, // Taller touch target
  },
});
