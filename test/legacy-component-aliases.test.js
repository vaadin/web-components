/**
 * Smoke test that verifies that legacy component names are still exported from
 * legacy packages to prevent breaking changes while refactoring
 * package / element names
 * Background:
 * - https://github.com/vaadin/web-components/issues/1992
 * - https://github.com/vaadin/web-components/issues/1993
 *
 * TODO: Remove after V23
 */
import { expect } from '@esm-bundle/chai';
import { AccordionElement } from '@vaadin/vaadin-accordion';
import { AccordionPanelElement } from '@vaadin/vaadin-accordion/vaadin-accordion-panel';
import { AppLayoutElement } from '@vaadin/vaadin-app-layout';
import { DrawerToggleElement } from '@vaadin/vaadin-app-layout/vaadin-drawer-toggle';
import { AvatarGroupElement } from '@vaadin/vaadin-avatar';
import { AvatarElement } from '@vaadin/vaadin-avatar/vaadin-avatar';
import { BoardElement } from '@vaadin/vaadin-board';
import { BoardRowElement } from '@vaadin/vaadin-board/vaadin-board-row';
import { ButtonElement } from '@vaadin/vaadin-button';
import { ChartElement } from '@vaadin/vaadin-charts';
import { ChartSeriesElement } from '@vaadin/vaadin-charts/src/vaadin-chart-series';
import { CheckboxElement } from '@vaadin/vaadin-checkbox';
import { CheckboxGroupElement } from '@vaadin/vaadin-checkbox/vaadin-checkbox-group';
import { ComboBoxElement } from '@vaadin/vaadin-combo-box';
import { ComboBoxLightElement } from '@vaadin/vaadin-combo-box/vaadin-combo-box-light';
import { ConfirmDialogElement } from '@vaadin/vaadin-confirm-dialog';
import { ContextMenuElement } from '@vaadin/vaadin-context-menu';
import { CookieConsentElement } from '@vaadin/vaadin-cookie-consent';
import { CrudElement } from '@vaadin/vaadin-crud';
import { CustomFieldElement } from '@vaadin/vaadin-custom-field';
import { DatePickerElement } from '@vaadin/vaadin-date-picker';
import { DateTimePickerElement } from '@vaadin/vaadin-date-time-picker';
import { DetailsElement } from '@vaadin/vaadin-details';
import { DialogElement } from '@vaadin/vaadin-dialog';
import { FormLayoutElement } from '@vaadin/vaadin-form-layout';
import { FormItemElement } from '@vaadin/vaadin-form-layout/vaadin-form-item';
import { GridElement } from '@vaadin/vaadin-grid';
import { GridColumnElement } from '@vaadin/vaadin-grid/vaadin-grid-column';
import { GridColumnGroupElement } from '@vaadin/vaadin-grid/vaadin-grid-column-group';
import { GridFilterElement } from '@vaadin/vaadin-grid/vaadin-grid-filter';
import { GridFilterColumnElement } from '@vaadin/vaadin-grid/vaadin-grid-filter-column';
import { GridSelectionColumnElement } from '@vaadin/vaadin-grid/vaadin-grid-selection-column';
import { GridSortColumnElement } from '@vaadin/vaadin-grid/vaadin-grid-sort-column';
import { GridSorterElement } from '@vaadin/vaadin-grid/vaadin-grid-sorter';
import { GridTreeColumnElement } from '@vaadin/vaadin-grid/vaadin-grid-tree-column';
import { GridTreeToggleElement } from '@vaadin/vaadin-grid/vaadin-grid-tree-toggle';
import { GridProElement } from '@vaadin/vaadin-grid-pro';
import { GridProEditColumnElement } from '@vaadin/vaadin-grid-pro/vaadin-grid-pro-edit-column';
import { IconElement } from '@vaadin/vaadin-icon';
import { IconsetElement } from '@vaadin/vaadin-icon/vaadin-iconset';
import { ItemElement } from '@vaadin/vaadin-item';
import { ListBoxElement } from '@vaadin/vaadin-list-box';
import { LoginOverlayElement } from '@vaadin/vaadin-login';
import { LoginFormElement } from '@vaadin/vaadin-login/vaadin-login-form';
import { MenuBarElement } from '@vaadin/vaadin-menu-bar';
import { MessageElement } from '@vaadin/vaadin-messages';
import { MessageInputElement } from '@vaadin/vaadin-messages';
import { MessageListElement } from '@vaadin/vaadin-messages';
import { NotificationElement } from '@vaadin/vaadin-notification';
import { HorizontalLayoutElement } from '@vaadin/vaadin-ordered-layout';
import { VerticalLayoutElement } from '@vaadin/vaadin-ordered-layout';
import { ScrollerElement } from '@vaadin/vaadin-ordered-layout';
import { OverlayElement } from '@vaadin/vaadin-overlay';
import { ProgressBarElement } from '@vaadin/vaadin-progress-bar';
import { RadioButtonElement } from '@vaadin/vaadin-radio-button';
import { RadioGroupElement } from '@vaadin/vaadin-radio-button/vaadin-radio-group';
import { RichTextEditorElement } from '@vaadin/vaadin-rich-text-editor';
import { SelectElement } from '@vaadin/vaadin-select';
import { SplitLayoutElement } from '@vaadin/vaadin-split-layout';
import { TabsElement } from '@vaadin/vaadin-tabs';
import { TabElement } from '@vaadin/vaadin-tabs/vaadin-tab';
import { TextFieldElement } from '@vaadin/vaadin-text-field';
import { EmailFieldElement } from '@vaadin/vaadin-text-field/vaadin-email-field';
import { IntegerFieldElement } from '@vaadin/vaadin-text-field/vaadin-integer-field';
import { PasswordFieldElement } from '@vaadin/vaadin-text-field/vaadin-password-field';
import { TextAreaElement } from '@vaadin/vaadin-text-field/vaadin-text-area';
import { TimePickerElement } from '@vaadin/vaadin-time-picker';
import { UploadElement } from '@vaadin/vaadin-upload';
import { VirtualListElement } from '@vaadin/vaadin-virtual-list';

describe('legacy-exports', () => {
  it('should export legacy component aliases', () => {
    expect(new AccordionElement()).to.be.instanceof(HTMLElement);
    expect(new AccordionPanelElement()).to.be.instanceof(HTMLElement);
    expect(new AppLayoutElement()).to.be.instanceof(HTMLElement);
    expect(new DrawerToggleElement()).to.be.instanceof(HTMLElement);
    expect(new AvatarGroupElement()).to.be.instanceof(HTMLElement);
    expect(new AvatarElement()).to.be.instanceof(HTMLElement);
    expect(new BoardElement()).to.be.instanceof(HTMLElement);
    expect(new BoardRowElement()).to.be.instanceof(HTMLElement);
    expect(new ButtonElement()).to.be.instanceof(HTMLElement);
    expect(new ChartElement()).to.be.instanceof(HTMLElement);
    expect(new ChartSeriesElement()).to.be.instanceof(HTMLElement);
    expect(new CheckboxElement()).to.be.instanceof(HTMLElement);
    expect(new CheckboxGroupElement()).to.be.instanceof(HTMLElement);
    expect(new ComboBoxElement()).to.be.instanceof(HTMLElement);
    expect(new ComboBoxLightElement()).to.be.instanceof(HTMLElement);
    expect(new ConfirmDialogElement()).to.be.instanceof(HTMLElement);
    expect(new ContextMenuElement()).to.be.instanceof(HTMLElement);
    expect(new CookieConsentElement()).to.be.instanceof(HTMLElement);
    expect(new CrudElement()).to.be.instanceof(HTMLElement);
    expect(new CustomFieldElement()).to.be.instanceof(HTMLElement);
    expect(new DatePickerElement()).to.be.instanceof(HTMLElement);
    expect(new DateTimePickerElement()).to.be.instanceof(HTMLElement);
    expect(new DetailsElement()).to.be.instanceof(HTMLElement);
    expect(new DialogElement()).to.be.instanceof(HTMLElement);
    expect(new FormLayoutElement()).to.be.instanceof(HTMLElement);
    expect(new FormItemElement()).to.be.instanceof(HTMLElement);
    expect(new GridElement()).to.be.instanceof(HTMLElement);
    expect(new GridColumnElement()).to.be.instanceof(HTMLElement);
    expect(new GridColumnGroupElement()).to.be.instanceof(HTMLElement);
    expect(new GridFilterElement()).to.be.instanceof(HTMLElement);
    expect(new GridFilterColumnElement()).to.be.instanceof(HTMLElement);
    expect(new GridSelectionColumnElement()).to.be.instanceof(HTMLElement);
    expect(new GridSortColumnElement()).to.be.instanceof(HTMLElement);
    expect(new GridSorterElement()).to.be.instanceof(HTMLElement);
    expect(new GridTreeColumnElement()).to.be.instanceof(HTMLElement);
    expect(new GridTreeToggleElement()).to.be.instanceof(HTMLElement);
    expect(new GridProElement()).to.be.instanceof(HTMLElement);
    expect(new GridProEditColumnElement()).to.be.instanceof(HTMLElement);
    expect(new IconElement()).to.be.instanceof(HTMLElement);
    expect(new IconsetElement()).to.be.instanceof(HTMLElement);
    expect(new ItemElement()).to.be.instanceof(HTMLElement);
    expect(new ListBoxElement()).to.be.instanceof(HTMLElement);
    expect(new LoginOverlayElement()).to.be.instanceof(HTMLElement);
    expect(new LoginFormElement()).to.be.instanceof(HTMLElement);
    expect(new MenuBarElement()).to.be.instanceof(HTMLElement);
    expect(new MessageElement()).to.be.instanceof(HTMLElement);
    expect(new MessageInputElement()).to.be.instanceof(HTMLElement);
    expect(new MessageListElement()).to.be.instanceof(HTMLElement);
    expect(new NotificationElement()).to.be.instanceof(HTMLElement);
    expect(new OverlayElement()).to.be.instanceof(HTMLElement);
    expect(new HorizontalLayoutElement()).to.be.instanceof(HTMLElement);
    expect(new VerticalLayoutElement()).to.be.instanceof(HTMLElement);
    expect(new ScrollerElement()).to.be.instanceof(HTMLElement);
    expect(new ProgressBarElement()).to.be.instanceof(HTMLElement);
    expect(new RadioButtonElement()).to.be.instanceof(HTMLElement);
    expect(new RadioGroupElement()).to.be.instanceof(HTMLElement);
    expect(new RichTextEditorElement()).to.be.instanceof(HTMLElement);
    expect(new SelectElement()).to.be.instanceof(HTMLElement);
    expect(new SplitLayoutElement()).to.be.instanceof(HTMLElement);
    expect(new TabsElement()).to.be.instanceof(HTMLElement);
    expect(new TabElement()).to.be.instanceof(HTMLElement);
    expect(new TextFieldElement()).to.be.instanceof(HTMLElement);
    expect(new EmailFieldElement()).to.be.instanceof(HTMLElement);
    expect(new IntegerFieldElement()).to.be.instanceof(HTMLElement);
    expect(new PasswordFieldElement()).to.be.instanceof(HTMLElement);
    expect(new TextAreaElement()).to.be.instanceof(HTMLElement);
    expect(new TimePickerElement()).to.be.instanceof(HTMLElement);
    expect(new UploadElement()).to.be.instanceof(HTMLElement);
    expect(new VirtualListElement()).to.be.instanceof(HTMLElement);
  });
});
