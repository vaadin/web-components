import { FieldHighlighter } from '../../src/vaadin-field-highlighter.js';

const users = [
  { id: 'a', name: 'User', colorIndex: 0, fieldIndex: 2 },
  { id: 'b', name: 'Moderator', colorIndex: 1, fieldIndex: 1 },
  { id: 'c', name: 'Admin', colorIndex: 2, fieldIndex: 0 },
];

export const setUsers = (field) => {
  FieldHighlighter.init(field);
  FieldHighlighter.setUsers(field, users);
  // Mimic focus to show highlight and badges
  field.dispatchEvent(new CustomEvent('mouseenter'));
};
