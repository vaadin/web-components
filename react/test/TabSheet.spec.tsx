import { expect } from '@esm-bundle/chai';
import { cleanup, render } from '@testing-library/react/pure.js';

import { TabSheet, TabSheetTab, tab } from '../packages/react-components/src/TabSheet.js';
import type { TabElement } from '../packages/react-components/src/Tab.js';
import sinon from 'sinon';
import { useState } from 'react';

function getTabSheet() {
  return document.querySelector('vaadin-tabsheet')!;
}

function getTabContent(tab: TabElement) {
  return getTabSheet().querySelector(`[tab="${tab.id}"]`);
}

async function until(predicate: () => boolean) {
  while (!predicate()) {
    await new Promise((r) => setTimeout(r, 10));
  }
}

describe('TabSheet', () => {
  afterEach(() => cleanup());

  it('should render two tabs', async () => {
    render(
      <TabSheet>
        <TabSheetTab label="Tab 1">Content 1</TabSheetTab>
        <TabSheetTab label="Tab 2">Content 2</TabSheetTab>
      </TabSheet>,
    );

    const tabs = getTabSheet().querySelectorAll('vaadin-tab');
    expect(tabs).to.have.length(2);

    expect(tabs[0]).to.have.text('Tab 1');
    expect(tabs[1]).to.have.text('Tab 2');

    expect(getTabContent(tabs[0])).to.have.text('Content 1');
    expect(getTabContent(tabs[1])).to.have.text('Content 2');
  });

  it('should have the second tab selected', async () => {
    render(
      <TabSheet selected={1}>
        <TabSheetTab label="Tab 1">Content 1</TabSheetTab>
        <TabSheetTab label="Tab 2">Content 2</TabSheetTab>
      </TabSheet>,
    );

    const tabs = getTabSheet().querySelectorAll('vaadin-tab');

    await until(() => tabs[1].selected);
    expect(tabs[0].selected).to.be.false;
  });

  it('should have the second tab disabled', async () => {
    render(
      <TabSheet>
        <TabSheetTab label="Tab 1">Content 1</TabSheetTab>
        <TabSheetTab label="Tab 2" disabled>
          Content 2
        </TabSheetTab>
      </TabSheet>,
    );

    const tabs = getTabSheet().querySelectorAll('vaadin-tab');

    await until(() => tabs[1].disabled);
    expect(tabs[0].disabled).to.be.false;
  });

  it('should pass props to the tab', async () => {
    render(
      <TabSheet>
        <TabSheetTab label="Tab 1" aria-label="tab">
          Content 1
        </TabSheetTab>
      </TabSheet>,
    );

    const tab = getTabSheet().querySelector('vaadin-tab')!;
    expect(tab.ariaLabel).to.equal('tab');
  });

  it('should support custom id for tab', async () => {
    render(
      <TabSheet>
        <TabSheetTab label="Tab 1" id="foo">
          Content 1
        </TabSheetTab>
      </TabSheet>,
    );

    const tab = getTabSheet().querySelector('vaadin-tab')!;
    expect(tab.id).to.equal('foo');
    expect(getTabContent(tab)).to.have.text('Content 1');
  });

  it('should maintain selected tab on re-render', async () => {
    function Test() {
      const [count, setCount] = useState(2);
      return (
        <>
          <TabSheet>
            {Array.from({ length: count }, (_, i) => (
              <TabSheetTab label={`Tab ${i + 1}`} key={i}>
                Content {i + 1}
              </TabSheetTab>
            ))}
          </TabSheet>

          <button onClick={() => setCount(count + 1)}>Add tab</button>
        </>
      );
    }

    render(<Test />);
    const addTabButton = document.querySelector('button')!;
    getTabSheet().selected = 1;
    addTabButton.click();

    await until(() => getTabSheet().querySelectorAll('vaadin-tab').length === 3);

    const tabs = getTabSheet().querySelectorAll('vaadin-tab');
    expect(getTabContent(tabs[0])).to.have.text('Content 1');
    expect(getTabContent(tabs[1])).to.have.text('Content 2');
    expect(getTabContent(tabs[2])).to.have.text('Content 3');

    expect(getTabSheet().selected).to.equal(1);
  });

  it('should render prefix and suffix', async () => {
    render(
      <TabSheet>
        <div slot="prefix">PREFIX</div>
        <div slot="suffix">SUFFIX</div>
      </TabSheet>,
    );

    const prefix = getTabSheet().querySelector('[slot="prefix"]');
    expect(prefix).to.have.text('PREFIX');

    const suffix = getTabSheet().querySelector('[slot="suffix"]');
    expect(suffix).to.have.text('SUFFIX');
  });

  it('should warn when using the tab helper', async () => {
    const stub = sinon.stub(console, 'warn');
    tab('Tab 1');
    expect(stub.calledOnce).to.be.true;
    stub.restore();
  });
});
