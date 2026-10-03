import { afterEach, chai } from 'vitest';
import { cleanup } from 'vitest-browser-react';
import chaiDom from 'chai-dom';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiDom);
chai.use(chaiAsPromised);

afterEach(cleanup);
