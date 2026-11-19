import { AlignLeftIcon, AlignRightIcon } from '@storybook/icons';
import React from 'react';
import { ToggleButton } from 'storybook/internal/components';
import { addons, types, useGlobals } from 'storybook/manager-api';
import { ADDON_ID, DEFAULT_DIRECTION, DIRECTION_GLOBAL, TOOL_ID } from './constants.js';

function DirectionToggle() {
  const [globals, updateGlobals] = useGlobals();
  const isRtl = (globals[DIRECTION_GLOBAL] ?? DEFAULT_DIRECTION) === 'rtl';

  return (
    <ToggleButton
      ariaLabel="Right-to-left direction"
      tooltip="Right-to-left direction"
      pressed={isRtl}
      onClick={() => updateGlobals({ [DIRECTION_GLOBAL]: isRtl ? 'ltr' : 'rtl' })}
    >
      {isRtl ? <AlignRightIcon /> : <AlignLeftIcon />}
    </ToggleButton>
  );
}

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Text direction',
    match: ({ viewMode }) => viewMode === 'story',
    render: DirectionToggle,
  });
});
