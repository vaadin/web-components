import { Button } from '../../packages/react-components/src/Button.js';
import { Tooltip } from '../../packages/react-components/src/Tooltip.js';

export default function () {
  return (
    <Button>
      Edit
      <Tooltip slot="tooltip" text="Click to edit" />
    </Button>
  );
}
