/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import 'highcharts/es-modules/masters/modules/pattern-fill.src.js';
import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';

/**
 * Renders `color: { pattern }` / `color: { patternIndex }` options in styled mode,
 * where Highcharts' own pattern-fill handler never fires (fills come from CSS classes).
 * One bridge instance is created per chart and its {@link PatternFillBridge#apply} is
 * called on every render. Per render it:
 *
 * 1. Creates the `<pattern>` def (deduped by content hash) and styles its path, which
 *    the pattern-fill module skips in styled mode.
 * 2. Injects one CSS rule per series color index (`.highcharts-color-N { fill: url }`)
 *    into a constructable stylesheet on the chart's `adoptedStyleSheets`. That single
 *    rule also covers the legend symbol and tooltip swatch, and survives the export copy.
 * 3. Uses a per-point `fill` attribute only when a point's own pattern differs from its
 *    series pattern (a class-level rule can't target one point in a series).
 *
 * Non-styled mode renders patterns natively, so the bridge does nothing there (the
 * styled-mode state is read live from the chart on each `apply`, not cached). Known
 * limitation: server-side `exportChart` renders a fresh chart this hook never runs on,
 * so server SVGs lack these patterns (follow-up).
 */
export class PatternFillBridge {
  /** @type {object} */
  #configuration;

  /** @type {ShadowRoot} */
  #shadowRoot;

  /** @type {Set<string>} */
  #patternIds = new Set();

  /** @type {CSSStyleSheet | undefined} */
  #patternSheet;

  /**
   * @param {object} configuration the Highcharts chart instance
   * @param {ShadowRoot} shadowRoot the chart element's shadow root
   */
  constructor(configuration, shadowRoot) {
    this.#configuration = configuration;
    this.#shadowRoot = shadowRoot;
  }

  /** Applies pattern fills for the current render. */
  apply() {
    const chart = this.#configuration;
    if (!chart || !chart.renderer) {
      return;
    }

    // Styled mode only: non-styled mode renders patterns natively, and running the
    // bridge there would strip that fill. Read it live from the chart (not cached at
    // construction) so the bridge stays correct if the configuration's styled mode
    // changes.
    if (!chart.styledMode) {
      return;
    }

    // Bail out when there are no patterns and none were created on a previous render.
    const hasPatterns = chart.series.some(
      (series) =>
        this.#isPatternColor(series.options && series.options.color) ||
        series.points.some((point) => this.#isPatternColor(point.options && point.options.color)),
    );
    if (!hasPatterns && this.#patternIds.size === 0 && !this.#patternSheet) {
      return;
    }

    const usedIds = new Set();
    // colorIndex -> pattern id, for series that carry a single series-wide pattern.
    const colorIndexRules = new Map();

    if (hasPatterns) {
      chart.series.forEach((series) => {
        const seriesColorOptions = series.options && series.options.color;
        let seriesPatternId;
        if (this.#isPatternColor(seriesColorOptions)) {
          const colorIndex = this.#resolveColorIndex(series.colorIndex);
          seriesPatternId = this.#ensurePatternDef(seriesColorOptions, colorIndex);
          if (seriesPatternId) {
            usedIds.add(seriesPatternId);
            colorIndexRules.set(colorIndex, seriesPatternId);
          }
        }

        series.points.forEach((point) => {
          const id = this.#applyPointPatternFill(point, seriesPatternId);
          if (id) {
            usedIds.add(id);
          }
        });
      });
    }

    this.#rebuildPatternSheet(colorIndexRules);
    this.#cleanupPatternDefs(usedIds);
  }

  /**
   * Whether a color option is a pattern (`{ pattern }` or `{ patternIndex }`).
   * @return {boolean}
   */
  #isPatternColor(color) {
    return Highcharts.isObject(color) && (!!color.pattern || typeof color.patternIndex === 'number');
  }

  /**
   * Color index, defaulting to `0` so patterns never resolve `var(--_color-undefined)`.
   * @return {number}
   */
  #resolveColorIndex(colorIndex) {
    return Highcharts.pick(colorIndex, 0);
  }

  /**
   * Creates (or reuses) the `<pattern>` def for a pattern color option and applies the
   * path styling the pattern-fill module skips in styled mode. Returns the def id.
   * @return {string | undefined}
   */
  #ensurePatternDef(colorOptions, colorIndex) {
    let pattern = colorOptions.pattern;
    if (typeof colorOptions.patternIndex === 'number') {
      pattern = Highcharts.patterns && Highcharts.patterns[colorOptions.patternIndex];
    }
    if (!pattern) {
      return undefined;
    }

    const chart = this.#configuration;
    // Use the series' theme color when the pattern sets no explicit color.
    const patternColor = pattern.color || `var(--_color-${colorIndex})`;

    const id =
      pattern.id || `vaadin-pattern-${this.#hashPattern({ ...this.#stripInternalKeys(pattern), color: patternColor })}`;

    // No-op if the id already exists.
    chart.renderer.addPattern({ ...pattern, id });

    // Track bridge-created ids (incl. explicit `pattern.id`) for membership-based cleanup.
    this.#patternIds.add(id);

    // Module skips the path's stroke/fill in styled mode; apply inline (presentation
    // attributes don't resolve CSS variables, inline styles do).
    const patternElement = chart.renderer.patternElements && chart.renderer.patternElements[id];
    const pathElement = patternElement && patternElement.element.querySelector('path');
    if (pathElement) {
      const pathOptions = typeof pattern.path === 'object' && pattern.path !== null ? pattern.path : {};
      pathElement.style.stroke = pathOptions.stroke || patternColor;
      pathElement.style.strokeWidth = String(pathOptions.strokeWidth != null ? pathOptions.strokeWidth : 2);
      pathElement.style.fill = pathOptions.fill || 'none';
    }

    return id;
  }

  /**
   * When a point's own pattern differs from its series pattern, a class-level rule can't
   * target it, so set the `fill` attribute directly (the base-style `:not([fill^='url('])`
   * exclusion keeps the theme rule off it). Otherwise clear any stale attribute so the
   * injected colorIndex rule applies.
   * @return {string | undefined} the def id when the point sets its own fill attribute
   */
  #applyPointPatternFill(point, seriesPatternId) {
    const graphic = point.graphic && point.graphic.element;
    const pointColorOptions = point.options && point.options.color;

    if (this.#isPatternColor(pointColorOptions)) {
      const colorIndex = this.#resolveColorIndex(point.colorIndex != null ? point.colorIndex : point.series.colorIndex);
      const id = this.#ensurePatternDef(pointColorOptions, colorIndex);
      if (id && id !== seriesPatternId) {
        if (graphic) {
          const url = this.#configuration.renderer.url || '';
          graphic.setAttribute('fill', `url(${url}#${id})`);
        }
        return id;
      }
    }

    if (graphic) {
      const fill = graphic.getAttribute('fill');
      if (fill && fill.startsWith('url(')) {
        graphic.removeAttribute('fill');
      }
    }
    return undefined;
  }

  /**
   * Rebuilds the adopted stylesheet mapping each patterned color index to its fill.
   * Rebuilding wholesale via `replaceSync` drops rules for indexes that lost their
   * pattern. The selector omits `:where()` so its specificity (0,3,0) beats the base
   * theme rule (0,2,0); its `:not([fill^='url('])` guard spares per-point fills.
   */
  #rebuildPatternSheet(colorIndexRules) {
    if (colorIndexRules.size === 0 && !this.#patternSheet) {
      return;
    }

    if (!this.#patternSheet) {
      this.#patternSheet = new CSSStyleSheet();
    }
    if (!this.#shadowRoot.adoptedStyleSheets.includes(this.#patternSheet)) {
      this.#shadowRoot.adoptedStyleSheets = [...this.#shadowRoot.adoptedStyleSheets, this.#patternSheet];
    }

    const url = this.#configuration.renderer.url || '';
    const cssText = [...colorIndexRules.entries()]
      .map(
        ([colorIndex, id]) =>
          `[styled-mode] .highcharts-color-${colorIndex}:not([fill^='url(']) { fill: url(${url}#${id}); }`,
      )
      .join('\n');
    this.#patternSheet.replaceSync(cssText);
  }

  /**
   * Removes `<pattern>` defs created by this bridge that are no longer referenced,
   * to avoid leaking or duplicating defs across updates and redraws.
   */
  #cleanupPatternDefs(usedIds) {
    if (this.#patternIds.size === 0) {
      return;
    }

    const { renderer } = this.#configuration;
    const patternElements = renderer.patternElements || {};
    // Remove by membership so Highcharts' own `highcharts-pattern-*` defs are untouched.
    this.#patternIds.forEach((id) => {
      if (usedIds.has(id)) {
        return;
      }
      if (patternElements[id]) {
        patternElements[id].destroy();
        delete patternElements[id];
      }
      if (renderer.defIds) {
        Highcharts.erase(renderer.defIds, id);
      }
      this.#patternIds.delete(id);
    });
  }

  /**
   * Shallow copy without Highcharts' internal `_`-prefixed keys (e.g. `_width`/`_height`),
   * which it writes onto image patterns between renders. Stripping them keeps the hashed
   * id stable across redraws so the def isn't needlessly recreated.
   * @return {Object}
   */
  #stripInternalKeys(pattern) {
    const result = {};
    Object.keys(pattern).forEach((key) => {
      if (key[0] !== '_') {
        result[key] = pattern[key];
      }
    });
    return result;
  }

  /**
   * Computes a stable hash from a pattern config, used to build a deduplicated pattern id.
   * The id only needs to be stable across redraws and unique among this chart's own
   * patterns (it is always prefixed `vaadin-pattern-`, so it never has to match
   * Highcharts' native ids), so a single deterministic pass is sufficient.
   * @return {string}
   */
  #hashPattern(pattern) {
    const str = JSON.stringify(pattern);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash &= hash;
    }
    return hash.toString(16).replace('-', '1');
  }
}
