import {
  Popover,
  type PopoverPosition,
  type PopoverOpenedChangedEvent,
  type PopoverTrigger,
} from '../../packages/react-components/src/Popover.js';
import { Button } from '../../packages/react-components/src/Button.js';
import { Tooltip } from '../../packages/react-components/src/Tooltip.js';
import { useState } from 'react';

export default function PopoverPage() {
  const [opened, setOpened] = useState(false);
  const [position, setPosition] = useState<PopoverPosition>('bottom');
  const [modal, setModal] = useState(false);
  const [withBackdrop, setWithBackdrop] = useState(false);
  const [theme, setTheme] = useState('');
  const [useTooltip, setUseTooltip] = useState(false);
  const [contentWidth, setContentWidth] = useState('');
  const [contentHeight, setContentHeight] = useState('');
  const [content, setContent] = useState('This is the popover content');
  const [useRichContent, setUseRichContent] = useState(false);

  const [triggerClick, setTriggerClick] = useState(true);
  const [triggerHover, setTriggerHover] = useState(false);
  const [triggerFocus, setTriggerFocus] = useState(false);
  const [hoverDelay, setHoverDelay] = useState(0);
  const [focusDelay, setFocusDelay] = useState(0);

  const [eventLog, setEventLog] = useState<string[]>([]);

  const logEvent = (event: string) => {
    setEventLog((prev) => [`${new Date().toLocaleTimeString()}: ${event}`, ...prev].slice(0, 100));
  };

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto auto', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      {/* Demo component section */}
      <div style={{ gridColumn: '1 / -1' }}>
        <h1>Popover</h1>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
          <Button id="target">Target Element</Button>
          <Popover
            for="target"
            opened={opened}
            onOpenedChanged={(e: PopoverOpenedChangedEvent) => {
              setOpened(e.detail.value);
              logEvent(`opened-changed: ${e.detail.value}`);
            }}
            position={position}
            modal={modal}
            withBackdrop={withBackdrop}
            theme={theme}
            contentWidth={contentWidth}
            contentHeight={contentHeight}
            trigger={
              [
                ...(triggerClick ? ['click'] : []),
                ...(triggerHover ? ['hover'] : []),
                ...(triggerFocus ? ['focus'] : []),
              ] as PopoverTrigger[]
            }
            hoverDelay={hoverDelay}
            focusDelay={focusDelay}
          >
            {useTooltip ? <Tooltip slot="tooltip" text="This is a tooltip" /> : null}
            <div style={{ padding: theme.includes('no-padding') ? '0' : '1em' }}>
              {useRichContent ? (
                <div>
                  <h3 style={{ margin: '0 0 0.5em 0' }}>Rich Content Example</h3>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5em' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#1676F3',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '10px',
                      }}
                    >
                      VA
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>Vaadin User</div>
                      <div style={{ fontSize: '0.8em', color: '#666' }}>vaadin@example.com</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '1em' }}>
                    <Button theme="primary">Action Button</Button>
                  </div>
                </div>
              ) : (
                content
              )}
            </div>
          </Popover>
        </div>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Button onClick={() => setOpened(!opened)}>{opened ? 'Close Popover' : 'Open Popover'}</Button>
        </div>
      </div>

      {/* Configuration section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
        <h2>Configuration</h2>
        <label>
          Position:
          <select value={position} onChange={(e) => setPosition(e.target.value as PopoverPosition)}>
            <option value="top">top</option>
            <option value="top-start">top-start</option>
            <option value="top-end">top-end</option>
            <option value="bottom">bottom</option>
            <option value="bottom-start">bottom-start</option>
            <option value="bottom-end">bottom-end</option>
            <option value="start">start</option>
            <option value="start-top">start-top</option>
            <option value="start-bottom">start-bottom</option>
            <option value="end">end</option>
            <option value="end-top">end-top</option>
            <option value="end-bottom">end-bottom</option>
          </select>
        </label>
        <label>
          <input type="checkbox" checked={opened} onChange={() => setOpened(!opened)} /> Opened
        </label>
        <label>
          <input type="checkbox" checked={modal} onChange={() => setModal(!modal)} /> Modal
        </label>
        <label>
          <input
            type="checkbox"
            checked={withBackdrop}
            onChange={() => setWithBackdrop(!withBackdrop)}
            disabled={!modal}
          />
          With Backdrop (requires modal)
        </label>
        <label>
          Theme:
          <div>
            <label>
              <input
                type="checkbox"
                checked={theme.includes('arrow')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setTheme(theme ? `${theme} arrow` : 'arrow');
                  } else {
                    setTheme(theme.replace('arrow', '').trim());
                  }
                }}
              />
              Arrow
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={theme.includes('no-padding')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setTheme(theme ? `${theme} no-padding` : 'no-padding');
                  } else {
                    setTheme(theme.replace('no-padding', '').trim());
                  }
                }}
              />
              No Padding
            </label>
          </div>
        </label>
        <label>
          <input type="checkbox" checked={useTooltip} onChange={() => setUseTooltip(!useTooltip)} /> Use tooltip
        </label>
        <label>
          <input type="checkbox" checked={useRichContent} onChange={() => setUseRichContent(!useRichContent)} /> Use
          rich content
        </label>
        <label>
          Content Width:
          <input
            type="text"
            value={contentWidth}
            onChange={(e) => setContentWidth(e.target.value)}
            placeholder="e.g., 300px, 50%, etc."
          />
        </label>
        <label>
          Content Height:
          <input
            type="text"
            value={contentHeight}
            onChange={(e) => setContentHeight(e.target.value)}
            placeholder="e.g., 200px, auto, etc."
          />
        </label>
        <label style={{ opacity: useRichContent ? 0.5 : 1 }}>
          Content:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            cols={30}
            disabled={useRichContent}
          />
        </label>

        <h3>Opening Triggers</h3>
        <div>
          <label>
            <input type="checkbox" checked={triggerClick} onChange={() => setTriggerClick(!triggerClick)} />
            Click
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" checked={triggerHover} onChange={() => setTriggerHover(!triggerHover)} />
            Hover
          </label>
          <div style={{ marginLeft: '20px', opacity: triggerHover ? 1 : 0.5 }}>
            <label>
              Hover Delay (ms):
              <input
                type="number"
                value={hoverDelay}
                onChange={(e) => setHoverDelay(parseInt(e.target.value) || 0)}
                min="0"
                step="100"
                disabled={!triggerHover}
              />
            </label>
          </div>
        </div>
        <div>
          <label>
            <input type="checkbox" checked={triggerFocus} onChange={() => setTriggerFocus(!triggerFocus)} />
            Focus
          </label>
          <div style={{ marginLeft: '20px', opacity: triggerFocus ? 1 : 0.5 }}>
            <label>
              Focus Delay (ms):
              <input
                type="number"
                value={focusDelay}
                onChange={(e) => setFocusDelay(parseInt(e.target.value) || 0)}
                min="0"
                step="100"
                disabled={!triggerFocus}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Event log section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2>Event Log</h2>
        <div
          style={{
            height: '300px',
            overflowY: 'auto',
            border: '1px solid #ccc',
            padding: '10px',
            background: '#f9f9f9',
          }}
        >
          {eventLog.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
