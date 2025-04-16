import {
  MasterDetailLayout as _MasterDetailLayout,
  MasterDetailLayoutElement,
} from './generated/MasterDetailLayout.js';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

export * from './generated/MasterDetailLayout.js';

type MasterProps = React.PropsWithChildren<{}>;
type DetailProps = React.PropsWithChildren<{}>;

type MasterDetailLayoutElementWithInternalAPI = MasterDetailLayoutElement & {
  _startTransition: (transitionType: 'add' | 'remove' | 'replace', callback: () => void) => void;
  _finishTransition: () => Promise<void>;
};

function Master({ children }: MasterProps) {
  return children;
}

/**
 * Compares two sets of React children to detect meaningful changes, ignoring text nodes.
 * Compares by component type and key.
 *
 * @param prevChildren Previous children
 * @param nextChildren Current children
 * @returns True if the non-text children are meaningfully different, false otherwise
 */
export function areChildrenDifferent(prevChildren: React.ReactNode, nextChildren: React.ReactNode): boolean {
  // Convert to arrays and filter out text nodes
  const prevArray = React.Children.toArray(prevChildren).filter((child) => React.isValidElement(child));
  const nextArray = React.Children.toArray(nextChildren).filter((child) => React.isValidElement(child));

  // If lengths are different, children have changed
  if (prevArray.length !== nextArray.length) {
    return true;
  }

  // Compare each element by type and key
  for (let i = 0; i < prevArray.length; i++) {
    const prevChild = prevArray[i] as React.ReactElement;
    const nextChild = nextArray[i] as React.ReactElement;

    // Compare by type
    if (prevChild.type !== nextChild.type) {
      return true;
    }

    // Compare by key (React.Children.toArray adds keys if missing)
    if (prevChild.key !== nextChild.key) {
      return true;
    }
  }

  return false;
}

function Detail({ children }: DetailProps) {
  const currentDetailsRef = useRef<HTMLDivElement>(null);
  const currentDetailsKey = useRef<number>(0);
  const nextDetailsRef = useRef<HTMLDivElement>(null);
  const nextDetailsKey = currentDetailsKey.current + 1;
  const [state, setState] = useState('idle');
  const [currentChildren, setCurrentChildren] = useState(children);

  useLayoutEffect(() => {
    const layout = currentDetailsRef.current?.closest(
      'vaadin-master-detail-layout',
    ) as MasterDetailLayoutElementWithInternalAPI;
    if (!layout) {
      return;
    }

    if (state === 'idle') {
      // No transition in progress
      // Just update slot name
      const hasChildren = currentDetailsRef.current!.childElementCount > 0;
      currentDetailsRef.current!.setAttribute('slot', hasChildren ? 'detail' : 'detail-hidden');
    } else if (state === 'starting') {
      // Transition is starting and old and (invisible) new details are rendered
      // Determine the transition type based on old and new detail contents
      const hasCurrentDetails = currentDetailsRef.current!.childElementCount > 0;
      const hasNextDetails = nextDetailsRef.current!.childElementCount > 0;
      const transitionType = hasCurrentDetails && hasNextDetails ? 'replace' : hasCurrentDetails ? 'remove' : 'add';
      // Start transition to capture old DOM state
      layout._startTransition(transitionType, () => {
        // Once old DOM state is captured, render with new details only
        setState('ready');
        setCurrentChildren(children);
        currentDetailsKey.current = nextDetailsKey;
      });
    } else if (state === 'ready') {
      // Transition is ready and new details are rendered
      // Update slot name to either show or hide the new details
      const hasChildren = currentDetailsRef.current!.childElementCount > 0;
      currentDetailsRef.current!.setAttribute('slot', hasChildren ? 'detail' : 'detail-hidden');
      // Finish transition to animate to new DOM state
      layout._finishTransition().then(() => {
        // Transition is finished, reset state
        setState('idle');
      });
    }
  }, [state, currentChildren]);

  useEffect(() => {
    if (state !== 'idle') {
      return;
    }
    if (areChildrenDifferent(currentChildren, children)) {
      setState('starting');
    } else {
      setCurrentChildren(children);
    }
  }, [state, children]);

  return (
    <>
      <div ref={currentDetailsRef} key={currentDetailsKey.current} style={{ display: 'contents' }}>
        {currentChildren}
      </div>
      {state === 'starting' && (
        <div ref={nextDetailsRef} key={nextDetailsKey} style={{ display: 'none' }}>
          {children}
        </div>
      )}
    </>
  );
}

const MasterDetailLayout = _MasterDetailLayout as React.ComponentType<
  React.ComponentProps<typeof _MasterDetailLayout>
> & {
  Master: React.FC<MasterProps>;
  Detail: React.FC<DetailProps>;
};
MasterDetailLayout.Master = Master;
MasterDetailLayout.Detail = Detail;

export { MasterDetailLayout };
