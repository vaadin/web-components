import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import '../vaadin-rich-text-editor.js';

describe('rich text editor', () => {
  let rte, editorContainer, editorContentContainer, editorContent, content;

  // Saving clientHeight values of the elements in `elementsArray` to `savedConstrains` array
  let savedConstrains = [];
  const getAndSaveHeightConstrains = (elementsArray) => {
    savedConstrains = [];
    elementsArray.forEach((element) => savedConstrains.push(element.clientHeight));
  };

  // Comparing updated height constrains of elements in `elementsArray` to the saved values with `condition`:
  // 0 - should equal
  // 1 / 2 - should be equal or greater than
  const getAndCompareHeightConstrains = (elementsArray, condition) => {
    if (condition === 0) {
      elementsArray.forEach((element, key) => expect(element.clientHeight).to.be.equal(savedConstrains[key]));
    } else if (condition === 1 || condition === 2) {
      elementsArray.forEach((element, key) => expect(element.clientHeight).to.be.at.least(savedConstrains[key]));
    }
  };

  // Comparing `value` to the `compareTo` value with the `condition`:
  // 0 - should equal
  // 1 - should be equal or greater than
  // 2 - should be below
  const compareValue = (value, compareTo, condition) => {
    if (condition === 0) {
      expect(value).to.be.equal(compareTo);
    } else if (condition === 1) {
      expect(value).to.be.at.least(compareTo);
    } else if (condition === 2) {
      expect(value).to.be.below(compareTo);
    }
  };

  const conditionValues = ['equal', 'equal or greater than', 'below'];
  ['height', 'min-height', 'max-height'].forEach((definedValue, key) => {
    describe(`defined ${definedValue}`, () => {
      beforeEach(() => {
        rte = fixtureSync(`<vaadin-rich-text-editor style="${definedValue}: 500px"></vaadin-rich-text-editor>`);
        editorContainer = rte.shadowRoot.querySelector('.vaadin-rich-text-editor-container');
        editorContentContainer = rte.shadowRoot.querySelector('.ql-container');
        editorContent = rte.shadowRoot.querySelector('.ql-editor');
        // 18 new lines ~ 828px (46px * 18);
        content = `[{"insert":"\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n"}]`;
      });

      it('rich text editor height should be ' + conditionValues[key] + ' the ' + definedValue, () => {
        // Includes borders and indents
        compareValue(rte.offsetHeight, 500, key);
      });

      it('internal flex wrapper should be the same size as rte itself', () => {
        expect(rte.clientHeight).to.be.equal(editorContainer.clientHeight);
      });

      it("content container's and content's height should equal flex wrapper's height without toolbar's height", () => {
        const toolbarHeight = rte.shadowRoot.querySelector('[part="toolbar"]').offsetHeight;
        // We should consider indents on editor content container for the subtraction of the toolbar height
        expect(editorContainer.clientHeight - toolbarHeight).to.be.equal(editorContentContainer.offsetHeight);
        expect(editorContentContainer.clientHeight).to.be.equal(editorContent.clientHeight);
      });

      it(
        'all height constrains should be ' +
          conditionValues[key] +
          (key === 2 ? ' the ' + definedValue + ' and greater than ' : ' ') +
          ' the previous values after the content was inserted',
        () => {
          const elementsArray = [rte, editorContainer, editorContentContainer, editorContent];
          getAndSaveHeightConstrains(elementsArray);
          rte.value = content;
          // If the max-height is defined RTE height should equal max-height after inserting the content.
          if (key === 2) {
            compareValue(rte.offsetHeight, 500, 0);
          }
          getAndCompareHeightConstrains(elementsArray, key);
        }
      );
    });
  });
});
