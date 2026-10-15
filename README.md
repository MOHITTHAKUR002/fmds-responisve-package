# FMDS (Fluid Multiplier Design System)

> **Universal fluid responsive scaling for Next.js, React, Vite, Tailwind CSS, and HTML/CSS.**  
> Write regular `px` values (e.g. `16px`, `32px`) — FMDS transforms them into mathematically fluid units across all viewports.

[![Official Website](https://img.shields.io/badge/Website-fmds--responsive.quadops.in-blue?style=flat-square&logo=googlechrome&logoColor=white)](https://fmds-responsive.quadops.in/)
[![npm version](https://img.shields.io/npm/v/fmds-responsive.svg?style=flat-square&color=cb3837&logo=npm)](https://www.npmjs.com/package/fmds-responsive)
[![License: ISC](https://img.shields.io/badge/License-ISC-brightgreen.svg?style=flat-square)](https://opensource.org/licenses/ISC)

🌐 **Official Website & Interactive Docs:** [https://fmds-responsive.quadops.in/](https://fmds-responsive.quadops.in/)  
📦 **npm Package:** [npmjs.com/package/fmds-responsive](https://www.npmjs.com/package/fmds-responsive)  

---

## ⚡ The Philosophy

Traditional responsive design requires writing hundreds of manual `@media` queries for every screen width.

**FMDS** introduces a single fluid multiplier unit: `--1`:
$$\text{Output} = \text{calc}(\text{var}(--1) \times \text{VALUE})$$

- **Desktop (1920px Canvas)**: `--1: min(1px, 0.052083vw)`. Caps at 1px on ultra-wide screens (4K/2K) so elements never blow up.
- **Tablet (768px – 1199px)**: `--1: min(1px, 0.059435vw)`.
- **Mobile (< 768px)**: `--1: min(1px, 0.2vw)`.

Developers write standard `16px` — **FMDS automatically converts it**.

---

## 📦 Installation

```bash
npm install fmds-responsive
# or
yarn add fmds-responsive
pnpm add fmds-responsive
```

---

## 🚀 Quick Setup by Framework

### 1. Next.js (App Router & Pages Router)

In `postcss.config.js` (or `postcss.config.mjs`):

```js
module.exports = {
  plugins: {
    'fmds-responsive/postcss': {
      minPixelValue: 2, // Keeps 1px borders crisp
    },
  },
};
```

That's it! Write regular CSS Modules (`.module.css`), Styled JSX, or global CSS using standard `px`:
```css
/* Card.module.css */
.card {
  padding: 24px 32px;  /* Automatically converted */
  font-size: 18px;     /* Automatically converted */
  border: 1px solid #e2e8f0; /* Stays crisp 1px */
}
```

---

### 2. Vite (React, Vue, Svelte, Vanilla)

**Option A (Vite Plugin):**
In `vite.config.js`:
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fmds from 'fmds-responsive/vite';

export default defineConfig({
  plugins: [react(), fmds()],
});
```

**Option B (PostCSS):**
Simply add `'fmds-responsive/postcss': {}` to your `postcss.config.js`.

---

### 3. Tailwind CSS

In `tailwind.config.js`:
```js
import fmdsPreset from 'fmds-responsive/tailwind';

export default {
  presets: [fmdsPreset],
  content: ['./src/**/*.{html,js,jsx,tsx}'],
};
```

Now, all standard Tailwind utility classes (`p-4`, `text-lg`, `gap-6`, `rounded-xl`, etc.) or arbitrary values (`w-[320px]`) automatically use the FMDS fluid scale!

You can also use custom `s-*` classes:
```html
<div class="p-s-24 text-s-18 max-w-s-600 rounded-s-16">
  Fluid Component
</div>
```

---

### 4. Plain HTML & CSS (Terminal CLI)

No bundler? Use the CLI to transform your CSS:

```bash
# One-time build:
npx fmds input.css -o dist/style.css

# Live watch mode:
npx fmds input.css -o dist/style.css --watch
```

---

## ⚙️ Configuration Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `minPixelValue` | `number` | `2` | Minimum pixel value to transform. Prevents hairline `1px` borders from blurring. |
| `unitPrecision` | `number` | `5` | Decimal precision for pixel calculations. |
| `propList` | `string[]` | `['*']` | Properties to convert. Supports wildcards (e.g. `['font*', 'padding*', '!z-index']`). |
| `selectorBlackList` | `(string \| RegExp)[]` | `[]` | Classes or selectors to ignore (e.g. `['.no-fmds']`). |
| `includeNodeModules` | `boolean` | `true` | Intercept and transform hardcoded `px` styles from 3rd-party library packages in `node_modules`. |
| `mediaQuery` | `boolean` | `false` | Whether to transform `px` inside `@media` query conditions. |
| `autoInjectRoot` | `boolean` | `true` | Automatically injects `:root { --1: ... }` and root `rem` multiplier if not present. |
| `ignoreComment` | `string` | `'fmds-ignore'` | Inline comment keyword to bypass transformation. |

---

## 🌟 3rd-Party Libraries & HTML Defaults (v1.1.0)

### 1. Root `rem` Multiplier (Zero Config)
By importing `@import 'fmds-responsive/css';`, FMDS sets:
```css
html {
  font-size: calc(var(--1) * 16);
}
```
Any 3rd-party library using `rem` units (Tailwind CSS, Bootstrap 5, Shadcn UI, Radix UI, MUI, Swiper) **automatically scales fluidly across all devices without needing extra code**.

### 2. 3rd-Party `node_modules` Interception
For libraries with hardcoded `px` in their CSS files, our Vite & PostCSS plugins automatically intercept and convert them:
```js
// vite.config.js
import fmds from 'fmds-responsive/vite';
export default defineConfig({
  plugins: [
    fmds({ includeNodeModules: true })
  ]
});
```

### 3. Native HTML Element Fluid Defaults
Standard unstyled tags (`h1-h6`, `p`, `button`, `input`, etc.) receive fluid responsive defaults out of the box even without any custom class names applied.

---

## 💡 Opt-Out Shortcuts

1. **Capital `PX` bypass**:
   ```css
   .fixed-element {
     font-size: 16PX; /* Capital PX is ignored by default */
   }
   ```

2. **Inline comment bypass**:
   ```css
   .fixed-element {
     width: 300px; /* fmds-ignore */
   }
   ```

3. **Selector blacklist**:
   ```css
   .no-fmds {
     width: 500px; /* Ignored if .no-fmds is in selectorBlackList */
   }
   ```

---

## 📄 License
ISC © Mohit Thakur
