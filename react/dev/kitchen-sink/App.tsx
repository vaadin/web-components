import { useState } from 'react';
import '../../packages/react-components/css/lumo/Typography.css';
import { AppLayout } from '../../packages/react-components/src/AppLayout.js';
import { Avatar } from '../../packages/react-components/src/Avatar.js';
import { Board } from '../../packages/react-components-pro/src/Board.js';
import { Button } from '../../packages/react-components/src/Button.js';
import { DrawerToggle } from '../../packages/react-components/src/DrawerToggle.js';
import { Notification } from '../../packages/react-components/src/Notification.js';
import { Tab } from '../../packages/react-components/src/Tab.js';
import { Tabs } from '../../packages/react-components/src/Tabs.js';
import { TabSheet } from '../../packages/react-components/src/TabSheet.js';
import { DialogComponent } from './DialogComponent.js';
import Row1 from './Row1.js';
import Row2 from './Row2.js';
import Row3 from './Row3.js';
import Row4 from './Row4.js';
import Row5 from './Row5.js';
import Row6 from './Row6.js';
import Row7 from './Row7.js';
import Row8 from './Row8.js';
import Row9 from './Row9.js';
import Row10 from './Row10.js';

export default function App({}) {
  const [notificationOpened, setNotificationOpened] = useState(false);
  const [isDialogOpened, setDialogOpened] = useState(true);

  return (
    <AppLayout>
      <Button onClick={() => setDialogOpened(true)}>Open Dialog</Button>
      <DialogComponent opened={isDialogOpened} close={() => setDialogOpened(false)} />
      <DrawerToggle slot="navbar"></DrawerToggle>
      <h3 slot="navbar" style={{ flex: 'auto' }}>
        Kitchen Sink
      </h3>
      <Avatar slot="navbar" name="User Name" abbr="UN"></Avatar>
      <Button slot="navbar" onClick={() => setNotificationOpened(true)}>
        Hello
      </Button>
      <Notification opened={notificationOpened} onOpenedChanged={(e) => setNotificationOpened(e.detail.value)}>
        Hi
      </Notification>
      <Tabs slot="drawer" orientation="vertical">
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
      </Tabs>
      <Board>
        <Row1 />
        <Row2 />
        <Row3 />
        <Row4 />
        <Row5 />
        <Row6 />
        <Row7 />
        <Row8 />
        <Row9 />
        <Row10 />
      </Board>
    </AppLayout>
  );
}
