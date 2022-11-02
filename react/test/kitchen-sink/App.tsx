import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from 'react';
import { Accordion } from '../../src/Accordion.js';
import { AccordionPanel } from '../../src/AccordionPanel.js';
import { AppLayout } from '../../src/AppLayout.js';
import { Avatar } from '../../src/Avatar.js';
import { AvatarGroup } from '../../src/AvatarGroup.js';
import { Board } from '../../src/Board.js';
import { BoardRow } from '../../src/BoardRow.js';
import { Button } from '../../src/Button.js';
import { Chart, ChartModule } from '../../src/Chart.js';
import { Checkbox } from '../../src/Checkbox.js';
import { CheckboxGroup } from '../../src/CheckboxGroup.js';
import { ComboBox } from '../../src/ComboBox.js';
import { ConfirmDialog } from '../../src/ConfirmDialog.js';
import { ContextMenu } from '../../src/ContextMenu.js';
import { CookieConsent } from '../../src/CookieConsent.js';
import { Crud } from '../../src/Crud.js';
import { CustomField } from '../../src/CustomField.js';
import { Details } from '../../src/Details.js';
import { DrawerToggle } from '../../src/DrawerToggle.js';
import { FormItem } from '../../src/FormItem.js';
import { FormLayout } from '../../src/FormLayout.js';
import { ChartSeries } from '../../src/generated/ChartSeries.js';
import { Grid } from '../../src/Grid.js';
import { GridColumn } from '../../src/GridColumn.js';
import { GridColumnGroup } from '../../src/GridColumnGroup.js';
import { GridFilterColumn } from '../../src/GridFilterColumn.js';
import { GridPro } from '../../src/GridPro.js';
import { GridProEditColumn } from '../../src/GridProEditColumn.js';
import { GridSortColumn } from '../../src/GridSortColumn.js';
import { GridTreeColumn } from '../../src/GridTreeColumn.js';
import { HorizontalLayout } from '../../src/HorizontalLayout.js';
import { Icon } from '../../src/Icon.js';
import { Iconset } from '../../src/Iconset.js';
import { IntegerField } from '../../src/IntegerField.js';
import { Item } from '../../src/Item.js';
import { ListBox } from '../../src/ListBox.js';
import { LoginForm } from '../../src/LoginForm.js';
import { LoginOverlay } from '../../src/LoginOverlay.js';
import { MenuBar } from '../../src/MenuBar.js';
import { Message } from '../../src/Message.js';
import { MessageInput } from '../../src/MessageInput.js';
import { MessageList } from '../../src/MessageList.js';
import { NumberField } from '../../src/NumberField.js';
import { PasswordField } from '../../src/PasswordField.js';
import { RadioButton } from '../../src/RadioButton.js';
import { RadioGroup } from '../../src/RadioGroup.js';
import type { GridBodyReactRendererProps } from '../../src/renderers/grid.js';
import { RichTextEditor } from '../../src/RichTextEditor.js';
import { Scroller } from '../../src/Scroller.js';
import { Select } from '../../src/Select.js';
import { SplitLayout } from '../../src/SplitLayout.js';
import { Tab } from '../../src/Tab.js';
import { Tabs } from '../../src/Tabs.js';
import { TextArea } from '../../src/TextArea.js';
import { TextField } from '../../src/TextField.js';
import { Tooltip } from '../../src/Tooltip.js';
import { Upload } from '../../src/Upload.js';
import { VerticalLayout } from '../../src/VerticalLayout.js';
import { VirtualList } from '../../src/VirtualList.js';

type TreeGridDataItem = {
  id: number;
  size: number;
  name: string;
  children?: TreeGridDataItem[];
};

const treeGridData: TreeGridDataItem[] = [
  {
    id: 1,
    size: 20,
    name: 'Branch 1',
    children: [
      { id: 2, size: 5, name: 'Leaf 1' },
      { id: 3, size: 10, name: 'Leaf 2' },
    ],
  },
  {
    id: 4,
    size: 15,
    name: 'Branch 2',
    children: [
      { id: 5, size: 5, name: 'Leaf 1' },
      { id: 6, size: 10, name: 'Leaf 2' },
    ],
  },
];

enum CrudRole {
  ADMIN = 'admin',
  USER = 'user',
}

type CrudDataItem = {
  name: string;
  role: CrudRole;
  active: boolean;
};

const crudData: CrudDataItem[] = [
  { name: 'Jane Doe', role: CrudRole.ADMIN, active: true },
  { name: 'Mary Joe', role: CrudRole.USER, active: false },
];

const displayColor: CSSProperties = { color: 'blueviolet' };

function Display({ item: { name } }: GridBodyReactRendererProps<CrudDataItem>) {
  return <div style={displayColor}>{name}</div>;
}

export default function App({}) {
  return (
    <AppLayout>
      <DrawerToggle slot="navbar"></DrawerToggle>
      <h3 slot="navbar" style={{ flex: 'auto' }}>
        Kitchen Sink
      </h3>
      <Avatar slot="navbar" name="User Name" abbr="UN"></Avatar>
      <Button slot="navbar">Hello</Button>
      <Tabs slot="drawer" orientation="vertical">
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
      </Tabs>
      <Board>
        <BoardRow>
          <Accordion>
            <AccordionPanel>
              <div slot="summary">AccordeonPanel</div>
              <div>Accordion content 1</div>
            </AccordionPanel>
          </Accordion>
          <AvatarGroup prefix="Users: " items={[{ name: 'Jane Roe', abbr: 'JD' }]}></AvatarGroup>
          <Chart title='Chart' style={{ height: '300px' }}>
            <ChartSeries title='Items' type='bar' values={[ 10, 20, 30 ]}></ChartSeries>
          </Chart>
        </BoardRow>
        <BoardRow>
          <CheckboxGroup label="CheckboxGroup">
            <Checkbox value="accept_terms" label="Accept Terms"></Checkbox>
          </CheckboxGroup>
          <ComboBox label="ComboBox" items={['foo', 'bar']}></ComboBox>
          <ConfirmDialog></ConfirmDialog>
        </BoardRow>
        <BoardRow>
          <ContextMenu>
            <ListBox>
              <Item>ListBox Item</Item>
            </ListBox>
          </ContextMenu>
          <CookieConsent position="bottom-right"></CookieConsent>
          {/*<Crud items={crudData}></Crud>*/}
        </BoardRow>
        <BoardRow>
          <CustomField label="Custom field">
            <TextField placeholder="Text"></TextField>
            <NumberField placeholder="Number"></NumberField>
            <IntegerField placeholder="Integer"></IntegerField>
            <PasswordField placeholder="Password"></PasswordField>
          </CustomField>
          <Details opened>
            <h4 slot="summary">Details</h4>
            <p>Details content</p>
          </Details>
          <FormLayout>
            <FormItem>
              <label slot="label">Form item</label>
              <output>value</output>
            </FormItem>
          </FormLayout>
        </BoardRow>
        <BoardRow>
          <Grid items={treeGridData}>
            <GridTreeColumn path="id" itemHasChildrenPath="children"></GridTreeColumn>
            <GridColumnGroup>
              <GridSortColumn path="size"></GridSortColumn>
              <GridFilterColumn path="name"></GridFilterColumn>
            </GridColumnGroup>
          </Grid>
          <GridPro<CrudDataItem> items={crudData}>
            <GridColumn<CrudDataItem> renderer={Display}></GridColumn>
            <GridColumn<CrudDataItem> path="size"></GridColumn>
            <GridProEditColumn<CrudDataItem> path="name" editorType="text"></GridProEditColumn>
            <GridProEditColumn<CrudDataItem> path="name" editorType="text"></GridProEditColumn>
          </GridPro>
        </BoardRow>
        <BoardRow>
          <HorizontalLayout>
            <VerticalLayout>
              <Scroller>Scroller</Scroller>
              <Iconset></Iconset>
              <Icon></Icon>
            </VerticalLayout>
            <VerticalLayout>
              <LoginForm></LoginForm>
              <LoginOverlay></LoginOverlay>
            </VerticalLayout>
          </HorizontalLayout>
          <MenuBar
            items={[
              {
                text: 'File',
                children: [{ text: 'Open' }, { text: 'Auto Save', checked: true }],
              },
              { component: 'hr' },
              {
                text: 'Edit',
                children: [{ text: 'Undo', disabled: true }, { text: 'Redo' }],
              },
              { text: 'Help' },
            ]}
          ></MenuBar>
        </BoardRow>
        <BoardRow>
          <MessageList
            items={[
              { text: 'Hello', time: 'today', userName: 'Bot' },
              { text: 'Message list', time: 'today', userName: 'Bot' },
            ]}
          ></MessageList>
          <Message userName="Test User">Message</Message>
          <MessageInput></MessageInput>
        </BoardRow>
        <BoardRow>
          <RadioGroup>
            <RadioButton>
              <label slot="label">One</label>
            </RadioButton>
            <RadioButton>
              <label slot="label">Two</label>
            </RadioButton>
          </RadioGroup>
          <RichTextEditor></RichTextEditor>
          <Select
            items={[
              { label: 'one', value: '1' },
              { label: 'two', value: '2' },
            ]}
          ></Select>
        </BoardRow>
        <BoardRow>
          <SplitLayout>
            <TextArea label="Text Area"></TextArea>
            <Tooltip text="Tooltip">Tooltip content</Tooltip>
          </SplitLayout>
          <Upload></Upload>
          <VirtualList></VirtualList>
        </BoardRow>
      </Board>
    </AppLayout>
  );
}
