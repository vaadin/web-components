const font = 'https://fonts.googleapis.com/css?family=Roboto+Mono:400,700|Roboto:400,300,300italic,400italic,500,500italic,700,700italic';
const link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.crossOrigin = 'anonymous';
link.href = font;
document.head.appendChild(link);
