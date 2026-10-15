export const DEFAULT_PRESET_ID = 'default';

export const THEME_EDITOR_PRESETS = [
  {
    id: 'sunset-glass',
    label: 'Sunset Glass',
    advanced: {
      colorSchemePreset: 'auto',
      accentColorLight: '#4f39f6',
      accentColorDark: '#615fff',
      backgroundColorLight: 'oklch(from var(--aura-accent-color-light) 0.9 calc(c * 0.3) h)',
      backgroundColorDark: 'oklch(from var(--aura-accent-color-dark) 0.18 calc(c * 0.3) h)',
      contrastLevel: '1',
      surfaceLevel: '2',
      overlayOpacity: '0.85',
      appLayoutInset: '1.5vmin',
      baseRadius: '7',
      baseSize: '16',
      baseFontSize: '15',
      fontFamily: "'Manrope', var(--aura-font-family-system)",
    },
    extraRules: `
html {
  --aura-font-weight-regular: 500;
  --aura-font-weight-medium: 600;
  --aura-font-weight-semibold: 700;
  --vaadin-button-font-weight: 600;
  --vaadin-input-field-value-font-weight: 500;
  --vaadin-checkbox-font-weight: 600;
  --vaadin-radio-button-font-weight: 600;
  --vaadin-message-name-font-weight: 600;
  --vaadin-grid-header-font-weight: 600;
}

vaadin-card,
vaadin-dashboard-widget {
  --aura-surface-level: 4;
}
`.trim(),
  },
  {
    id: 'fresh-mint',
    label: 'Fresh Mint',
    advanced: {
      colorSchemePreset: 'mixed',
      accentColorLight: '#009966',
      accentColorDark: '#34d399',
      backgroundColorLight: '#ffffff',
      backgroundColorDark: '#18181b',
      contrastLevel: '1',
      surfaceLevel: '-0.5',
      overlayOpacity: '0.85',
      appLayoutInset: '0px',
      baseRadius: '3',
      baseSize: '20',
      baseFontSize: '15',
      fontFamily: "'Atkinson Hyperlegible Next', var(--aura-font-family-system)",
    },
    extraRules: `
vaadin-side-nav-item:not([current]) > vaadin-icon {
  color: var(--aura-accent-text-color);
}

vaadin-side-nav-item[current]::part(content) {
  --vaadin-side-nav-item-background: var(--vaadin-background-container);
  --vaadin-side-nav-item-border-color: transparent;
}

vaadin-side-nav::part(label) {
  text-transform: uppercase;
  font-size: var(--aura-font-size-xs);
  color: var(--vaadin-text-color);
  letter-spacing: 0.03em;
}

:is(vaadin-button, vaadin-menu-bar-button, vaadin-upload-button):not([theme~="primary"], [theme~="tertiary"]) {
  --aura-accent-color-light: var(--aura-neutral);
  --aura-accent-color-dark: var(--aura-neutral);
  --vaadin-button-background: var(--vaadin-background-container);
  --vaadin-button-border-color: transparent;
  --vaadin-button-shadow: none;
}
`.trim(),
  },
  {
    id: 'night-operator',
    label: 'Night Operator',
    advanced: {
      colorSchemePreset: 'dark',
      accentColorLight: '#4f39f6',
      accentColorDark: '#615fff',
      backgroundColorLight: '#f1f5f9',
      backgroundColorDark: '#131822',
      contrastLevel: '2',
      surfaceLevel: '2',
      overlayOpacity: '1',
      appLayoutInset: '0px',
      baseRadius: '0',
      baseSize: '20',
      baseFontSize: '14',
      fontFamily: "'Geist Mono', var(--aura-font-family-system)",
    },
    extraRules: `
html {
  --vaadin-item-overlay-padding: var(--vaadin-padding-s) 0;
}

vaadin-tabs {
  --vaadin-tabs-background: transparent;
  --vaadin-tabs-border-radius: 0px;
  --vaadin-tabs-padding: 0px;
  --vaadin-tabs-gap: var(--vaadin-gap-l);
  box-shadow: inset 0 -1px 0 0 var(--vaadin-border-color);
  width: auto;
}

vaadin-tab {
  --vaadin-tab-border-radius: 0px;
  --vaadin-tab-border-width: 0px;
  --vaadin-tab-padding: var(--vaadin-padding-m) 0px;
  transition-property: color, box-shadow;
}

vaadin-tab[selected] {
  --vaadin-tab-background: transparent;
  --vaadin-tab-text-color: var(--aura-neutral);
  box-shadow: inset 0 -3px 0 0 var(--aura-accent-color);
}

vaadin-side-nav-item > vaadin-icon {
  color: var(--aura-accent-text-color);
}

vaadin-side-nav-item::part(content) {
  --vaadin-side-nav-item-border-radius: 0px;
  --vaadin-side-nav-item-border-width: 0px;
  margin-inline: calc(var(--vaadin-padding-m) * -1);
  padding-inline: var(--vaadin-padding-l);
  background-clip: border-box;
  border-inline-start: 3px solid transparent;
}

vaadin-side-nav-item[current]::part(content) {
  --aura-surface-level: 1;
  --aura-surface-opacity: 1;
  --vaadin-side-nav-item-background: light-dark(var(--aura-accent-surface), var(--vaadin-background-container));
  --vaadin-side-nav-item-text-color: var(--aura-neutral);
  border-inline-start-color: var(--aura-accent-color);
}
`.trim(),
  },
  {
    id: 'cozy-paper',
    label: 'Cozy Paper',
    advanced: {
      colorSchemePreset: 'light',
      accentColorLight: '#ff8904',
      accentColorDark: '#ff8904',
      backgroundColorLight: '#f4f4f0',
      backgroundColorDark: '#1c1917',
      contrastLevel: '0.25',
      surfaceLevel: '-0.5',
      overlayOpacity: '1',
      appLayoutInset: '1.5vmin',
      baseRadius: '4',
      baseSize: '16',
      baseFontSize: '13',
      fontFamily: "'Inter', var(--aura-font-family-system)",
    },
    extraRules: `
:is(vaadin-button, vaadin-menu-bar-button, vaadin-upload-button),
vaadin-tabs,
vaadin-checkbox,
vaadin-radio-button {
  --aura-accent-color-light: var(--aura-neutral);
  --aura-accent-color-dark: var(--aura-neutral);
}

vaadin-side-nav-item[current]::part(content) {
  --vaadin-side-nav-item-background: var(--vaadin-background-container);
  --vaadin-side-nav-item-border-color: transparent;
}
`.trim(),
  },
  {
    id: 'monochrome',
    label: 'Monochrome',
    advanced: {
      colorSchemePreset: 'auto',
      accentColorLight: '#222222',
      accentColorDark: '#eeeeee',
      backgroundColorLight: '#f5f5f5',
      backgroundColorDark: '#171717',
      contrastLevel: '0.25',
      surfaceLevel: '-0.5',
      overlayOpacity: '1',
      appLayoutInset: '0px',
      baseRadius: '4',
      baseSize: '16',
      baseFontSize: '14',
      fontFamily: "'Atkinson Hyperlegible Mono', var(--aura-font-family-system)",
    },
    extraRules: `
vaadin-side-nav::part(label) {
  text-transform: uppercase;
  font-size: var(--aura-font-size-xs);
  color: var(--vaadin-text-color);
  letter-spacing: 0.03em;
}

html {
  --vaadin-button-border-color: var(--vaadin-border-color);
  --vaadin-button-shadow: none;
}

:is(vaadin-button, vaadin-menu-bar-button, vaadin-upload-button):not([theme~="primary"]) {
  --vaadin-button-background: var(--vaadin-background-container);
}
`.trim(),
  },
];

export function getThemeEditorPresetById(id) {
  return THEME_EDITOR_PRESETS.find((preset) => preset.id === id) || null;
}
