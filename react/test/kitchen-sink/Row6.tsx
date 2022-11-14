import { BoardRow } from '../../src/BoardRow.js';
import { HorizontalLayout } from '../../src/HorizontalLayout.js';
import { Icon } from '../../src/Icon.js';
import { Iconset } from '../../src/Iconset.js';
import { LoginForm } from '../../src/LoginForm.js';
import { LoginOverlay } from '../../src/LoginOverlay.js';
import { MenuBar } from '../../src/MenuBar.js';
import { Scroller } from '../../src/Scroller.js';
import { VerticalLayout } from '../../src/VerticalLayout.js';

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
