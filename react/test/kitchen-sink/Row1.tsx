import { SideNav } from '../../src/SideNav.js';
import { SideNavItem } from '../../src/SideNavItem.js';
import { Accordion } from '../../src/Accordion.js';
import { AccordionPanel } from '../../src/AccordionPanel.js';
import { AvatarGroup } from '../../src/AvatarGroup.js';
import { BoardRow } from '../../src/BoardRow.js';
import { Chart } from '../../src/Chart.js';
import { ChartSeries } from '../../src/ChartSeries.js';

export default function Row1() {
  return (
    <BoardRow>
      <SideNav>
        <SideNavItem>Side Navigation Item 1</SideNavItem>
        <SideNavItem>Side Navigation Item 2</SideNavItem>
        <SideNavItem>Side Navigation Item 3</SideNavItem>
      </SideNav>
      <Accordion theme="primary">
        <AccordionPanel>
          <div slot="summary">AccordeonPanel</div>
          <div>Accordion content 1</div>
        </AccordionPanel>
      </Accordion>
      <AvatarGroup prefix="Users: " items={[{ name: 'Jane Roe', abbr: 'JD' }]}></AvatarGroup>
      <Chart title="Chart" style={{ height: '300px' }}>
        <ChartSeries title="Items" type="bar" values={[10, 20, 30]}></ChartSeries>
      </Chart>
    </BoardRow>
  );
}
