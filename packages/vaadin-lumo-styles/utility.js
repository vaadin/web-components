/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import { accessibility } from './utilities/accessibility.js';
import { background } from './utilities/background.js';
import { border } from './utilities/border.js';
import { flexboxAndGrid } from './utilities/flexbox-grid.js';
import { layout } from './utilities/layout.js';
import { shadows } from './utilities/shadows.js';
import { sizing } from './utilities/sizing.js';
import { spacing } from './utilities/spacing.js';
import { typography } from './utilities/typography.js';

/* prettier-ignore */
export const utility = css`
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

registerStyles('', utility, { moduleId: 'lumo-utility' });
