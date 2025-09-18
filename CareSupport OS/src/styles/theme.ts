// Design tokens for CareSupport.com
// Follows a "compliance by design" philosophy with clear, accessible colors

export const colors = {
  // Brand Colors
  brand: {
    primary: '#9333EA', // Purple
    secondary: '#4F46E5', // Indigo
  },

  // Status Colors
  status: {
    success: {
      light: '#DEF7EC',
      DEFAULT: '#4CAF50',
      dark: '#03543F',
    },
    warning: {
      light: '#FEF3C7',
      DEFAULT: '#FAA45A',
      dark: '#92400E',
    },
    error: {
      light: '#FEE2E2',
      DEFAULT: '#E63946',
      dark: '#991B1B',
    },
    info: {
      light: '#E0E7FF',
      DEFAULT: '#6366F1',
      dark: '#3730A3',
    },
  },

  // Neutral Colors with Claude-inspired adjustments
  neutral: {
    50: '#FAF9F5',  // Claude card color
    100: '#F0EEE6',  // Claude background
    200: '#E5E3DB',
    300: '#D1CFC7',
    400: '#9C9A94',
    500: '#6B6A66',
    600: '#4B4A47',
    700: '#373634',
    800: '#1F1E1D',
    900: '#111111',
  },
};

export const typography = {
  // Font Sizes
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },

  // Font Weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Line Heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
};

export const spacing = {
  // Base spacing unit: 4px
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
};

export const layout = {
  // Container max widths
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
};

// Component-specific styles
export const components = {
  // Status Indicators
  statusIndicator: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    success: 'bg-status-success-light text-status-success-dark',
    warning: 'bg-status-warning-light text-status-warning-dark',
    error: 'bg-status-error-light text-status-error-dark',
    info: 'bg-status-info-light text-status-info-dark',
  },

  // Form Elements
  input: {
    base: 'w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent',
    error: 'border-status-error-DEFAULT focus:ring-status-error-DEFAULT',
    disabled: 'bg-neutral-100 cursor-not-allowed',
  },

  // Buttons
  button: {
    base: 'px-4 py-2 rounded-lg font-medium transition-colors',
    primary: 'bg-brand-primary text-white hover:bg-brand-primary-dark',
    secondary: 'bg-claude-card border border-neutral-200 text-neutral-700 hover:bg-neutral-50',
    danger: 'bg-status-error-DEFAULT text-white hover:bg-status-error-dark',
  },

  // Cards
  card: {
    base: 'bg-claude-card rounded-lg border border-neutral-200',
    header: 'p-6 border-b border-neutral-200',
    body: 'p-6',
    footer: 'p-6 border-t border-neutral-200',
  },
};

// Consistent spacing for layout components
export const layoutSpacing = {
  page: 'p-8',
  section: 'mb-8',
  card: 'p-6',
  stack: 'space-y-4',
  inline: 'space-x-4',
};

// Z-index scale
export const zIndex = {
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  popover: 50,
  toast: 60,
};