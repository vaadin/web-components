window.RichTextEditorDemo = superClass => {
  return class extends superClass {
    static get properties() {
      return {
      };
    }
    ready() {
      super.ready();
      Array.from(this.shadowRoot.querySelectorAll('vaadin-demo-snippet')).forEach(demo => {
        setTimeout(() => {
          const rte = demo.shadowRoot.querySelector('vaadin-demo-shadow-dom-renderer').shadowRoot.querySelector('vaadin-rich-text-editor');
          if (!rte.hasAttribute('theme') && rte.className.indexOf('min-height') === -1) {
            rte.value = `[
              {"insert":"High quality rich text editor for the web"},
              {"attributes":{"header":2},"insert":"\\n"},
              {"insert":"<vaadin-rich-text-editor> is a Web Component providing rich text editor functionality, part of the "},{"attributes":{"link":"https://vaadin.com/components"},"insert":"Vaadin components"},
              {"insert":".\\nIt handles the following formatting:\\n"},
              {"attributes":{"bold":true},"insert":"Bold"},
              {"attributes":{"list":"bullet"},"insert":"\\n"},
              {"attributes":{"italic":true},"insert":"Italic"},
              {"attributes":{"list":"bullet"},"insert":"\\n"},
              {"attributes":{"underline":true},"insert":"Underline"},
              {"attributes":{"list":"bullet"},"insert":"\\n"},
              {"attributes":{"strike":true},"insert":"Strike-through"},
              {"attributes":{"list":"bullet"},"insert":"\\n"},
              {"insert":"Headings (H1, H2, H3)"},
              {"attributes":{"list":"bullet"},"insert":"\\n"},
              {"insert":"Lists (ordered and unordered)"},
              {"attributes":{"list":"bullet"},"insert":"\\n"},
              {"insert":"Text align (left, center, right)"},
              {"attributes":{"list":"bullet"},"insert":"\\n"},
              {"attributes":{"script":"sub"},"insert":"Sub"},
              {"insert":"script and "},{"attributes":{"script":"super"},"insert":"super"},
              {"insert":"script"},{"attributes":{"list":"bullet"},"insert":"\\n"},
              {"attributes":{"link":"https://vaadin.com"},"insert":"Hyperlink"},{"attributes":{"list":"bullet"},"insert":"\\n"},
              {"insert":"In addition to text formatting, additional content blocks can be added.\\nImages"},
              {"attributes":{"header":3},"insert":"\\n"},
              {"insert":{"image":"data:image/png;base64,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"}},
              {"insert":"\\nBlockquotes"},
              {"attributes":{"header":3},"insert":"\\n"},
              {"insert":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
              {"attributes":{"blockquote":true},"insert":"\\n"},
              {"insert":"Code blocks"},
              {"attributes":{"header":3},"insert":"\\n"},{"insert":"<body>"},
              {"attributes":{"code-block":true},"insert":"\\n"},
              {"insert":"  <vaadin-rich-text-editor></vaadin-rich-text-editor>"},
              {"attributes":{"code-block":true},"insert":"\\n"},
              {"insert":"</body>"},
              {"attributes":{"code-block":true},"insert":"\\n"},
              {"insert":"\\n"}
            ]`;
          } else {
            rte.value = `[{"insert":"Write your content here…"}]`;
          }
        }, 300);
      });
    }
  };
};

window.addEventListener('WebComponentsReady', () => {
  document.body.removeAttribute('unresolved');
});
