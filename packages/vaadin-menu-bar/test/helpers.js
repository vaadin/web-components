window.arrowRight = function(target) {
  MockInteractions.keyDownOn(target, 39, [], 'ArrowRight');
};

window.arrowLeft = function(target) {
  MockInteractions.keyDownOn(target, 37, [], 'ArrowLeft');
};

window.arrowUp = function(target) {
  MockInteractions.keyDownOn(target, 38, [], 'ArrowUp');
};

window.arrowDown = function(target) {
  MockInteractions.keyDownOn(target, 40, [], 'ArrowDown');
};

window.home = function(target) {
  MockInteractions.keyDownOn(target, 36, [], 'Home');
};

window.end = function(target) {
  MockInteractions.keyDownOn(target, 35, [], 'End');
};

window.esc = function(target) {
  MockInteractions.keyDownOn(target, 27, [], 'Escape');
};

window.onceOpened = function(element) {
  return new Promise(resolve => {
    const listener = (e) => {
      if (e.detail.value) {
        element.removeEventListener('opened-changed', listener);
        resolve();
      }
    };
    element.addEventListener('opened-changed', listener);
  });
};
