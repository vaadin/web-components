(() => {
  const copyButton = document.getElementById('copy-markdown');
  copyButton?.addEventListener('click', () => {
    const currentUrl = window.location.href;
    const plainTextUrl = `${currentUrl.replace('elements', 'markdown').replace(/\/$/u, '')}.md`;

    fetch(plainTextUrl)
      .then((res) => res.text())
      .then((text) => {
        navigator.clipboard
          .writeText(text)
          .then(() => {
            copyButton.querySelector('span').textContent = 'Copied!';
            setTimeout(() => {
              copyButton.querySelector('span').textContent = 'Copy as MD';
            }, 2000);
          })
          .catch((err) => {
            console.error('Failed to copy text: ', err);
          });
      })
      .catch((err) => {
        console.error('Failed to fetch text: ', err);
      });
  });
})();
