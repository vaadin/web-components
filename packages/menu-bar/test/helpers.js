/**
 * Emulates clicking outside the dropdown overlay
 */
export function outsideClick() {
  // Move focus to body
  document.body.tabIndex = 0;
  document.body.focus();
  document.body.tabIndex = -1;
  // Outside click
  document.body.click();
}
