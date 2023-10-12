/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import { accessibility } from './utilities/accessibility.js';
import { background } from './utilities/background.js';
import { border } from './utilities/border.js';
import { flexboxAndGrid } from './utilities/flexbox-grid.js';
import { layout } from './utilities/layout.js';
import { shadow } from './utilities/shadow.js';
import { sizing } from './utilities/sizing.js';
import { spacing } from './utilities/spacing.js';
import { transition } from './utilities/transition.js';
import { typography } from './utilities/typography.js';

/* prettier-ignore */
export const utility = css`
${accessibility}
${background}
${border}
${flexboxAndGrid}
${layout}
${shadow}
${sizing}
${spacing}
${transition}
${typography}
`;

registerStyles('', utility, { moduleId: 'lumo-utility' });
