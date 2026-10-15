(() => {
  const code = document.querySelectorAll('.code-block');
  code.forEach((pre) => {
    const button = document.createElement('button');
    button.classList.add('code-block__copy');
    button.title = 'Copy to clipboard';
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5"></path>
      </svg>
    `;

    button.addEventListener('click', () => {
      navigator.clipboard.writeText(pre.textContent.trim());
      button.classList.add('copied');

      setTimeout(() => {
        button.classList.remove('copied');
      }, 1000);
    });

    pre.appendChild(button);
  });
})();
