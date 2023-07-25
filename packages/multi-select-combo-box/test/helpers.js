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
