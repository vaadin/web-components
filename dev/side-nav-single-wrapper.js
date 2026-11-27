import '@vaadin/icon';
import '@vaadin/popover';
import '@vaadin/side-nav';

const pages = {
  home: ['Home', 'Open Notifications to see what’s new.'],
  reports: ['Reports', 'Use the ellipsis next to Reports to open the weekly report.'],
  weekly: ['Weekly report', 'This report was opened from the Reports actions.'],
  people: ['People', 'Expand People to browse the directory and org chart.'],
  directory: ['Directory', 'Browse people in the workspace.'],
  appearance: ['Appearance', 'Customize the workspace theme.'],
  preferences: ['Preferences', 'Manage your workspace preferences.'],
  'org-chart': ['Org Chart', 'Explore the reporting structure.'],
};

const url = new URL(location.href);
if (!url.searchParams.has('view')) {
  url.searchParams.set('view', 'home');
  history.replaceState(null, '', url);
  window.dispatchEvent(new Event('side-nav-location-changed'));
}
const view = url.searchParams.get('view');
const [title, description] = Object.hasOwn(pages, view) ? pages[view] : pages.home;
document.querySelector('main h1').textContent = title;
document.querySelector('main p').textContent = description;
