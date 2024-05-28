import { Button } from '../../packages/react-components/src/Button.js';
import { Popover } from '../../packages/react-components/src/Popover.js';

export default function () {
  return (
    <>
      <Popover for="button">
        <Button>Click me</Button>
      </Popover>

      <Button id="button">Toggle popover</Button>
    </>
  );
}
