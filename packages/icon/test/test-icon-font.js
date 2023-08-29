import { css, unsafeCSS } from 'lit';

// A base64-encoded WOFF2 font file. Contains a single icon.
const iconFontBase64 =
  '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';

const iconCodePoint = '\\e900';
const iconLigature = 'figma';
const iconFontFamily = 'My icons';

export const iconFontCss = css`
  @font-face {
    font-family: '${unsafeCSS(iconFontFamily)}';
    src: url(data:font/woff2;charset=utf-8;base64,${unsafeCSS(iconFontBase64)}) format('woff2');
  }

  .my-icon-font {
    font-family: '${unsafeCSS(iconFontFamily)}';

    /* Some popular icon libraries set CSS properties such as line-height and display to the
    element with the class names applied. We'll replicate that here for testing purposes. */
    line-height: 1.5;
    display: inline-block;
    vertical-align: top;
    font-size: 24px;
  }

  .icon-before::before {
    content: '${unsafeCSS(iconCodePoint)}';
  }

  .icon-after::after {
    content: '${unsafeCSS(iconCodePoint)}';
  }

  .icon-ligature::before {
    content: '${unsafeCSS(iconLigature)}';
  }
`;
