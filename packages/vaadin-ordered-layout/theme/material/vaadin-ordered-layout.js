import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

const orderedLayout = css`
  [theme~='margin'] {
    margin: 16px;
  }

  [theme~='padding'] {
    padding: 16px;
  }
`;

registerStyles('', orderedLayout, { moduleId: 'material-ordered-layout' });

export { orderedLayout };
