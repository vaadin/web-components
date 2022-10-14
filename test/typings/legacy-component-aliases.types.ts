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

const assertType = <TExpected>(actual: TExpected) => actual;

assertType<HTMLElement>(new AccordionElement());
assertType<HTMLElement>(new AccordionPanelElement());
assertType<HTMLElement>(new AppLayoutElement());
assertType<HTMLElement>(new DrawerToggleElement());
assertType<HTMLElement>(new AvatarGroupElement());
assertType<HTMLElement>(new AvatarElement());
assertType<HTMLElement>(new BoardElement());
assertType<HTMLElement>(new BoardRowElement());
assertType<HTMLElement>(new ButtonElement());
assertType<HTMLElement>(new ChartElement());
assertType<HTMLElement>(new ChartSeriesElement());
assertType<HTMLElement>(new CheckboxElement());
assertType<HTMLElement>(new CheckboxGroupElement());
assertType<HTMLElement>(new ComboBoxElement());
assertType<HTMLElement>(new ComboBoxLightElement());
assertType<HTMLElement>(new ConfirmDialogElement());
assertType<HTMLElement>(new ContextMenuElement());
assertType<HTMLElement>(new CookieConsentElement());
assertType<HTMLElement>(new CrudElement());
assertType<HTMLElement>(new CustomFieldElement());
assertType<HTMLElement>(new DatePickerElement());
assertType<HTMLElement>(new DateTimePickerElement());
assertType<HTMLElement>(new DetailsElement());
assertType<HTMLElement>(new DialogElement());
assertType<HTMLElement>(new FormLayoutElement());
assertType<HTMLElement>(new FormItemElement());
assertType<HTMLElement>(new GridElement());
assertType<HTMLElement>(new GridColumnElement());
assertType<HTMLElement>(new GridColumnGroupElement());
assertType<HTMLElement>(new GridFilterElement());
assertType<HTMLElement>(new GridFilterColumnElement());
assertType<HTMLElement>(new GridSelectionColumnElement());
assertType<HTMLElement>(new GridSortColumnElement());
assertType<HTMLElement>(new GridSorterElement());
assertType<HTMLElement>(new GridTreeColumnElement());
assertType<HTMLElement>(new GridTreeToggleElement());
assertType<HTMLElement>(new GridProElement());
assertType<HTMLElement>(new GridProEditColumnElement());
assertType<HTMLElement>(new IconElement());
assertType<HTMLElement>(new IconsetElement());
assertType<HTMLElement>(new ItemElement());
assertType<HTMLElement>(new ListBoxElement());
assertType<HTMLElement>(new LoginOverlayElement());
assertType<HTMLElement>(new LoginFormElement());
assertType<HTMLElement>(new MenuBarElement());
assertType<HTMLElement>(new MessageElement());
assertType<HTMLElement>(new MessageInputElement());
assertType<HTMLElement>(new MessageListElement());
assertType<HTMLElement>(new NotificationElement());
assertType<HTMLElement>(new HorizontalLayoutElement());
assertType<HTMLElement>(new VerticalLayoutElement());
assertType<HTMLElement>(new ScrollerElement());
assertType<HTMLElement>(new ProgressBarElement());
assertType<HTMLElement>(new RadioButtonElement());
assertType<HTMLElement>(new RadioGroupElement());
assertType<HTMLElement>(new RichTextEditorElement());
assertType<HTMLElement>(new SelectElement());
assertType<HTMLElement>(new SplitLayoutElement());
assertType<HTMLElement>(new TabsElement());
assertType<HTMLElement>(new TabElement());
assertType<HTMLElement>(new TextFieldElement());
assertType<HTMLElement>(new EmailFieldElement());
assertType<HTMLElement>(new IntegerFieldElement());
assertType<HTMLElement>(new PasswordFieldElement());
assertType<HTMLElement>(new TextAreaElement());
assertType<HTMLElement>(new TimePickerElement());
assertType<HTMLElement>(new UploadElement());
assertType<HTMLElement>(new VirtualListElement());

// Check generic type params are exposed on aliases
assertType<ComboBoxElement<number>>(new ComboBoxElement<number>());
assertType<ComboBoxLightElement<number>>(new ComboBoxLightElement<number>());

assertType<CrudElement<number>>(new CrudElement<number>());

assertType<GridElement<number>>(new GridElement<number>());
assertType<GridColumnElement<number>>(new GridColumnElement<number>());
assertType<GridColumnGroupElement<number>>(new GridColumnGroupElement<number>());
assertType<GridFilterColumnElement<number>>(new GridFilterColumnElement<number>());
assertType<GridSelectionColumnElement<number>>(new GridSelectionColumnElement<number>());
assertType<GridSortColumnElement<number>>(new GridSortColumnElement<number>());
assertType<GridTreeColumnElement<number>>(new GridTreeColumnElement<number>());

assertType<GridProElement<number>>(new GridProElement<number>());
assertType<GridProEditColumnElement<number>>(new GridProEditColumnElement<number>());

assertType<VirtualListElement<number>>(new VirtualListElement<number>());
