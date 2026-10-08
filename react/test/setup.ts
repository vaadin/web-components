import chaiAsPromised from 'chai-as-promised';
import chaiDom from 'chai-dom';
import { afterEach, chai } from 'vitest';
import { cleanup } from 'vitest-browser-react';

chai.use(chaiDom);
chai.use(chaiAsPromised);

afterEach(cleanup);
