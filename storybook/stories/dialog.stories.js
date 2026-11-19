import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import { html } from 'lit';
import { useArgs } from 'storybook/preview-api';

export default {
  title: 'Overlays/Dialog',
  component: 'vaadin-dialog',
  args: {
    opened: true,
    headerTitle: 'New employee',
    modeless: false,
    draggable: false,
    resizable: false,
    noCloseOnEsc: false,
    noCloseOnOutsideClick: false,
  },
  parameters: {
    // The dialog covers the whole page, so render each story of the docs page in its own frame
    docs: { story: { inline: false, iframeHeight: 400 } },
  },
  render: (args) => {
    const [, updateArgs] = useArgs();
    const setOpened = (opened) => updateArgs({ opened });

    return html`
      <vaadin-button @click=${() => setOpened(true)}>Open dialog</vaadin-button>
      <vaadin-dialog
        .opened=${args.opened}
        .headerTitle=${args.headerTitle}
        ?modeless=${args.modeless}
        ?draggable=${args.draggable}
        ?resizable=${args.resizable}
        ?no-close-on-esc=${args.noCloseOnEsc}
        ?no-close-on-outside-click=${args.noCloseOnOutsideClick}
        @closed=${() => setOpened(false)}
      >
        <div style="display: flex; flex-direction: column; width: 18rem">
          <vaadin-text-field label="First name"></vaadin-text-field>
          <vaadin-text-field label="Last name"></vaadin-text-field>
        </div>
        <vaadin-button slot="footer" @click=${() => setOpened(false)}>Cancel</vaadin-button>
        <vaadin-button slot="footer" theme="primary" @click=${() => setOpened(false)}>Add</vaadin-button>
      </vaadin-dialog>
    `;
  },
};

export const Default = {};

export const DraggableAndResizable = {
  args: { modeless: true, draggable: true, resizable: true },
};
