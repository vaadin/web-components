export * from './generated/TabSheet.js';

/**
 * A helper function that allows declaring the tab identifier on the children
 * of the `<TabSheet/>` component
 *
 * ### Usage
 *
 * ```tsx
 * <TabSheet>
 *   <Tabs slot="tabs">
 *     <Tab id="about">About</Tab>
 *     <Tab id="contuct">Contact us</Tab>
 *   </Tabs>
 *   <div {...tab('about')}>This tab is all about,..</div>
 *   <div {...tab('contact')}>Our website: ...</div>
 * </TabSheet>
 * ```
 *
 * @param tab The identifier of the correspoding tab.
 *
 * @returns object with HTML attribute values recognized on tab sheet children.
 */
export function tab(tab: string): Record<string, string> {
  return { tab } as Record<string, string>;
}
