import React from 'react';
import { Button, MenuBar, useCustomElements } from '@vaadin/react-components';

useCustomElements([Button, MenuBar]);

export default function App() {
  return (
    <div>
      <Button>Click me</Button>
      <MenuBar items={[ { text: 'Menu item'} ]} ></MenuBar>
    </div>
  );
}
