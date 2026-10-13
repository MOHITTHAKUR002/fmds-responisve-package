/**
 * Tailwind CSS Preset & Plugin for FMDS (Fluid Multiplier Design System)
 * 
 * Works with Tailwind CSS v3 and v4.
 * Automatically maps Tailwind spacing, typography, radii, and max-widths to `calc(var(--1) * VALUE)`.
 */

const fluid = (value) => `calc(var(--1) * ${value})`;

// Generates numeric scale s-0 to s-500 (plus half steps)
const generateNumericScale = (max = 500) => {
  const scale = {};
  for (let i = 0; i <= max; i++) {
    scale[`s-${i}`] = fluid(i);
  }
  [0.5, 1.5, 2.5, 3.5, 4.5].forEach(i => {
    scale[`s-${i}`] = fluid(i);
  });
  return scale;
};

const standardSpacing = {
  'px': fluid(1),
  '0': fluid(0),
  '0.5': fluid(2),
  '1': fluid(4),
  '1.5': fluid(6),
  '2': fluid(8),
  '2.5': fluid(10),
  '3': fluid(12),
  '3.5': fluid(14),
  '4': fluid(16),
  '5': fluid(20),
  '6': fluid(24),
  '7': fluid(28),
  '8': fluid(32),
  '9': fluid(36),
  '10': fluid(40),
  '11': fluid(44),
  '12': fluid(48),
  '14': fluid(56),
  '16': fluid(64),
  '20': fluid(80),
  '24': fluid(96),
  '28': fluid(112),
  '32': fluid(128),
  '36': fluid(144),
  '40': fluid(160),
  '44': fluid(176),
  '48': fluid(192),
  '52': fluid(208),
  '56': fluid(224),
  '60': fluid(240),
  '64': fluid(256),
  '72': fluid(288),
  '80': fluid(320),
  '96': fluid(384),
};

const standardMaxWidths = {
  '0': fluid(0),
  'none': 'none',
  'xs': fluid(320),
  'sm': fluid(384),
  'md': fluid(448),
  'lg': fluid(512),
  'xl': fluid(576),
  '2xl': fluid(672),
  '3xl': fluid(768),
  '4xl': fluid(896),
  '5xl': fluid(1024),
  '6xl': fluid(1152),
  '7xl': fluid(1280),
  'full': '100%',
  'min': 'min-content',
  'max': 'max-content',
  'fit': 'fit-content',
  'prose': fluid(650),
  'screen-sm': fluid(640),
  'screen-md': fluid(768),
  'screen-lg': fluid(1024),
  'screen-xl': fluid(1280),
  'screen-2xl': fluid(1536),
};

const standardBorderRadius = {
  'none': fluid(0),
  'sm': fluid(2),
  'DEFAULT': fluid(4),
  'md': fluid(6),
  'lg': fluid(8),
  'xl': fluid(12),
  '2xl': fluid(16),
  '3xl': fluid(24),
  'full': '9999px',
};

const standardFontSize = {
  'xs': [fluid(12), { lineHeight: fluid(16) }],
  'sm': [fluid(14), { lineHeight: fluid(20) }],
  'base': [fluid(16), { lineHeight: fluid(24) }],
  'lg': [fluid(18), { lineHeight: fluid(28) }],
  'xl': [fluid(20), { lineHeight: fluid(28) }],
  '2xl': [fluid(24), { lineHeight: fluid(32) }],
  '3xl': [fluid(30), { lineHeight: fluid(36) }],
  '4xl': [fluid(36), { lineHeight: fluid(40) }],
  '5xl': [fluid(48), { lineHeight: fluid(1) }],
  '6xl': [fluid(60), { lineHeight: fluid(1) }],
  '7xl': [fluid(72), { lineHeight: fluid(1) }],
  '8xl': [fluid(96), { lineHeight: fluid(1) }],
  '9xl': [fluid(128), { lineHeight: fluid(1) }],
};

export const numericScale = generateNumericScale(500);

export const spacingScale = {
  ...numericScale,
  ...standardSpacing,
};

export const extendedTheme = {
  spacing: spacingScale,
  maxWidth: { ...numericScale, ...standardMaxWidths },
  minWidth: { ...numericScale, ...standardMaxWidths },
  maxHeight: spacingScale,
  minHeight: spacingScale,
  borderRadius: { ...numericScale, ...standardBorderRadius },
  fontSize: { ...numericScale, ...standardFontSize },
  lineHeight: numericScale,
  borderWidth: numericScale,
  translate: spacingScale,
  inset: spacingScale,
  gap: spacingScale,
  blur: numericScale,
  backdropBlur: numericScale,
  letterSpacing: numericScale,
};

/**
 * FMDS Tailwind Preset
 * Use in tailwind.config.js:
 *   presets: [fmdsPreset]
 */
export const fmdsPreset = {
  theme: {
    extend: extendedTheme,
  },
};

export const fmdsTheme = extendedTheme;

export default fmdsPreset;
