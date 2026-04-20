import React, { useState } from 'react';
import { MasterDetailLayout } from '../../packages/react-components/src/MasterDetailLayout.js';
import { Button } from '../../packages/react-components/src/Button.js';
import { RadioButton } from '../../packages/react-components/src/RadioButton.js';
import { RadioGroup } from '../../packages/react-components/src/RadioGroup.js';
import { TextField } from '../../packages/react-components/src/TextField.js';
import './master-detail-layout-styles.css';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi suscipit rem, non temporibus laboriosam maiores distinctio numquam, dolorum ducimus dolores sequi reprehenderit iste consectetur adipisci delectus aperiam voluptatibus! Vitae, adipisci.';

function DetailContent({ id, onClose, onReplace }: { id: number; onClose: () => void; onReplace: () => void }) {
  return (
    <div style={{ boxSizing: 'border-box', height: '100%', padding: '1.5rem', overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em', marginBottom: '1em' }}>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={onReplace}>Replace</Button>
        <span>Detail #{id}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: '1em' }}>
        <TextField label="First Name" />
        <TextField label="Last Name" />
        <TextField label="Email" />
      </div>
    </div>
  );
}

export default function () {
  const [orientation, setOrientation] = useState('horizontal');
  const [masterSize, setMasterSize] = useState('auto');
  const [detailSize, setDetailSize] = useState('auto');
  const [overlaySize, setOverlaySize] = useState('auto');
  const [detailId, setDetailId] = useState(0);
  const detailOpen = detailId > 0;

  const openDetail = () => setDetailId((id) => id + 1);
  const closeDetail = () => setDetailId(0);

  const sizeOrUndefined = (value: string) => (value === 'auto' ? undefined : value);

  return (
    <div style={{ height: '100%', maxWidth: '100%', maxHeight: '100%', overflow: 'hidden', padding: '10px' }}>
      <MasterDetailLayout
        style={{ border: '1px solid lightgray', resize: 'both' }}
        orientation={orientation as 'horizontal' | 'vertical'}
        masterSize={sizeOrUndefined(masterSize)}
        detailSize={sizeOrUndefined(detailSize)}
        overlaySize={sizeOrUndefined(overlaySize)}
        onBackdropClick={closeDetail}
      >
        <MasterDetailLayout.Master>
          <div style={{ boxSizing: 'border-box', height: '100%', padding: '1.5rem', overflow: 'auto' }}>
            <RadioGroup
              label="Orientation"
              theme="vertical"
              value={orientation}
              onValueChanged={(e) => setOrientation(e.detail.value)}
            >
              <RadioButton value="horizontal" label="Horizontal" />
              <RadioButton value="vertical" label="Vertical" />
            </RadioGroup>

            <RadioGroup
              label="Overlay Size"
              theme="vertical"
              value={overlaySize}
              onValueChanged={(e) => setOverlaySize(e.detail.value)}
            >
              <RadioButton value="auto" label="Auto" />
              <RadioButton value="300px" label="300px" />
              <RadioButton value="100%" label="100%" />
            </RadioGroup>

            <br />

            <RadioGroup
              label="Master Size"
              theme="vertical"
              value={masterSize}
              onValueChanged={(e) => setMasterSize(e.detail.value)}
            >
              <RadioButton value="auto" label="Auto" />
              <RadioButton value="250px" label="250px" />
              <RadioButton value="30%" label="30%" />
            </RadioGroup>

            <RadioGroup
              label="Detail Size"
              theme="vertical"
              value={detailSize}
              onValueChanged={(e) => setDetailSize(e.detail.value)}
            >
              <RadioButton value="auto" label="Auto" />
              <RadioButton value="300px" label="300px" />
              <RadioButton value="70%" label="70%" />
            </RadioGroup>

            <br />

            <Button onClick={openDetail}>Open Detail</Button>

            <p>{lorem}</p>
          </div>
        </MasterDetailLayout.Master>
        <MasterDetailLayout.Detail>
          {detailOpen && <DetailContent key={detailId} id={detailId} onClose={closeDetail} onReplace={openDetail} />}
        </MasterDetailLayout.Detail>
      </MasterDetailLayout>
    </div>
  );
}
