import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/mixins/overlay.js';

registerStyles('vaadin-overlay', css``, { include: ['lumo-overlay'], moduleId: 'lumo-vaadin-overlay' });
