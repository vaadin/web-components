import type { Cache } from '../../src/data-provider-controller/cache.js';
import {
  type DataProvider,
  type DataProviderCallback,
  DataProviderController,
} from '../../src/data-provider-controller/data-provider-controller.js';

const assertType = <TExpected>(actual: TExpected) => actual;

type MyDataProviderParams = {
  foo: string;
};

const dataProvider: DataProvider<MyDataProviderParams> = (params, callback) => {
  assertType<MyDataProviderParams>(params);
  assertType<number>(params.page);
  assertType<number>(params.pageSize);
  assertType<unknown>(params.parentItem);
  assertType<string>(params.foo);
  assertType<DataProviderCallback>(callback);
};

const host = document.createElement('div');
const dataProviderController = new DataProviderController<MyDataProviderParams>(host, {
  size: 1000,
  pageSize: 50,
  isExpanded: (_item) => true,
  dataProvider,
  dataProviderParams: () => ({ foo: 'bar' }),
});

// Properties
assertType<HTMLElement>(dataProviderController.host);
assertType<Cache>(dataProviderController.rootCache);
assertType<number | undefined>(dataProviderController.size);
assertType<number>(dataProviderController.pageSize);
assertType<(item: unknown) => boolean>(dataProviderController.isExpanded);
assertType<() => MyDataProviderParams>(dataProviderController.dataProviderParams);
assertType<DataProvider<MyDataProviderParams>>(dataProviderController.dataProvider);
assertType<number>(dataProviderController.effectiveSize);

// Methods
assertType<() => void>(dataProviderController.clearCache);
assertType<() => void>(dataProviderController.recalculateEffectiveSize);
assertType<(flatIndex: number) => void>(dataProviderController.ensureFlatIndexLoaded);
assertType<(flatIndex: number) => void>(dataProviderController.ensureFlatIndexHierarchy);
assertType<
  (flatIndex: number) => {
    cache: Cache;
    item: unknown | undefined;
    index: number;
    page: number;
    level: number;
  }
>(dataProviderController.getFlatIndexContext);
assertType<(path: number[]) => number>(dataProviderController.getFlatIndexByPath);
assertType<() => void>(dataProviderController.loadFirstPage);
assertType<() => boolean>(dataProviderController.isLoading);
assertType<(size: number) => void>(dataProviderController.setSize);
assertType<(pageSize: number) => void>(dataProviderController.setPageSize);
assertType<(dataProvider: DataProvider<MyDataProviderParams>) => void>(dataProviderController.setDataProvider);
