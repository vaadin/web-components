import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/mixins/overlay.js';

registerStyles('vaadin-overlay', css``, { include: ['material-overlay'], moduleId: 'material-vaadin-overlay' });
