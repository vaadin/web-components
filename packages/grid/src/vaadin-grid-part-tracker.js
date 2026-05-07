/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ThemeDetector } from '@vaadin/vaadin-themable-mixin/src/theme-detector.js';

/**
 * Tracks which CSS `::part(name)` selectors are present in any loaded
 * stylesheet, so the grid can avoid setting `part` attributes on cells/rows
 * when no rule targets them. Part attributes have a per-element style
 * recalculation cost in WebKit (https://bugs.webkit.org/show_bug.cgi?id=309761),
 * so skipping unused parts keeps large grids fast in Safari while preserving
 * `::part()` theming for parts that are actually targeted.
 *
 * Re-scans on theme swaps via `ThemeDetector` (the same primitive used by
 * `LumoInjector` and `ThemeDetectionMixin`) — when an Aura/Lumo stylesheet
 * is loaded or unloaded, its `::part` rules are picked up and existing grid
 * cells are retro-fitted with the matching part attribute.
 */

const PART_RE = /::part\(\s*([\w-]+)\s*\)/gu;

/** Set of part names targeted by some `::part(...)` selector in any sheet. */
const targetedParts = new Set();

/** Grid hosts that should be retro-fitted when new parts become targeted. */
const trackedHosts = new Set();

/** Sheets we have already scanned (avoid rescanning on each rescan call). */
const scannedSheets = new WeakSet();

function scanText(text, newlyTargeted) {
  for (const match of text.matchAll(PART_RE)) {
    const name = match[1];
    if (!targetedParts.has(name)) {
      targetedParts.add(name);
      newlyTargeted.push(name);
    }
  }
}

function scanSheet(sheet, newlyTargeted) {
  if (!sheet || scannedSheets.has(sheet)) {
    return;
  }
  scannedSheets.add(sheet);
  let rules;
  try {
    rules = sheet.cssRules;
  } catch {
    console.warn(
      `[vaadin-grid] Cannot inspect cross-origin stylesheet ${sheet.href ?? ''} for ::part() ` +
        `rules. If it targets grid parts (e.g. \`vaadin-grid::part(body-cell)\`), those parts ` +
        `will not be set on cells and the rules will not match. Either avoid using cross-origin ` +
        `stylesheets that contain ::part() rules, or include a same-origin stylesheet that ` +
        `declares the same part names with empty bodies (e.g. \`vaadin-grid::part(body-cell) {}\`) ` +
        `so the grid registers them.`,
    );
    return;
  }
  for (const rule of rules) {
    if (rule.cssText) {
      scanText(rule.cssText, newlyTargeted);
    }
    if (rule.styleSheet) {
      scanSheet(rule.styleSheet, newlyTargeted);
    }
  }
}

function rescan() {
  const newlyTargeted = [];
  for (const sheet of document.styleSheets) {
    scanSheet(sheet, newlyTargeted);
  }
  for (const sheet of document.adoptedStyleSheets || []) {
    scanSheet(sheet, newlyTargeted);
  }
  // Retro-fit any tracked grid host whose elements have the matching class
  // but were skipped earlier (because the targeting rule had not yet loaded).
  // When `newlyTargeted` is empty the inner loop is a no-op, so no early
  // bail-out is needed.
  for (const host of trackedHosts) {
    if (!host.shadowRoot) {
      continue;
    }
    for (const name of newlyTargeted) {
      let selector;
      try {
        selector = `.${CSS.escape(name)}`;
      } catch {
        continue;
      }
      host.shadowRoot.querySelectorAll(selector).forEach((el) => {
        el.part.add(name);
      });
    }
  }
}

let initialized = false;

function init() {
  if (initialized) {
    return;
  }
  initialized = true;
  rescan();
  // Re-scan on theme swap. ThemeDetector observes `--vaadin-aura-theme` /
  // `--vaadin-lumo-theme`, which flip when an Aura/Lumo stylesheet is
  // added or removed via `adoptedStyleSheets`. Reusing it keeps the part
  // tracker aligned with the existing theme-change machinery.
  document.__themeDetector ||= new ThemeDetector(document);
  document.__themeDetector.addEventListener('theme-changed', rescan);
  // Theme detection only fires for `--vaadin-aura-theme` / `--vaadin-lumo-theme`
  // changes, so it does not cover stylesheets that are added later as
  // `<style>` / `<link>` elements without flipping a theme property.
  // Watch for those directly. Non-element nodes (e.g. text) and unrelated
  // tags simply don't match either branch below, so no early continue is
  // needed.
  new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.tagName === 'STYLE') {
          rescan();
        } else if (node.tagName === 'LINK') {
          if (node.sheet) {
            rescan();
          } else {
            node.addEventListener('load', rescan, { once: true });
          }
        }
      }
    }
  }).observe(document, { childList: true, subtree: true });
}

/**
 * Whether a given part name is currently targeted by some `::part()` selector.
 * The grid uses this to decide whether to set the corresponding `part`
 * attribute. Always returns true once the name has been seen; only
 * becomes-true (never reverts) so retro-fitting is one-way.
 *
 * @param {string} name
 * @returns {boolean}
 */
export function isPartTargeted(name) {
  init();
  return targetedParts.has(name);
}

/**
 * Register a grid host so that when a stylesheet is added later that targets
 * a part name, every existing element in the host's shadow root with the
 * matching class can be retro-fitted with the part attribute.
 *
 * `init()` is intentionally not called here: every grid eventually calls
 * `isPartTargeted` (via `updatePart`) and that triggers init. Calling init
 * here too would be redundant.
 *
 * @param {HTMLElement} host
 */
export function registerPartTrackingHost(host) {
  trackedHosts.add(host);
}

/**
 * @param {HTMLElement} host
 */
export function unregisterPartTrackingHost(host) {
  trackedHosts.delete(host);
}
