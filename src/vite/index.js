/**
 * Vite Plugin for FMDS (Fluid Multiplier Design System)
 * 
 * Automatically intercepts and transforms CSS from both project files and
 * 3rd-party library dependencies in node_modules into `calc(var(--1) * VALUE)`.
 * 
 * Usage in vite.config.js:
 *   import fmds from 'fmds-responsive/vite';
 *   export default defineConfig({
 *     plugins: [
 *       fmds({
 *         minPixelValue: 2,
 *         includeNodeModules: true,
 *       })
 *     ]
 *   });
 */

import fmdsPostcss, { createPixelReplacer, PX_REGEX, DEFAULT_OPTIONS } from '../postcss/index.js';

export default function fmdsVite(userOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...userOptions };
  const replacer = createPixelReplacer(opts.minPixelValue, opts.unitPrecision);

  return {
    name: 'vite-plugin-fmds',
    enforce: 'post',

    // Intercept CSS from project code and 3rd-party node_modules
    transform(code, id) {
      const cleanId = id.split('?')[0];
      const isCss = cleanId.endsWith('.css') || cleanId.endsWith('.scss') || cleanId.endsWith('.less');

      if (!isCss) return null;

      const isNodeModules = cleanId.includes('node_modules');

      // If it's a node_modules file and includeNodeModules is disabled, skip it
      if (isNodeModules && !opts.includeNodeModules) {
        return null;
      }

      // Check if code contains px values
      if (!code.includes('px')) {
        return null;
      }

      // Transform px values to calc(var(--1) * VALUE)
      const transformed = code.replace(PX_REGEX, replacer);

      return {
        code: transformed,
        map: null,
      };
    },

    config(config) {
      config.css = config.css || {};
      
      // If user has an explicit plugins array in vite.config.js, push fmdsPostcss
      if (config.css.postcss && Array.isArray(config.css.postcss.plugins)) {
        config.css.postcss.plugins.push(fmdsPostcss(opts));
      }
    },
  };
}
