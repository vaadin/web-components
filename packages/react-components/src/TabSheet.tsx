import React, { forwardRef, useId, type ForwardedRef, type ReactNode } from 'react';
import { Tab, type TabProps } from './Tab.js';
import {
  TabSheet as _TabSheet,
  type TabSheetElement,
  type TabSheetProps as _TabSheetProps,
} from './generated/TabSheet.js';
import { Tabs } from './Tabs.js';

export * from './generated/TabSheet.js';

type TabSheetTabProps = Omit<TabProps, 'selected' | 'value'> & {
  /**
   * The label of the tab.
   */
  label?: ReactNode;
};

type TabSheetTab = React.ReactElement<TabSheetTabProps>;

/**
 * `TabSheetTab` is a helper component designed for creating tabs within a `<TabSheet/>`.
 * Use this component as a direct child of the `<TabSheet/>` component.
 * It accepts a `label` property, which can be either a string or a React node.
 * The children of the component will be rendered as the content of the tab.
 *
 * ### Usage
 *
 * ```tsx
 * <TabSheet>
 *   <TabSheetTab label="Dashboard">
 *     <div>This is the Dashboard tab content</div>
 *   </TabSheetTab>
 *
 *   <TabSheetTab label={<i>Payment</i>}>
 *     <div>This is the Payment tab content</div>
 *   </TabSheetTab>
 * </TabSheet>
 * ```
 */
export const TabSheetTab = (_props: TabSheetTabProps) => null;

function getTabId(tab: TabSheetTab, instanceId: string, index: number) {
  if (tab.props.id) {
    // Support custom id for a tabsheet tab
    return tab.props.id;
  }

  // Derive a stable id from the TabSheet instance id and the child's key.
  const key = tab.key ?? String(index);
  return `${instanceId}tab${key}`;
}

export type TabSheetProps = Partial<Omit<_TabSheetProps, 'items'>>;

function TabSheet(props: TabSheetProps, ref: ForwardedRef<TabSheetElement>) {
  const { children, ...tabSheetRest } = props;
  const instanceId = useId();

  // The direct TabSheetTab children of the TabSheet
  const tabs = React.Children.toArray(children).filter((child): child is TabSheetTab => {
    return React.isValidElement(child) && child.type === TabSheetTab;
  });

  // All the other children of the TabSheet
  const remainingChildren = React.Children.toArray(children).filter((child) => {
    return React.isValidElement(child) && child.type !== TabSheetTab;
  });

  return (
    <_TabSheet {...tabSheetRest} ref={ref}>
      {tabs.length > 0 ? (
        <Tabs slot="tabs">
          {tabs.map((child, index) => {
            const { children, label, ...tabRest } = child.props;
            const tabId = getTabId(child, instanceId, index);
            return (
              <Tab {...tabRest} id={tabId} key={tabId}>
                {child.props.label}
              </Tab>
            );
          })}
        </Tabs>
      ) : null}

      {tabs.map((child, index) => {
        const tabId = getTabId(child, instanceId, index);
        return (
          <div style={{ display: 'contents' }} {...{ tab: tabId }} key={tabId}>
            {child.props.children}
          </div>
        );
      })}

      {remainingChildren}
    </_TabSheet>
  );
}

const ForwardedTabSheet = forwardRef(TabSheet);

export { ForwardedTabSheet as TabSheet };
