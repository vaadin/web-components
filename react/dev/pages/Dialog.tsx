import { Dialog } from '../../src/Dialog.js';
import { Button } from '../../src/Button.js';
import { useState } from 'react';
import { Icon } from '../../src/Icon.js';
import '@vaadin/vaadin-lumo-styles/vaadin-iconset.js';

export default function () {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Dialog
        headerTitle="Title"
        draggable
        resizable
        opened={opened}
        onOpenedChanged={(e) => setOpened(e.detail.value)}
        header={
          <>
            <span>Header content</span>
            <Button theme="tertiary-inline icon" onClick={() => setOpened(false)}>
              <Icon icon="lumo:cross" />
            </Button>
          </>
        }
        footer={
          <>
            <span>Footer content</span>
            <Button theme="primary">Action</Button>
            <Button>Action</Button>
          </>
        }
      >
        <p style={{ marginTop: 0, maxWidth: '40em', minWidth: '100%' }}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio laborum optio quo perferendis unde, fuga
          reprehenderit molestias cum laboriosam ipsa enim voluptatem iusto fugit. Sed, veniam repudiandae consectetur
          recusandae laudantium.
        </p>

        <Button>Click me</Button>
      </Dialog>

      <Button onClick={() => setOpened(true)}>Open dialog</Button>
    </>
  );
}
