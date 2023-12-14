import { Button } from '../../src/Button.js';
import { Tooltip } from '../../src/Tooltip.js';

export default function () {
  return (
    <Button>
      Edit
      <Tooltip slot="tooltip" text="Click to edit" />
    </Button>
  );
}
