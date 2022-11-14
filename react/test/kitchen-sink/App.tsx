import { useState } from 'react';
import '../../css/lumo/Typography.css';
import { AppLayout } from '../../src/AppLayout.js';
import { Avatar } from '../../src/Avatar.js';
import { Board } from '../../src/Board.js';
import { Button } from '../../src/Button.js';
import { DrawerToggle } from '../../src/DrawerToggle.js';
import { Notification } from '../../src/Notification.js';
import { Tab } from '../../src/Tab.js';
import { Tabs } from '../../src/Tabs.js';
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
      </Board>
    </AppLayout>
  );
}
