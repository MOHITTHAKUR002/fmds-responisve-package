/**
 * FMDS Inline Style Helper Function
 * 
 * Converts pixel values into `calc(var(--1) * VALUE)` for React/HTML inline styles.
 * 
 * Usage:
 *   import { s } from 'fmds-responsive';
 *   // or import { s } from 'fmds-responsive/helper';
 * 
 * Examples:
 *   <div style={{ fontSize: s(24) }}>                  => "calc(var(--1) * 24)"
 *   <div style={{ padding: s(16, 32) }}>               => "calc(var(--1) * 16) calc(var(--1) * 32)"
 *   <div style={{ margin: s("10px 20px") }}>           => "calc(var(--1) * 10) calc(var(--1) * 20)"
 *   <div style={{ border: `solid ${s(1)} #fff` }}>      => "1px" (preserves 1px crisp borders)
 * 
 * When user writes normal inline style with px (without s), it remains standard static px.
 */

export function s(...args) {
  if (args.length === 0) return '';

  // If multiple arguments passed: s(10, 20, 30)
  if (args.length > 1) {
    return args.map(arg => s(arg)).join(' ');
  }

  const val = args[0];
  if (val === null || val === undefined) return '';

  // If number
  if (typeof val === 'number') {
    if (val === 0) return '0px';
    if (Math.abs(val) === 1) return `${val}px`;
    return `calc(var(--1) * ${val})`;
  }

  // If string
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return '';

    // Handle space-separated string values, e.g. "12px 24px" or "10 20"
    if (trimmed.includes(' ')) {
      return trimmed
        .split(/\s+/)
        .map(part => s(part))
        .join(' ');
    }

    // Check if it ends with 'px'
    if (trimmed.endsWith('px')) {
      const num = parseFloat(trimmed.slice(0, -2));
      if (!isNaN(num)) {
        if (num === 0) return '0px';
        if (Math.abs(num) === 1) return `${num}px`;
        return `calc(var(--1) * ${num})`;
      }
    }

    // Check if it's a numeric string, e.g. "24"
    const num = parseFloat(trimmed);
    if (!isNaN(num) && String(num) === trimmed) {
      if (num === 0) return '0px';
      if (Math.abs(num) === 1) return `${num}px`;
      return `calc(var(--1) * ${num})`;
    }

    return trimmed;
  }

  return String(val);
}

// Aliases
export const fmds = s;
export const fluid = s;

export default s;
