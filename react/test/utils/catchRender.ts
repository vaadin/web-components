const observerOptions = {
  childList: true,
  subtree: true,
};

export type CatchRenderCondition = (node: Node) => boolean;

export default function catchRender(root: Element, condition: CatchRenderCondition) {
  return new Promise<void>((resolve) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);

    let currentNode: Node | null = walker.currentNode;

    while (currentNode !== null) {
      if (condition(currentNode)) {
        resolve();
        return;
      }

      currentNode = walker.nextNode();
    }

    const observer = new MutationObserver((mutations) => {
      if (mutations.flatMap(({ addedNodes }) => Array.from(addedNodes)).some(condition)) {
        resolve();
      }
    });

    observer.observe(root, observerOptions);
  });
}
