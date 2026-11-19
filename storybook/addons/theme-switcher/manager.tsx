import { MoonIcon, PaintBrushIcon, SunIcon } from '@storybook/icons';
import React from 'react';
import { Select, ToggleButton } from 'storybook/internal/components';
import { addons, types, useGlobals } from 'storybook/manager-api';
import {
  ADDON_ID,
  COLOR_SCHEME_GLOBAL,
  COLOR_SCHEME_TOOL_ID,
  DEFAULT_COLOR_SCHEME,
  DEFAULT_THEME,
  THEME_GLOBAL,
  THEME_TOOL_ID,
  THEMES,
} from './constants.js';

function ThemeSelect() {
  const [globals, updateGlobals] = useGlobals();
  const theme = globals[THEME_GLOBAL] ?? DEFAULT_THEME;

  return (
    <Select
      ariaLabel="Vaadin theme"
      tooltip="Vaadin theme"
      icon={<PaintBrushIcon />}
      options={THEMES}
      defaultOptions={theme}
      onSelect={(value) => updateGlobals({ [THEME_GLOBAL]: value })}
    />
  );
}

function ColorSchemeToggle() {
  const [globals, updateGlobals] = useGlobals();
  const isDark = (globals[COLOR_SCHEME_GLOBAL] ?? DEFAULT_COLOR_SCHEME) === 'dark';

  return (
    <ToggleButton
      ariaLabel="Dark color scheme"
      tooltip="Dark color scheme"
      pressed={isDark}
      onClick={() => updateGlobals({ [COLOR_SCHEME_GLOBAL]: isDark ? 'light' : 'dark' })}
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
    </ToggleButton>
  );
}

addons.register(ADDON_ID, () => {
  addons.add(THEME_TOOL_ID, {
    type: types.TOOL,
    title: 'Vaadin theme',
    render: ThemeSelect,
  });

  addons.add(COLOR_SCHEME_TOOL_ID, {
    type: types.TOOL,
    title: 'Color scheme',
    match: ({ viewMode }) => viewMode === 'story',
    render: ColorSchemeToggle,
  });
});
