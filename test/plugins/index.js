import { chaiDomDiff } from '@open-wc/semantic-dom-diff';
import * as chai from 'chai';
import sinonChai from 'sinon-chai';

chai.use(chaiDomDiff);
chai.use(sinonChai);

export const { expect } = chai;
