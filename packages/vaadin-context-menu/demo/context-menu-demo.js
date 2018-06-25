/* @polymerMixin */
window.ContextMenuDemo = superClass => {
  return class extends superClass {
    static get properties() {
      return {
      };
    }
  };
};

function getNewItem() {
  function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  const names = ['Artur', 'Patrik', 'Henrik', 'Teemu'];
  const surnames = ['Signell', 'Lehtinen', 'Ahlroos', 'Paul'];
  return {
    name: random(names),
    surname: random(surnames),
    effort: Math.floor(Math.random() * 6)
  };
}

function getItems() {
  const items = [];
  for (let i = 0; i < 100; i++) {
    items.push(getNewItem());
  }
  return items;
}

