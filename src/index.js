/**
 * Fluid Multiplier Design System (FMDS)
 * Universal package for React, Next.js, Vite, Tailwind CSS, and plain HTML/CSS
 */

import fmdsPostcss from './postcss/index.js';
import fmdsPreset, { extendedTheme, numericScale, spacingScale } from './tailwind/index.js';
import fmdsVite from './vite/index.js';
import { s, fmds, fluid } from './helper/index.js';

export {
  fmdsPostcss,
  fmdsPostcss as postcss,
  fmdsPreset,
  fmdsPreset as tailwind,
  fmdsVite,
  fmdsVite as vite,
  extendedTheme,
  numericScale,
  spacingScale,
  s,
  fmds,
  fluid,
};

export default fmdsPostcss;
