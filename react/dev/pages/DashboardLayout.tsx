import { DashboardLayout } from '../../packages/react-components-pro/src/DashboardLayout.js';
import { DashboardWidget } from '../../packages/react-components-pro/src/DashboardWidget.js';
import { DashboardSection } from '../../packages/react-components-pro/src/DashboardSection.js';
import type { CSSProperties } from 'react';
import './dashboard-styles.css';

const colspan2 = {
  '--vaadin-dashboard-item-colspan': '2',
} as CSSProperties;

const rowspan2 = {
  '--vaadin-dashboard-item-rowspan': '2',
} as CSSProperties;

export default function () {
  return (
    <DashboardLayout>
      <DashboardWidget widgetTitle="Total cost">
        <span slot="header-content">2023-2024</span>
        <div className="kpi-number">+203%</div>
      </DashboardWidget>

      <DashboardWidget style={colspan2} widgetTitle="Sales">
        <span slot="header-content">2023-2024</span>
        <div className="chart"></div>
      </DashboardWidget>

      <DashboardSection sectionTitle="Section">
        <DashboardWidget style={rowspan2} widgetTitle="Sales closed this month">
          <div className="kpi-number">54 000€</div>
        </DashboardWidget>

        <DashboardWidget widgetTitle="Just some number">
          <span slot="header-content">2014-2024</span>
          <div className="kpi-number">1234</div>
        </DashboardWidget>
      </DashboardSection>

      <DashboardWidget>
        <h2 slot="title">Activity since 2023</h2>
        <div className="chart"></div>
      </DashboardWidget>
    </DashboardLayout>
  );
}
