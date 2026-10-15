import stylelint from 'stylelint';

const {
  createPlugin,
  utils: { report },
} = stylelint;

// From https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Shorthand_properties#shorthand_properties
const shorthandToLonghand = new Map([
  ['all', ['all']],
  [
    'animation',
    [
      'animation-delay',
      'animation-direction',
      'animation-duration',
      'animation-fill-mode',
      'animation-iteration-count',
      'animation-name',
      'animation-play-state',
      'animation-timing-function',
    ],
  ],
  ['animation-range', ['animation-range-end', 'animation-range-start']],
  [
    'background',
    [
      'background-attachment',
      'background-clip',
      'background-color',
      'background-image',
      'background-origin',
      'background-position',
      'background-repeat',
      'background-size',
    ],
  ],
  [
    'border',
    ['border-bottom', 'border-color', 'border-left', 'border-right', 'border-style', 'border-top', 'border-width'],
  ],
  ['border-block', ['border-block-end', 'border-block-start']],
  ['border-block-end', ['border-block-end-color', 'border-block-end-style', 'border-block-end-width']],
  ['border-block-start', ['border-block-start-color', 'border-block-start-style', 'border-block-start-width']],
  ['border-bottom', ['border-bottom-color', 'border-bottom-style', 'border-bottom-width']],
  ['border-color', ['border-bottom-color', 'border-left-color', 'border-right-color', 'border-top-color']],
  [
    'border-image',
    ['border-image-outset', 'border-image-repeat', 'border-image-slice', 'border-image-source', 'border-image-width'],
  ],
  ['border-inline', ['border-inline-end', 'border-inline-start']],
  ['border-inline-end', ['border-inline-end-color', 'border-inline-end-style', 'border-inline-end-width']],
  ['border-inline-start', ['border-inline-start-color', 'border-inline-start-style', 'border-inline-start-width']],
  ['border-left', ['border-left-color', 'border-left-style', 'border-left-width']],
  [
    'border-radius',
    ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'],
  ],
  ['border-right', ['border-right-color', 'border-right-style', 'border-right-width']],
  ['border-style', ['border-bottom-style', 'border-left-style', 'border-right-style', 'border-top-style']],
  ['border-top', ['border-top-color', 'border-top-style', 'border-top-width']],
  ['border-width', ['border-bottom-width', 'border-left-width', 'border-right-width', 'border-top-width']],
  ['column-rule', ['column-rule-color', 'column-rule-style', 'column-rule-width']],
  ['columns', ['column-count', 'column-width']],
  ['contain-intrinsic-size', ['contain-intrinsic-height', 'contain-intrinsic-width']],
  ['container', ['container-name', 'container-type']],
  ['flex', ['flex-basis', 'flex-grow', 'flex-shrink']],
  ['flex-flow', ['flex-direction', 'flex-wrap']],
  ['font', ['font-family', 'font-size', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'line-height']],
  ['font-synthesis', ['font-synthesis-small-caps', 'font-synthesis-style', 'font-synthesis-weight']],
  [
    'font-variant',
    [
      'font-variant-caps',
      'font-variant-east-asian',
      'font-variant-ligatures',
      'font-variant-numeric',
      'font-variant-position',
    ],
  ],
  ['gap', ['column-gap', 'row-gap']],
  [
    'grid',
    [
      'grid-auto-columns',
      'grid-auto-flow',
      'grid-auto-rows',
      'grid-column-gap',
      'grid-row-gap',
      'grid-template-areas',
      'grid-template-columns',
      'grid-template-rows',
      'gap',
    ],
  ],
  ['grid-area', ['grid-column-end', 'grid-column-start', 'grid-row-end', 'grid-row-start']],
  ['grid-column', ['grid-column-end', 'grid-column-start']],
  ['grid-row', ['grid-row-end', 'grid-row-start']],
  ['grid-template', ['grid-template-areas', 'grid-template-columns', 'grid-template-rows']],
  ['inset', ['bottom', 'left', 'right', 'top']],
  ['inset-block', ['inset-block-end', 'inset-block-start']],
  ['inset-inline', ['inset-inline-end', 'inset-inline-start']],
  ['list-style', ['list-style-image', 'list-style-position', 'list-style-type']],
  ['margin', ['margin-bottom', 'margin-left', 'margin-right', 'margin-top']],
  ['margin-block', ['margin-block-end', 'margin-block-start']],
  ['margin-inline', ['margin-inline-end', 'margin-inline-start']],
  [
    'mask',
    [
      'mask-clip',
      'mask-composite',
      'mask-image',
      'mask-mode',
      'mask-origin',
      'mask-position',
      'mask-repeat',
      'mask-size',
    ],
  ],
  [
    'mask-border',
    [
      'mask-border-mode',
      'mask-border-outset',
      'mask-border-repeat',
      'mask-border-slice',
      'mask-border-source',
      'mask-border-width',
    ],
  ],
  ['offset', ['offset-anchor', 'offset-distance', 'offset-path', 'offset-rotate']],
  ['outline', ['outline-color', 'outline-style', 'outline-width']],
  ['overflow', ['overflow-x', 'overflow-y']],
  ['overscroll-behavior', ['overscroll-behavior-x', 'overscroll-behavior-y']],
  ['padding', ['padding-bottom', 'padding-left', 'padding-right', 'padding-top']],
  ['padding-block', ['padding-block-end', 'padding-block-start']],
  ['padding-inline', ['padding-inline-end', 'padding-inline-start']],
  ['place-content', ['align-content', 'justify-content']],
  ['place-items', ['align-items', 'justify-items']],
  ['place-self', ['align-self', 'justify-self']],
  ['position-try', ['try-position']],
  ['scroll-margin', ['scroll-margin-bottom', 'scroll-margin-left', 'scroll-margin-right', 'scroll-margin-top']],
  ['scroll-margin-block', ['scroll-margin-block-end', 'scroll-margin-block-start']],
  ['scroll-margin-inline', ['scroll-margin-inline-end', 'scroll-margin-inline-start']],
  ['scroll-padding', ['scroll-padding-bottom', 'scroll-padding-left', 'scroll-padding-right', 'scroll-padding-top']],
  ['scroll-padding-block', ['scroll-padding-block-end', 'scroll-padding-block-start']],
  ['scroll-padding-inline', ['scroll-padding-inline-end', 'scroll-padding-inline-start']],
  ['scroll-timeline', ['scroll-timeline-axis', 'scroll-timeline-name', 'scroll-timeline-type']],
  ['text-box', ['text-box-edge', 'text-box-trim']],
  [
    'text-decoration',
    ['text-decoration-color', 'text-decoration-line', 'text-decoration-style', 'text-decoration-thickness'],
  ],
  ['text-emphasis', ['text-emphasis-color', 'text-emphasis-style']],
  ['text-wrap', ['text-wrap-mode', 'text-wrap-style']],
  ['transition', ['transition-delay', 'transition-duration', 'transition-property', 'transition-timing-function']],
  ['view-timeline', ['view-timeline-axis', 'view-timeline-inset', 'view-timeline-name']],
  ['-webkit-text-stroke', ['-webkit-text-stroke-color', '-webkit-text-stroke-width']],
]);

const ruleName = 'custom-rules/no-shorthand-with-unresolved-longhand';

const messages = {
  rejected: (shorthand, longhand) =>
    `Avoid using shorthand property "${shorthand}" together with longhand "${longhand}" that contains a CSS variable (var(...))`,
};

const ruleFunction = () => {
  return (root, result) => {
    root.walkRules((rule) => {
      const forbiddenProps = new Map();

      rule.walkDecls((decl) => {
        const { prop, value } = decl;

        if (forbiddenProps.has(prop)) {
          report({
            result,
            ruleName,
            message: messages.rejected(prop, forbiddenProps.get(prop)),
            node: decl,
            word: decl.prop,
          });
        }

        if (shorthandToLonghand.has(prop)) {
          if (value.includes('var(')) {
            [
              ...shorthandToLonghand.get(prop),
              ...shorthandToLonghand
                .get(prop)
                .flatMap((longhand) => shorthandToLonghand.get(longhand))
                .filter(Boolean),
            ].forEach((longhand) => {
              forbiddenProps.set(longhand, prop);
            });
          }
        }
      });
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;

export default createPlugin(ruleName, ruleFunction);
