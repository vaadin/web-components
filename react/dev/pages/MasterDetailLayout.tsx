import React, { useState } from 'react';
import { MasterDetailLayout } from '../../packages/react-components/src/MasterDetailLayout.js';
import { Checkbox } from '../../packages/react-components/src/Checkbox.js';
import './master-detail-layout-styles.css';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

function MasterContent() {
  const masterContentStyle = {
    height: '100%',
    overflow: 'auto',
  };

  const listStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    padding: '0.5rem',
    gridGap: '0.25rem',
  };

  const itemStyle = {
    padding: '1rem',
    border: 'solid 1px #e2e2e2',
  };

  const headingStyle = {
    margin: '0 0 0.25rem',
  };

  return (
    <div style={masterContentStyle}>
      <div style={listStyle}>
        <div style={itemStyle}>
          <h3 style={headingStyle}>Lorem</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur et quisquam obcaecati!</p>
        </div>
        <div style={itemStyle}>
          <h3 style={headingStyle}>Lorem</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur et quisquam obcaecati!</p>
        </div>
        <div style={itemStyle}>
          <h3 style={headingStyle}>Lorem</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur et quisquam obcaecati!</p>
        </div>
        <div style={itemStyle}>
          <h3 style={headingStyle}>Lorem</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur et quisquam obcaecati!</p>
        </div>
        <div style={itemStyle}>
          <h3 style={headingStyle}>Lorem</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur et quisquam obcaecati!</p>
        </div>
        <div style={itemStyle}>
          <h3 style={headingStyle}>Lorem</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur et quisquam obcaecati!</p>
        </div>
      </div>
    </div>
  );
}

interface DetailContentProps {
  value?: string;
  style?: React.CSSProperties;
}

function DetailContent({ style, value }: DetailContentProps) {
  const formStyle = {
    display: 'flex',
    flexWrap: 'wrap' as any,
    padding: '0.5rem',
    gap: '0.5rem',
  };

  const inputStyle = {
    width: '8rem',
  };

  const fields = Array(12).fill(null);

  return (
    <div style={style}>
      <div style={formStyle}>
        {fields.map((_, index) => (
          <div className="field" key={index}>
            <input type="text" style={inputStyle} value={value} readOnly />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyDetail() {
  return null;
}

export default function () {
  const [detailSize, setDetailSize] = useState(false);
  const [detailMinSize, setDetailMinSize] = useState(false);
  const [masterSize, setMasterSize] = useState(false);
  const [masterMinSize, setMasterMinSize] = useState(false);
  const [containmentViewport, setContainmentViewport] = useState(false);
  const [vertical, setVertical] = useState(false);
  const [maxWidth, setMaxWidth] = useState(false);
  const [maxHeight, setMaxHeight] = useState(false);
  const [forceOverlay, setForceOverlay] = useState(false);
  const [detailContent, setDetailContent] = useState<React.ReactNode>(<DetailContent />);
  const [updateCount, setUpdateCount] = useState(0);

  const layoutStyle: React.CSSProperties = {
    ...(maxWidth ? { maxWidth: '800px' } : {}),
    ...(maxHeight ? { maxHeight: '600px' } : {}),
  };

  const setSmallDetail = () => {
    setUpdateCount(updateCount + 1);
    setDetailContent(<DetailContent style={{ width: '200px' }} key="small" value={updateCount.toString()} />);
  };

  const setLargeDetail = () => {
    setUpdateCount(updateCount + 1);
    setDetailContent(<DetailContent style={{ width: '600px' }} key="large" value={updateCount.toString()} />);
  };

  const setEmptyDetail = () => {
    setDetailContent(<EmptyDetail />);
  };

  const clearDetail = () => {
    setDetailContent(null);
  };

  return (
    <>
      <p>
        <Checkbox label="Set detail size" checked={detailSize} onChange={() => setDetailSize(!detailSize)} />
        <Checkbox
          label="Set detail min-size"
          checked={detailMinSize}
          onChange={() => setDetailMinSize(!detailMinSize)}
        />
        <Checkbox label="Set master size" checked={masterSize} onChange={() => setMasterSize(!masterSize)} />
        <Checkbox
          label="Set master min-size"
          checked={masterMinSize}
          onChange={() => setMasterMinSize(!masterMinSize)}
        />
        <Checkbox
          label="Use viewport containment"
          checked={containmentViewport}
          onChange={() => setContainmentViewport(!containmentViewport)}
        />
        <Checkbox label="Use vertical orientation" checked={vertical} onChange={() => setVertical(!vertical)} />
        <Checkbox label="Use max-width on the host" checked={maxWidth} onChange={() => setMaxWidth(!maxWidth)} />
        <Checkbox label="Use max-height on the host" checked={maxHeight} onChange={() => setMaxHeight(!maxHeight)} />
        <Checkbox label="Force overlay" checked={forceOverlay} onChange={() => setForceOverlay(!forceOverlay)} />
        <button onClick={setSmallDetail}>Set small detail</button>
        <button onClick={setLargeDetail}>Set large detail</button>
        <button onClick={setEmptyDetail}>Set empty detail</button>
        <button onClick={clearDetail}>Clear detail</button>
      </p>
      <MasterDetailLayout
        style={layoutStyle}
        detailSize={detailSize ? '300px' : undefined}
        detailMinSize={detailMinSize ? '300px' : undefined}
        masterSize={masterSize ? '300px' : undefined}
        masterMinSize={masterMinSize ? '300px' : undefined}
        containment={containmentViewport ? 'viewport' : 'layout'}
        orientation={vertical ? 'vertical' : 'horizontal'}
        forceOverlay={forceOverlay}
      >
        <MasterDetailLayout.Master>
          <MasterContent />
        </MasterDetailLayout.Master>
        <MasterDetailLayout.Detail> {detailContent}</MasterDetailLayout.Detail>
      </MasterDetailLayout>
    </>
  );
}
