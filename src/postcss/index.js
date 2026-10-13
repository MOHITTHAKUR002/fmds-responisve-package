/**
 * PostCSS FMDS (Fluid Multiplier Design System) Plugin
 * 
 * Automatically transforms standard `px` values into `calc(var(--1) * VALUE)`
 * Example: `font-size: 16px;` -> `font-size: calc(var(--1) * 16);`
 */

export const DEFAULT_OPTIONS = {
  minPixelValue: 2,             // Keep 1px borders crisp
  unitPrecision: 5,             // Decimal precision for rounding
  propList: ['*'],              // Properties to transform (* for all, or ['font*', 'padding*', '!z-index'])
  selectorBlackList: [],        // Selectors to ignore (e.g. ['.no-fmds'])
  mediaQuery: false,            // Convert px inside media queries (default false)
  autoInjectRoot: true,         // Prepend :root { --1: ... } if not present
  includeNodeModules: true,     // Transform 3rd-party library CSS from node_modules
  ignoreComment: 'fmds-ignore', // Inline comment to skip transformation
};

export const ROOT_CSS = `
:root {
  --1: min(1px, 0.052083vw);
}
@media (min-width: 768px) and (max-width: 1199.98px) {
  :root {
    --1: min(1px, 0.059435vw);
  }
}
@media (max-width: 767.98px) {
  :root {
    --1: min(1px, 0.2vw);
  }
}
html {
  font-size: calc(var(--1) * 16);
}
`;

// Helper: Check if property matches propList patterns
export function isPropMatch(prop, propList) {
  if (propList.includes('*')) return true;
  return propList.some(pattern => {
    if (pattern.startsWith('!')) {
      return !new RegExp('^' + pattern.slice(1).replace(/\*/g, '.*') + '$').test(prop);
    }
    return new RegExp('^' + pattern.replace(/\*/g, '.*') + '$').test(prop);
  });
}

// Helper: Check if selector is in blacklist
export function isSelectorBlacklisted(selector, blackList) {
  if (!blackList || blackList.length === 0) return false;
  return blackList.some(item => {
    if (typeof item === 'string') return selector.includes(item);
    if (item instanceof RegExp) return item.test(selector);
    return false;
  });
}

// Regex to match lowercase px only (e.g., 16px, -10.5px, but NOT 16PX or 16Px)
export const PX_REGEX = /([+-]?\d+(?:\.\d+)?)(px)\b/g;

export function createPixelReplacer(minPixelValue = 2, unitPrecision = 5) {
  return function (match, numberStr) {
    const pixels = parseFloat(numberStr);
    
    // Skip 0 or values smaller than minPixelValue (like 1px hairline borders)
    if (Math.abs(pixels) < minPixelValue || pixels === 0) {
      return match;
    }
    
    const formatted = unitPrecision ? parseFloat(pixels.toFixed(unitPrecision)) : pixels;
    return `calc(var(--1) * ${formatted})`;
  };
}

export default function fmdsPostcss(userOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...userOptions };
  const replacer = createPixelReplacer(opts.minPixelValue, opts.unitPrecision);

  return {
    postcssPlugin: 'postcss-fmds',

    Once(root, { postcss }) {
      const sourceFile = root.source?.input?.file || '';
      const isNodeModules = sourceFile.includes('node_modules');

      // Check if we should skip node_modules
      if (isNodeModules && !opts.includeNodeModules) {
        return;
      }

      if (!opts.autoInjectRoot) return;

      // Check if --1 is already defined in root
      let hasRootVar = false;
      root.walkDecls('--1', () => {
        hasRootVar = true;
      });

      if (!hasRootVar) {
        const parsedRoot = postcss.parse(ROOT_CSS);
        root.prepend(parsedRoot);
      }
    },

    Declaration(decl) {
      const sourceFile = decl.root()?.source?.input?.file || '';
      const isNodeModules = sourceFile.includes('node_modules');

      if (isNodeModules && !opts.includeNodeModules) {
        return;
      }

      // 1. Check if value contains lowercase 'px'
      if (!decl.value || !decl.value.includes('px')) return;

      // 2. Check if property matches propList
      if (!isPropMatch(decl.prop, opts.propList)) return;

      // 3. Check if selector is blacklisted
      const parentSelector = decl.parent && decl.parent.selector ? decl.parent.selector : '';
      if (isSelectorBlacklisted(parentSelector, opts.selectorBlackList)) return;

      // 4. Check for inline ignore comment (e.g. /* fmds-ignore */)
      const nextNode = decl.next();
      if (nextNode && nextNode.type === 'comment' && nextNode.text.trim() === opts.ignoreComment) {
        return;
      }
      const prevNode = decl.prev();
      if (prevNode && prevNode.type === 'comment' && prevNode.text.trim() === opts.ignoreComment) {
        return;
      }

      // 5. Replace lowercase px with calc(var(--1) * VALUE)
      const transformedValue = decl.value.replace(PX_REGEX, replacer);

      if (transformedValue !== decl.value) {
        decl.value = transformedValue;
      }
    },

    AtRule(atRule) {
      // Optional: Handle media queries if mediaQuery: true
      if (opts.mediaQuery && atRule.name === 'media' && atRule.params.includes('px')) {
        atRule.params = atRule.params.replace(PX_REGEX, replacer);
      }
    }
  };
}

fmdsPostcss.postcss = true;
