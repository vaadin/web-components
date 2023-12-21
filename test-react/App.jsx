import React from 'react';
import { Button, useCustomElements } from '@vaadin/react-components';

useCustomElements([Button]);

export default function App() {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  );
}
