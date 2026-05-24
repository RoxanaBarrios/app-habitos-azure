// Colores y estilos iOS estándar
export const Colors = {
  // Fondos
  background: '#000000',
  surfaceLight: '#1C1C1E',
  surface: '#2c2c2eba',
  surfaceDark: '#3A3A3C',

  // Primarios
  primary: '#007AFF', // Azul iOS
  secondary: '#5AC8FA', // Azul claro

  // Estados
  success: '#34C759', // Verde
  warning: '#FF9500', // Naranja
  danger: '#FF3B30', // Rojo

  // Texto
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#3A3A3C',

  // Especiales
  divider: '#3A3A3C',
  tint: '#007AFF',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
};

export const Typography = {
  title1: {
    fontSize: 34,
    fontWeight: '700' as const,
    lineHeight: 41,
  },
  title2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
  },
  title3: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
  },
  headline: {
    fontSize: 17,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  callout: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 21,
  },
  subheadline: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  footnote: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
};
