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
 *    into a `<style>` element appended to the chart's shadow root. That single rule also
 *    covers the legend symbol and tooltip swatch, and survives the export copy.
 * 3. Uses a per-point inline `fill` style only when a point's own pattern differs from its
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

  /** @type {Set<string>} ids of defs this bridge created (also gates one-time styling) */
  #patternIds = new Set();

  /** @type {HTMLStyleElement | undefined} */
  #patternStyle;

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

    const hasPatterns = chart.series.some(
      (series) =>
        this.#isPatternColor(series.options?.color) ||
        series.points.some((point) => this.#isPatternColor(point.options?.color)),
    );

    // Bail out only when there is genuinely nothing to do: no patterns now and none
    // created on a previous render (nothing stale to clear).
    if (!hasPatterns && this.#patternIds.size === 0 && !this.#patternStyle) {
      return;
    }

    const usedIds = new Set();
    // colorIndex -> pattern id, for series that carry a single series-wide pattern. The
    // injected rule keys on `.highcharts-color-N`: two patterned series that share a
    // color index (more than 10 patterned series, or an explicit duplicate `colorIndex`)
    // therefore render the same pattern. This is what also lets one rule cover the legend
    // symbol and tooltip swatch, so it is an accepted limitation.
    const colorIndexRules = new Map();

    // Always visit every point so a stale inline pattern fill is cleared even when all
    // patterns were removed (its def is about to be destroyed). Pattern defs and rules
    // are only (re)created when patterns are present.
    chart.series.forEach((series) => {
      let seriesPatternId;
      if (hasPatterns) {
        const seriesColorOptions = series.options?.color;
        if (this.#isPatternColor(seriesColorOptions)) {
          const colorIndex = this.#resolveColorIndex(series.colorIndex);
          seriesPatternId = this.#ensurePatternDef(seriesColorOptions, colorIndex);
          if (seriesPatternId) {
            usedIds.add(seriesPatternId);
            colorIndexRules.set(colorIndex, seriesPatternId);
          }
        }
      }

      series.points.forEach((point) => {
        const id = this.#applyPointPatternFill(point, seriesPatternId);
        if (id) {
          usedIds.add(id);
        }
      });
    });

    this.#rebuildPatternSheet(colorIndexRules);
    this.#cleanupPatternDefs(usedIds);
  }

  /**
   * Removes the injected `<style>` element and all pattern defs created by this bridge.
   * Called on chart teardown so no orphaned nodes or defs survive a disconnect.
   */
  destroy() {
    this.#patternStyle?.remove();
    this.#patternStyle = undefined;
    this.#cleanupPatternDefs(new Set());
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
      pattern = Highcharts.patterns?.[colorOptions.patternIndex];
    }
    if (!pattern) {
      return undefined;
    }

    const chart = this.#configuration;
    // Use the series' theme color when the pattern sets no explicit color.
    const patternColor = pattern.color || `var(--_color-${colorIndex})`;

    const id =
      pattern.id || `vaadin-pattern-${this.#hashPattern({ ...this.#stripInternalKeys(pattern), color: patternColor })}`;

    // Create and style the def once. `#patternIds` both tracks the def for
    // membership-based cleanup and gates this block: while an id is tracked its def
    // exists, so later renders skip it entirely (addPattern would be a no-op and the
    // path styling is immutable).
    if (!this.#patternIds.has(id)) {
      chart.renderer.addPattern({ ...pattern, id });
      this.#patternIds.add(id);

      // Module skips the path's stroke/fill in styled mode; apply inline (presentation
      // attributes don't resolve CSS variables, inline styles do).
      const patternElement = chart.renderer.patternElements?.[id];
      const pathElement = patternElement?.element.querySelector('path');
      if (pathElement) {
        const pathOptions = typeof pattern.path === 'object' && pattern.path !== null ? pattern.path : {};
        pathElement.style.stroke = pathOptions.stroke || patternColor;
        pathElement.style.strokeWidth = String(pathOptions.strokeWidth != null ? pathOptions.strokeWidth : 2);
        pathElement.style.fill = pathOptions.fill || 'none';
      }
    }

    return id;
  }

  /**
   * When a point's own pattern differs from its series pattern, a class-level rule can't
   * target it, so set the `fill` inline style directly (an inline style beats the theme
   * `.highcharts-color-N` fill regardless of specificity). Otherwise clear any stale
   * inline fill so the injected colorIndex rule (or theme color) applies.
   * @return {string | undefined} the def id when the point sets its own inline fill
   */
  #applyPointPatternFill(point, seriesPatternId) {
    const graphic = point.graphic?.element;
    const pointColorOptions = point.options?.color;

    if (this.#isPatternColor(pointColorOptions)) {
      const colorIndex = this.#resolveColorIndex(Highcharts.pick(point.colorIndex, point.series.colorIndex));
      const id = this.#ensurePatternDef(pointColorOptions, colorIndex);
      if (id && id !== seriesPatternId) {
        if (graphic) {
          const url = this.#configuration.renderer.url || '';
          graphic.style.fill = `url(${url}#${id})`;
        }
        return id;
      }
    }

    if (graphic?.style.fill.startsWith('url(')) {
      graphic.style.removeProperty('fill');
    }
    return undefined;
  }

  /**
   * Rebuilds the injected `<style>` element mapping each patterned color index to its
   * fill. Rebuilding wholesale drops rules for indexes that lost their pattern. The
   * selector omits `:where()` so its specificity (0,3,0) beats the base theme rule
   * (0,2,0) regardless of source order. A `<style>` DOM child is used (not a
   * constructable sheet on `adoptedStyleSheets`), because the LumoInjectionMixin replaces
   * `adoptedStyleSheets` wholesale on theme switch, which would drop a constructable
   * sheet; a `<style>` child survives.
   */
  #rebuildPatternSheet(colorIndexRules) {
    const url = this.#configuration.renderer.url || '';
    const cssText = [...colorIndexRules.entries()]
      .map(([colorIndex, id]) => `[styled-mode] .highcharts-color-${colorIndex} { fill: url(${url}#${id}); }`)
      .join('\n');

    if (!cssText) {
      // No pattern rules: drop the `<style>` so the cheap bail-out in `apply()` fires
      // again on later renders once all patterns are gone.
      this.#patternStyle?.remove();
      this.#patternStyle = undefined;
      return;
    }

    if (!this.#patternStyle) {
      this.#patternStyle = document.createElement('style');
      this.#patternStyle.dataset.vaadinPatternFill = '';
    }
    if (this.#patternStyle.parentNode !== this.#shadowRoot) {
      this.#shadowRoot.appendChild(this.#patternStyle);
    }
    // Only write when changed — a write re-parses the CSS, reading `textContent` does not.
    if (cssText !== this.#patternStyle.textContent) {
      this.#patternStyle.textContent = cssText;
    }
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
      if (!key.startsWith('_')) {
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
    return (hash >>> 0).toString(16);
  }
}
