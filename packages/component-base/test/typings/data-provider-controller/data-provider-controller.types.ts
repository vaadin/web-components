import type { Cache } from '../../../src/data-provider-controller/cache.js';
import {
  type DataProvider,
  type DataProviderCallback,
  DataProviderController,
} from '../../../src/data-provider-controller/data-provider-controller.js';

const assertType = <TExpected>(actual: TExpected) => actual;

interface TestItem {
  foo: string;
}

type TestDataProviderParams = {
  bar: string;
};

const dataProvider: DataProvider<TestItem, TestDataProviderParams> = (params, callback) => {
  assertType<TestDataProviderParams>(params);
  assertType<number>(params.page);
  assertType<number>(params.pageSize);
  assertType<unknown>(params.parentItem);
  assertType<string>(params.bar);
  assertType<DataProviderCallback<TestItem>>(callback);
};

const host = document.createElement('div');
const dataProviderController = new DataProviderController<TestItem, TestDataProviderParams>(host, {
  size: 1000,
  pageSize: 50,
  getItemId: (item) => item,
  isExpanded: (_item) => true,
  dataProvider,
  dataProviderParams: () => ({ bar: 'bar' }),
});

// Constructor
assertType<
  new <TestItem, DataProviderParams extends Record<string, unknown>>(
    host: HTMLElement,
    config: {
      size: number | undefined;
      pageSize: number;
      getItemId(item: TestItem): unknown;
      isExpanded(item: TestItem): boolean;
      dataProvider: DataProvider<TestItem, DataProviderParams>;
      dataProviderParams(): DataProviderParams;
    },
  ) => void
>(DataProviderController);

// Properties
assertType<HTMLElement>(dataProviderController.host);
assertType<Cache<TestItem>>(dataProviderController.rootCache);
assertType<number | undefined>(dataProviderController.size);
assertType<number>(dataProviderController.pageSize);
assertType<(item: TestItem) => unknown>(dataProviderController.getItemId);
assertType<(item: TestItem) => boolean>(dataProviderController.isExpanded);
assertType<() => TestDataProviderParams>(dataProviderController.dataProviderParams);
assertType<DataProvider<TestItem, TestDataProviderParams>>(dataProviderController.dataProvider);
assertType<number>(dataProviderController.flatSize);

// Methods
assertType<() => void>(dataProviderController.clearCache);
assertType<() => void>(dataProviderController.recalculateFlatSize);
assertType<(flatIndex: number) => void>(dataProviderController.ensureFlatIndexLoaded);
assertType<(flatIndex: number) => void>(dataProviderController.ensureFlatIndexHierarchy);
assertType<
  (flatIndex: number) => {
    cache: Cache<TestItem>;
    item: unknown | undefined;
    index: number;
    page: number;
    level: number;
  }
>(dataProviderController.getFlatIndexContext);
assertType<
  (itemId: unknown) =>
    | {
        cache: Cache<TestItem>;
        subCache: Cache<TestItem> | undefined;
        item: unknown | undefined;
        index: number;
        page: number;
        level: number;
        flatIndex: number;
      }
    | undefined
>(dataProviderController.getItemContext);
assertType<(path: number[]) => number>(dataProviderController.getFlatIndexByPath);
assertType<() => void>(dataProviderController.loadFirstPage);
assertType<() => boolean>(dataProviderController.isLoading);
assertType<(size: number) => void>(dataProviderController.setSize);
assertType<(pageSize: number) => void>(dataProviderController.setPageSize);
assertType<(dataProvider: DataProvider<TestItem, TestDataProviderParams>) => void>(
  dataProviderController.setDataProvider,
);
