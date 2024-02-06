import { SideNav } from '../../packages/react-components/src/SideNav.js';
import { SideNavItem } from '../../packages/react-components/src/SideNavItem.js';
import { Accordion } from '../../packages/react-components/src/Accordion.js';
import { AccordionHeading } from '../../packages/react-components/src/AccordionHeading.js';
import { AccordionPanel } from '../../packages/react-components/src/AccordionPanel.js';
import { AvatarGroup } from '../../packages/react-components/src/AvatarGroup.js';
import { BoardRow } from '../../packages/react-components/src/BoardRow.js';
import { Chart } from '../../packages/react-components/src/Chart.js';
import { ChartSeries } from '../../packages/react-components/src/ChartSeries.js';

export default function Row1() {
  return (
    <BoardRow>
      <SideNav>
        <SideNavItem>Side Navigation Item 1</SideNavItem>
        <SideNavItem>Side Navigation Item 2</SideNavItem>
        <SideNavItem>Side Navigation Item 3</SideNavItem>
      </SideNav>
      <Accordion theme="primary">
        <AccordionPanel summary="Panel 1">
          <div>Accordion content 1</div>
        </AccordionPanel>
        <AccordionPanel>
          <AccordionHeading slot="summary">Panel 2</AccordionHeading>
          <div>Accordion content 2</div>
        </AccordionPanel>
      </Accordion>
      <AvatarGroup prefix="Users: " items={[{ name: 'Jane Roe', abbr: 'JD' }]}></AvatarGroup>
      <Chart title="Chart" style={{ height: '300px' }}>
        <ChartSeries title="Items" type="bar" values={[10, 20, 30]}></ChartSeries>
      </Chart>
    </BoardRow>
  );
}
