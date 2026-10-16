window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.stepperComponent = true;

await import('@vaadin/stepper');
await import('@vaadin/button');
await import('@vaadin/checkbox');

// Theme switcher
const params = new URLSearchParams(location.search);
const [theme = 'lumo', scheme = 'light'] = (params.get('theme') || 'lumo:light').split(':');
document.querySelectorAll('[data-set-theme]').forEach((button) => {
  if (button.dataset.setTheme === theme) {
    button.setAttribute('theme', 'primary');
  }
  button.addEventListener('click', () => {
    params.set('theme', `${button.dataset.setTheme}:${scheme}`);
    location.search = params.toString();
  });
});
const schemeButton = document.querySelector('#scheme');
schemeButton.textContent = scheme === 'dark' ? 'Light mode' : 'Dark mode';
schemeButton.addEventListener('click', () => {
  params.set('theme', `${theme}:${scheme === 'dark' ? 'light' : 'dark'}`);
  location.search = params.toString();
});

// Interactive wizard
const wizard = document.querySelector('#wizard');
const steps = [...wizard.querySelectorAll('vaadin-step')];
const content = document.querySelector('#wizard-content');
const back = document.querySelector('#back');
const next = document.querySelector('#next');
const invalid = document.querySelector('#invalid');
let current = 0;
let furthest = 0;

function render() {
  steps.forEach((step, index) => {
    step.current = index === current;
    // Steps up to the furthest reached one can be revisited
    step.path = index <= furthest ? `#${step.dataset.id}` : null;
  });
  invalid.checked = steps[current].invalid;
  content.textContent = `Content of step ${current + 1}: ${steps[current].firstChild.textContent.trim()}`;
  back.disabled = current === 0;
  next.textContent = current === steps.length - 1 ? 'Finish' : 'Next';
}

function goTo(index) {
  current = Math.max(0, Math.min(index, steps.length - 1));
  furthest = Math.max(furthest, current);
  render();
}

next.addEventListener('click', () => {
  steps[current].completed = true;
  goTo(current + 1);
});
back.addEventListener('click', () => goTo(current - 1));
invalid.addEventListener('checked-changed', (e) => {
  steps[current].invalid = e.detail.value;
});
document.querySelector('#vertical').addEventListener('checked-changed', (e) => {
  wizard.orientation = e.detail.value ? 'vertical' : 'horizontal';
  document.querySelector('.wizard').classList.toggle('vertical', e.detail.value);
});
document.querySelector('#small').addEventListener('checked-changed', (e) => {
  wizard.toggleAttribute('theme', e.detail.value);
  if (e.detail.value) wizard.setAttribute('theme', 'small');
});
document.querySelector('#reset').addEventListener('click', () => {
  steps.forEach((step) => {
    step.completed = false;
    step.invalid = false;
  });
  furthest = 0;
  goTo(0);
});

// Navigate by clicking a step link (hash routing)
window.addEventListener('hashchange', () => {
  const index = steps.findIndex((step) => `#${step.dataset.id}` === location.hash);
  if (index >= 0) goTo(index);
});

render();
document.body.classList.add('resolved');
