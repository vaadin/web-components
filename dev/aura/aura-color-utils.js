/**
 * Shared color-parsing and normalization utilities for the Aura theme editor controls.
 */

// ----- Hex normalization -----------------------------------------------------

/**
 * Normalize a hex color string to uppercase `#RRGGBB`.
 * Accepts `#RGB` or `#RRGGBB`. Returns `null` for anything else.
 */
export function normalizeHex(h) {
  const v = String(h || '').trim();
  if (/^#([0-9a-f]{3})$/iu.test(v)) {
    return `#${v
      .slice(1)
      .split('')
      .map((c) => c + c)
      .join('')
      .toUpperCase()}`;
  }
  if (/^#([0-9a-f]{6})$/iu.test(v)) return v.toUpperCase();
  return null;
}

// ----- RGB channel → hex helper ----------------------------------------------

function channelsToHex(r, g, b) {
  return `#${[r, g, b]
    .map((n) =>
      Math.max(0, Math.min(255, Math.round(n)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')
    .toUpperCase()}`;
}

// ----- light-dark() parsing --------------------------------------------------

/**
 * Parse a CSS `light-dark(lightVal, darkVal)` expression.
 * Returns `{ light, dark }` or `null`.
 */
export function parseLightDark(v) {
  if (!v) return null;
  const s = String(v).trim();
  if (!/^light-dark\s*\(/iu.test(s) || !s.endsWith(')')) return null;
  const inner = s.slice(s.indexOf('(') + 1, -1).trim();
  let depth = 0;
  let splitAt = -1;
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (ch === '(') depth += 1;
    else if (ch === ')') depth = Math.max(0, depth - 1);
    else if (ch === ',' && depth === 0) {
      splitAt = i;
      break;
    }
  }
  if (splitAt === -1) return null;
  const left = inner.slice(0, splitAt).trim();
  const right = inner.slice(splitAt + 1).trim();
  if (!left || !right) return null;
  return { light: left, dark: right };
}

// ----- Effective color-scheme ------------------------------------------------

/**
 * Determine the effective color-scheme (`'light'` or `'dark'`) from the
 * document's `color-scheme` property and system preference.
 */
export function resolveEffectiveScheme() {
  const cs = getComputedStyle(document.documentElement).getPropertyValue('color-scheme').toLowerCase();
  const hasLight = /\blight\b/u.test(cs);
  const hasDark = /\bdark\b/u.test(cs);
  if (hasLight && hasDark) {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  if (hasDark) return 'dark';
  return 'light';
}

// ----- OKLCH / OKLAB → sRGB hex ---------------------------------------------

function clamp01(x) {
  return Math.min(1, Math.max(0, x));
}

function linToSrgb(u) {
  return u <= 0.0031308 ? 12.92 * u : 1.055 * u ** (1 / 2.4) - 0.055;
}

function oklabToRgbHex(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  const r = clamp01(linToSrgb(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s));
  const g = clamp01(linToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s));
  const b2 = clamp01(linToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s));
  return channelsToHex(r * 255, g * 255, b2 * 255);
}

function angleToDeg(token) {
  const s = String(token).trim().toLowerCase();
  if (s.endsWith('deg')) return parseFloat(s);
  if (s.endsWith('rad')) return (parseFloat(s) * 180) / Math.PI;
  if (s.endsWith('turn')) return parseFloat(s) * 360;
  return parseFloat(s);
}

function oklchStringToHex(v) {
  const m = String(v)
    .trim()
    .match(/^oklch\(\s*([-\d.]+%?)\s+([-\d.]+)\s+([-\d.]+(?:deg|rad|turn)?)\s*(?:\/\s*([-\d.]+%?))?\s*\)$/iu);
  if (!m) return null;
  const L = m[1].endsWith('%') ? parseFloat(m[1]) / 100 : parseFloat(m[1]);
  const C = parseFloat(m[2]);
  const h = angleToDeg(m[3]);
  if (![L, C, h].every(Number.isFinite)) return null;
  const hr = ((h % 360) * Math.PI) / 180;
  return oklabToRgbHex(L, C * Math.cos(hr), C * Math.sin(hr));
}

function oklabStringToHex(v) {
  const m = String(v)
    .trim()
    .match(/^oklab\(\s*([-\d.]+%?)\s+([-\d.]+)\s+([-\d.]+)\s*(?:\/\s*([-\d.]+%?))?\s*\)$/iu);
  if (!m) return null;
  const L = m[1].endsWith('%') ? parseFloat(m[1]) / 100 : parseFloat(m[1]);
  const a = parseFloat(m[2]);
  const b = parseFloat(m[3]);
  if (![L, a, b].every(Number.isFinite)) return null;
  return oklabToRgbHex(L, a, b);
}

// ----- Browser-probe color resolution ----------------------------------------

let sharedProbe = null;

function ensureProbe() {
  if (sharedProbe?.isConnected) return sharedProbe;
  const probe = document.createElement('span');
  probe.style.position = 'fixed';
  probe.style.top = '-9999px';
  probe.style.left = '-9999px';
  probe.style.pointerEvents = 'none';
  probe.style.opacity = '0';
  document.body.appendChild(probe);
  sharedProbe = probe;
  return probe;
}

/**
 * Use the browser to resolve a CSS color string and return `#RRGGBB` hex.
 * Returns `null` if the browser doesn't recognize the value.
 */
function probeColorToHex(value) {
  const probe = ensureProbe();
  probe.style.color = '';
  probe.style.color = value;
  if (!probe.style.color) return null;

  const resolved = getComputedStyle(probe).color.trim();

  const rr = resolved.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/iu);
  if (rr) {
    return channelsToHex(Number(rr[1]), Number(rr[2]), Number(rr[3]));
  }
  if (/^oklch\(/iu.test(resolved)) {
    const result = oklchStringToHex(resolved);
    if (result) return result;
  }
  if (/^oklab\(/iu.test(resolved)) {
    const result = oklabStringToHex(resolved);
    if (result) return result;
  }

  return null;
}

// ----- Comprehensive CSS color → #RRGGBB ------------------------------------

/**
 * Convert any supported CSS color to `#RRGGBB` uppercase hex.
 * Handles: hex, rgb/rgba, hsl/hsla, oklch, oklab, light-dark(), named colors.
 * Falls back to a browser probe for anything not matched by manual parsing.
 * Returns `null` if the value cannot be resolved.
 */
export function toHex(cssColor, options = {}) {
  if (!cssColor) return null;
  const value = String(cssColor).trim();
  const scheme = options.scheme || resolveEffectiveScheme();

  // light-dark(...)
  const ld = parseLightDark(value);
  if (ld) {
    const chosen = scheme === 'dark' ? ld.dark : ld.light;
    return toHex(chosen, { scheme });
  }

  // Hex shorthand / full
  const hex = normalizeHex(value);
  if (hex) return hex;

  // rgb/rgba()
  const rgbMatch =
    value.match(
      /^rgba?\(\s*([0-9]{1,3})\s*[, ]\s*([0-9]{1,3})\s*[, ]\s*([0-9]{1,3})(?:\s*[/,]\s*(\d*\.?\d+))?\s*\)$/iu,
    ) || value.match(/^rgba?\(\s*([0-9]{1,3})\s+([0-9]{1,3})\s+([0-9]{1,3})(?:\s*\/\s*(\d*\.?\d+))?\s*\)$/iu);
  if (rgbMatch) {
    return channelsToHex(Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3]));
  }

  // hsl/hsla()
  const hslMatch =
    value.match(
      /^hsla?\(\s*(-?\d*\.?\d+)(deg|rad|turn)?\s*[, ]\s*(\d*\.?\d+)%\s*[, ]\s*(\d*\.?\d+)%(?:\s*[/,]\s*(\d*\.?\d+%?))?\s*\)$/iu,
    ) ||
    value.match(
      /^hsla?\(\s*(-?\d*\.?\d+)(deg|rad|turn)?\s+(\d*\.?\d+)%\s+(\d*\.?\d+)%(?:\s*\/\s*(\d*\.?\d+%?))?\s*\)$/iu,
    );
  if (hslMatch) {
    let h = parseFloat(hslMatch[1]);
    const unit = (hslMatch[2] || 'deg').toLowerCase();
    const s = Math.max(0, Math.min(100, parseFloat(hslMatch[3]))) / 100;
    const l = Math.max(0, Math.min(100, parseFloat(hslMatch[4]))) / 100;
    if (unit === 'rad') h = (h * 180) / Math.PI;
    else if (unit === 'turn') h *= 360;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = (((h % 360) + 360) % 360) / 60;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    let r1 = 0,
      g1 = 0,
      b1 = 0;
    if (hp >= 0 && hp < 1) [r1, g1, b1] = [c, x, 0];
    else if (hp >= 1 && hp < 2) [r1, g1, b1] = [x, c, 0];
    else if (hp >= 2 && hp < 3) [r1, g1, b1] = [0, c, x];
    else if (hp >= 3 && hp < 4) [r1, g1, b1] = [0, x, c];
    else if (hp >= 4 && hp < 5) [r1, g1, b1] = [x, 0, c];
    else if (hp >= 5 && hp < 6) [r1, g1, b1] = [c, 0, x];
    const m = l - c / 2;
    return channelsToHex((r1 + m) * 255, (g1 + m) * 255, (b1 + m) * 255);
  }

  // oklch() / oklab()
  if (/^oklch\(/iu.test(value)) {
    const result = oklchStringToHex(value);
    if (result) return result;
  }
  if (/^oklab\(/iu.test(value)) {
    const result = oklabStringToHex(value);
    if (result) return result;
  }

  // Browser probe fallback (named colors, exotic formats, etc.)
  return probeColorToHex(value);
}

/**
 * Resolve a CSS color value to the browser's computed representation
 * (whitespace-collapsed). Useful for comparing two color values for equality.
 * Returns `null` for empty strings or `var()` references.
 */
export function toComparableColor(value) {
  const source = String(value || '').trim();
  if (!source || /^var\(/u.test(source)) return null;

  const probe = ensureProbe();
  probe.style.color = '';
  probe.style.color = source;
  if (!probe.style.color) return null;

  return getComputedStyle(probe).color.replace(/\s+/gu, '');
}

/**
 * If `rawValue` is a `var(--prop)` reference, resolve it against
 * `document.documentElement` and return the comparable color.
 * Returns `null` for non-var values or unresolvable references.
 */
export function resolveVarColor(rawValue) {
  const varMatch = String(rawValue || '')
    .trim()
    .match(/^var\(\s*(--[^\s,)]+)\s*\)$/u);
  if (!varMatch) return null;

  const resolved = getComputedStyle(document.documentElement).getPropertyValue(varMatch[1]).trim();
  if (!resolved) return null;

  return toComparableColor(resolved);
}
