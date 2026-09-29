import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/src/global/index.css';
import '@vaadin/vaadin-lumo-styles/components/item.css';
import '@vaadin/vaadin-lumo-styles/components/list-box.css';
import '@vaadin/vaadin-lumo-styles/components/select.css';
import '@vaadin/vaadin-lumo-styles/components/text-field.css';
import '../fixtures/not-animated-styles.css';
import '@vaadin/item';
import '@vaadin/list-box';
import '@vaadin/select';
import '@vaadin/text-field';
import { itemsSuite } from '../suites/items.js';

itemsSuite();
