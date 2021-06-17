/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles';
import { accessibility } from './accessibility.js';
import { background } from './background.js';
import { border } from './border.js';
import { shadows } from './shadows.js';
import { flexboxAndGrid } from './flexbox-grid.js';
import { layout } from './layout.js';
import { sizing } from './sizing.js';
import { spacing } from './spacing.js';
import { typography } from './typography.js';

/* prettier-ignore */
export const utilities = css`
${accessibility}
${background}
${border}
${shadows}
${flexboxAndGrid}
${layout}
${sizing}
${spacing}
${typography}
`;

registerStyles('', utilities, { moduleId: 'lumo-utilities' });
