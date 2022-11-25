import { createRef } from 'react';

export default function createOverlayCloseCatcher<T extends HTMLElement>(name: string, close: (ref: T) => void) {
  const ref = createRef<T>();

  const catcher = async () => {
    await new Promise<void>((resolve) => {
      const observer = new MutationObserver((mutations) => {
        if (
          mutations
            .flatMap(({ removedNodes }) => Array.from(removedNodes))
            .some((node) => node instanceof HTMLElement && node.localName === name)
        ) {
          resolve();
        }
      });

      observer.observe(document.body, { childList: true });

      if (ref.current) {
        close(ref.current);
      }
    });
  };

  return [ref, catcher] as const;
}
