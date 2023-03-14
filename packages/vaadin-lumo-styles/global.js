const prefix = 'lumo-';

export const addLumoGlobalStyles = (id, ...styles) => {
  const styleTag = document.createElement('style');
  styleTag.id = `${prefix}${id}`;
  styleTag.textContent = styles
    .map((style) => style.toString())
    .join('\n')
    .replace(':host', 'html');

  // Add the first tag before the first existing <style> so that Lumo provides defaults and does not override application styles. Add the rest of the styles after the existing "lumo-" style.
  const lastExistingLumoTag = Array.from(document.querySelectorAll(`head > style[id^='${prefix}']`)).pop();
  if (!lastExistingLumoTag || !lastExistingLumoTag.nextElementSibling) {
    const firstNonLumoStyleOrLinkTag = document.querySelector('head > style') || document.querySelector('head > link');
    if (firstNonLumoStyleOrLinkTag) {
      document.head.insertBefore(styleTag, firstNonLumoStyleOrLinkTag);
    } else {
      // No style or link tags present
      document.head.append(styleTag);
    }
  } else {
    lastExistingLumoTag.parentElement.insertBefore(styleTag, lastExistingLumoTag.nextElementSibling);
  }
};
