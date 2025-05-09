import { Markdown } from '../../packages/react-components/src/Markdown.js';

const markdown = `
# H1 – Main Title

## H2 – Section Title

### H3 – Sub-section

Plain paragraph text with **bold**, *italic*, ***bold-italic***, ~~strikethrough~~, and \`inline code\`.

> Blockquote:  
> This line should render as a quoted paragraph.

1. First ordered item  
2. Second ordered item  
   1. Nested ordered item

- Unordered list item  
  - Nested unordered item

\`\`\`js
// Fenced code block with syntax highlighting
function greet(name = "world") {
  console.log(\`Hello, ${name}!\`);
}
\`\`\`
`;

export default function ButtonPage() {
  return <Markdown>{markdown}</Markdown>;
}
