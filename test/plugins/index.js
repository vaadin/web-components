import { chaiDomDiff } from '@open-wc/semantic-dom-diff';
import * as chai from 'chai/index.js';
import sinonChai from 'sinon-chai';
import { chaiA11yTree } from 'wtr-a11y-tree-plugin/chai';

chai.use(chaiDomDiff);
chai.use(chaiA11yTree);
chai.use(sinonChai);

export const { expect } = chai;
