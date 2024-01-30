import { type ReactElement, type ReactPortal } from 'react';
import { createPortal } from 'react-dom';

type ItemWithReactElementComponent<T> = T & {
  component?: ReactElement | string;
  children?: Array<ItemWithReactElementComponent<T>>;
};

type ItemWithHTMLElementComponent<T> = T & {
  component?: HTMLElement | string;
  children?: Array<ItemWithHTMLElementComponent<T>>;
  __item?: ItemWithReactElementComponent<unknown>;
};

/**
 * This function transforms a hierarchical list of items, where each item may contain a React component,
 * into a list of items where each React component is replaced with an HTMLElement.
 *
 * The React components are not simply removed, but are instead rendered into portals.
 * The HTMLElements created for the portals have the given tag name.
 */
export function mapItemsWithComponents<T>(
  items?: Array<ItemWithReactElementComponent<T>>,
  wrapperTagName = 'div',
): [Array<ReactPortal>, Array<ItemWithHTMLElementComponent<Omit<T, 'children' | 'component'>>> | undefined] {
  const itemPortals: ReactPortal[] = [];

  const webComponentItems = items?.map((item) => {
    const { component, children, ...rest } = item;

    // Recursively map children
    const [childPortals, webComponentChildren] = mapItemsWithComponents(children, wrapperTagName);
    itemPortals.push(...childPortals);

    if (component && typeof component !== 'string') {
      // Component is a React element, create a portal for it
      const root = document.createElement(wrapperTagName);
      itemPortals.push(createPortal(component, root));

      return {
        ...rest,
        component: root,
        children: webComponentChildren,
        __item: item,
      };
    } else {
      return {
        // Component is a string, or undefined, add it as such
        ...rest,
        component,
        children: webComponentChildren,
        __item: item,
      };
    }
  });

  return [itemPortals, webComponentItems];
}

/**
 * Returns the original item related to the given mapped item.
 */
export function getOriginalItem<T>(mappedItem: ItemWithHTMLElementComponent<T>) {
  return mappedItem.__item;
}
