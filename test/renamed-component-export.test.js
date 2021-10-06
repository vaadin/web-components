/**
 * Smoke test that verifies that components are correctly exported from
 * their renamed packages / with their new name
 * Background:
 * - https://github.com/vaadin/web-components/issues/1992
 * - https://github.com/vaadin/web-components/issues/1993
 *
 * TODO: Remove after component renaming is complete
 */
import { expect } from '@esm-bundle/chai';

import { Accordion } from '@vaadin/accordion';
import { AccordionPanel } from '@vaadin/accordion/vaadin-accordion-panel';
import { AppLayout } from '@vaadin/app-layout';
import { DrawerToggle } from '@vaadin/app-layout/vaadin-drawer-toggle';
import { AvatarGroup } from '@vaadin/avatar-group';
import { Avatar } from '@vaadin/avatar';
import { Board } from '@vaadin/board';
import { BoardRow } from '@vaadin/board/vaadin-board-row';
import { Button } from '@vaadin/button';
import { Chart } from '@vaadin/charts';
import { Checkbox } from '@vaadin/checkbox';
import { CheckboxGroup } from '@vaadin/checkbox-group';
import { ComboBox } from '@vaadin/combo-box';
import { ComboBoxLight } from '@vaadin/combo-box/vaadin-combo-box-light';
import { ConfirmDialog } from '@vaadin/confirm-dialog';
import { ContextMenu } from '@vaadin/context-menu';
import { CookieConsent } from '@vaadin/cookie-consent';
import { Crud } from '@vaadin/crud';
import { CustomField } from '@vaadin/custom-field';
import { DatePicker } from '@vaadin/date-picker';
import { DateTimePicker } from '@vaadin/date-time-picker';
import { Dialog } from '@vaadin/dialog';
import { FormLayout } from '@vaadin/form-layout';
import { FormItem } from '@vaadin/form-layout/vaadin-form-item';
import { Grid } from '@vaadin/grid';
import { GridColumn } from '@vaadin/grid/vaadin-grid-column';
import { GridColumnGroup } from '@vaadin/grid/vaadin-grid-column-group';
import { GridFilter } from '@vaadin/grid/vaadin-grid-filter';
import { GridFilterColumn } from '@vaadin/grid/vaadin-grid-filter-column';
import { GridSelectionColumn } from '@vaadin/grid/vaadin-grid-selection-column';
import { GridSortColumn } from '@vaadin/grid/vaadin-grid-sort-column';
import { GridSorter } from '@vaadin/grid/vaadin-grid-sorter';
import { GridTreeColumn } from '@vaadin/grid/vaadin-grid-tree-column';
import { GridTreeToggle } from '@vaadin/grid/vaadin-grid-tree-toggle';
import { GridPro } from '@vaadin/grid-pro';
import { GridProEditColumn } from '@vaadin/grid-pro/vaadin-grid-pro-edit-column';
import { Icon } from '@vaadin/icon';
import { Iconset } from '@vaadin/icon/vaadin-iconset';
import { Item } from '@vaadin/item';
import { ListBox } from '@vaadin/list-box';
import { LoginOverlay } from '@vaadin/login';
import { LoginForm } from '@vaadin/login/vaadin-login-form';
import { MenuBar } from '@vaadin/menu-bar';
import { Message } from '@vaadin/message-list';
import { MessageInput } from '@vaadin/message-input';
import { MessageList } from '@vaadin/message-list';
import { Notification } from '@vaadin/notification';
import { HorizontalLayout } from '@vaadin/horizontal-layout';
import { VerticalLayout } from '@vaadin/vertical-layout';
import { Scroller } from '@vaadin/scroller';
import { Overlay } from '@vaadin/overlay';
import { ProgressBar } from '@vaadin/progress-bar';
import { RadioButton } from '@vaadin/radio-group/vaadin-radio-button';
import { RadioGroup } from '@vaadin/radio-group';
import { RichTextEditor } from '@vaadin/rich-text-editor';
import { Select } from '@vaadin/select';
import { SplitLayout } from '@vaadin/split-layout';
import { Tabs } from '@vaadin/tabs';
import { Tab } from '@vaadin/tabs/vaadin-tab';
import { TextField } from '@vaadin/text-field';
import { EmailField } from '@vaadin/email-field';
import { IntegerField } from '@vaadin/integer-field';
import { PasswordField } from '@vaadin/password-field';
import { TextArea } from '@vaadin/text-area';
import { TimePicker } from '@vaadin/time-picker';
import { Upload } from '@vaadin/upload';
import { VirtualList } from '@vaadin/virtual-list';

describe('legacy-exports', () => {
  it('should export legacy component aliases', () => {
    expect(new Accordion()).to.be.instanceof(HTMLElement);
    expect(new AccordionPanel()).to.be.instanceof(HTMLElement);
    expect(new AppLayout()).to.be.instanceof(HTMLElement);
    expect(new DrawerToggle()).to.be.instanceof(HTMLElement);
    expect(new AvatarGroup()).to.be.instanceof(HTMLElement);
    expect(new Avatar()).to.be.instanceof(HTMLElement);
    expect(new Board()).to.be.instanceof(HTMLElement);
    expect(new BoardRow()).to.be.instanceof(HTMLElement);
    expect(new Button()).to.be.instanceof(HTMLElement);
    expect(new Chart()).to.be.instanceof(HTMLElement);
    expect(new Checkbox()).to.be.instanceof(HTMLElement);
    expect(new CheckboxGroup()).to.be.instanceof(HTMLElement);
    expect(new ComboBox()).to.be.instanceof(HTMLElement);
    expect(new ComboBoxLight()).to.be.instanceof(HTMLElement);
    expect(new ConfirmDialog()).to.be.instanceof(HTMLElement);
    expect(new ContextMenu()).to.be.instanceof(HTMLElement);
    expect(new CookieConsent()).to.be.instanceof(HTMLElement);
    expect(new Crud()).to.be.instanceof(HTMLElement);
    expect(new CustomField()).to.be.instanceof(HTMLElement);
    expect(new DatePicker()).to.be.instanceof(HTMLElement);
    expect(new DateTimePicker()).to.be.instanceof(HTMLElement);
    expect(new Dialog()).to.be.instanceof(HTMLElement);
    expect(new FormLayout()).to.be.instanceof(HTMLElement);
    expect(new FormItem()).to.be.instanceof(HTMLElement);
    expect(new Grid()).to.be.instanceof(HTMLElement);
    expect(new GridColumn()).to.be.instanceof(HTMLElement);
    expect(new GridColumnGroup()).to.be.instanceof(HTMLElement);
    expect(new GridFilter()).to.be.instanceof(HTMLElement);
    expect(new GridFilterColumn()).to.be.instanceof(HTMLElement);
    expect(new GridSelectionColumn()).to.be.instanceof(HTMLElement);
    expect(new GridSortColumn()).to.be.instanceof(HTMLElement);
    expect(new GridSorter()).to.be.instanceof(HTMLElement);
    expect(new GridTreeColumn()).to.be.instanceof(HTMLElement);
    expect(new GridTreeToggle()).to.be.instanceof(HTMLElement);
    expect(new GridPro()).to.be.instanceof(HTMLElement);
    expect(new GridProEditColumn()).to.be.instanceof(HTMLElement);
    expect(new Icon()).to.be.instanceof(HTMLElement);
    expect(new Iconset()).to.be.instanceof(HTMLElement);
    expect(new Item()).to.be.instanceof(HTMLElement);
    expect(new ListBox()).to.be.instanceof(HTMLElement);
    expect(new LoginOverlay()).to.be.instanceof(HTMLElement);
    expect(new LoginForm()).to.be.instanceof(HTMLElement);
    expect(new MenuBar()).to.be.instanceof(HTMLElement);
    expect(new Message()).to.be.instanceof(HTMLElement);
    expect(new MessageInput()).to.be.instanceof(HTMLElement);
    expect(new MessageList()).to.be.instanceof(HTMLElement);
    expect(new Notification()).to.be.instanceof(HTMLElement);
    expect(new HorizontalLayout()).to.be.instanceof(HTMLElement);
    expect(new VerticalLayout()).to.be.instanceof(HTMLElement);
    expect(new Scroller()).to.be.instanceof(HTMLElement);
    expect(new Overlay()).to.be.instanceof(HTMLElement);
    expect(new ProgressBar()).to.be.instanceof(HTMLElement);
    expect(new RadioButton()).to.be.instanceof(HTMLElement);
    expect(new RadioGroup()).to.be.instanceof(HTMLElement);
    expect(new RichTextEditor()).to.be.instanceof(HTMLElement);
    expect(new Select()).to.be.instanceof(HTMLElement);
    expect(new SplitLayout()).to.be.instanceof(HTMLElement);
    expect(new Tabs()).to.be.instanceof(HTMLElement);
    expect(new Tab()).to.be.instanceof(HTMLElement);
    expect(new TextField()).to.be.instanceof(HTMLElement);
    expect(new EmailField()).to.be.instanceof(HTMLElement);
    expect(new IntegerField()).to.be.instanceof(HTMLElement);
    expect(new PasswordField()).to.be.instanceof(HTMLElement);
    expect(new TextArea()).to.be.instanceof(HTMLElement);
    expect(new TimePicker()).to.be.instanceof(HTMLElement);
    expect(new Upload()).to.be.instanceof(HTMLElement);
    expect(new VirtualList()).to.be.instanceof(HTMLElement);
  });
});
