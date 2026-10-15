import { chaiDomDiff } from '@open-wc/semantic-dom-diff';
import * as chai from 'chai/index.js';
import sinonChai from 'sinon-chai';

chai.use(chaiDomDiff);
chai.use(sinonChai);

export const { expect } = chai;
