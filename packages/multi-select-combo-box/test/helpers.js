export const getDataProvider = (allItems) => (params, callback) => {
  const offset = params.page * params.pageSize;
  const filteredItems = allItems.filter((item) => item.indexOf(params.filter) > -1);
  const size = filteredItems.length;
  const items = filteredItems.slice(offset, offset + params.pageSize);
  callback(items, size);
};

export const getAsyncDataProvider = (allItems) => {
  const dataProvider = getDataProvider(allItems);

  return (params, callback) => {
    setTimeout(() => {
      dataProvider(params, callback);
    }, 0);
  };
};

/**
 * Returns all the items of the combo box dropdown.
 */
export const getAllItems = (comboBox) => {
  return Array.from(comboBox._scroller.querySelectorAll('vaadin-multi-select-combo-box-item'))
    .filter((item) => !item.hidden)
    .sort((a, b) => a.index - b.index);
};

/**
 * Returns first item of the combo box dropdown.
 */
export const getFirstItem = (comboBox) => {
  return comboBox._scroller.querySelector('vaadin-multi-select-combo-box-item');
};
