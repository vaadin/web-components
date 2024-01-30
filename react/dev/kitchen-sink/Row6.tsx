import { BoardRow } from '../../packages/react-components-pro/src/BoardRow.js';
import { HorizontalLayout } from '../../packages/react-components/src/HorizontalLayout.js';
import { Icon } from '../../packages/react-components/src/Icon.js';
import { Iconset } from '../../packages/react-components/src/Iconset.js';
import { LoginForm } from '../../packages/react-components/src/LoginForm.js';
import { LoginOverlay } from '../../packages/react-components/src/LoginOverlay.js';
import { MenuBar } from '../../packages/react-components/src/MenuBar.js';
import { Scroller } from '../../packages/react-components/src/Scroller.js';
import { VerticalLayout } from '../../packages/react-components/src/VerticalLayout.js';

export default function Row6() {
  return (
    <BoardRow>
      <HorizontalLayout>
        <VerticalLayout>
          <Scroller>Scroller</Scroller>
          <Iconset></Iconset>
          <Icon></Icon>
        </VerticalLayout>
        <VerticalLayout>
          <LoginForm></LoginForm>
          <LoginOverlay></LoginOverlay>
        </VerticalLayout>
      </HorizontalLayout>
      <MenuBar
        items={[
          {
            text: 'File',
            children: [{ text: 'Open' }, { text: 'Auto Save', checked: true }],
          },
          { component: 'hr' },
          {
            text: 'Edit',
            children: [{ text: 'Undo', disabled: true }, { text: 'Redo' }],
          },
          { text: 'Help' },
        ]}
      ></MenuBar>
    </BoardRow>
  );
}
