import { marked } from 'marked';

/**
 * Try to extract title from markdown content (from first H1)
 * @param {string} markdown - The markdown content to parse
 * @returns {string|null} The first H1 title or null if not found
 */
function tryExtractTitle(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    return null;
  }

  // Remove code blocks to avoid matching H1 inside them
  const codeBlockRegex = /```[\s\S]*?```/g;
  const cleanMarkdown = markdown.replace(codeBlockRegex, '');

  // Split into lines and process each line
  const lines = cleanMarkdown.split('\n');
  
  for (const line of lines) {
    // Match H1 pattern: single # followed by space and content
    const h1Match = line.match(/^#\s+(.+)$/);
    
    if (h1Match) {
      const title = h1Match[1].trim();
      if (title) {
        return title;
      }
    }
  }

  return null;
}

/**
 * Convert markdown string to complete HTML page using hyper-marked
 * @param {string} markdown - The markdown content to convert
 * @param {Object} options - Configuration options
 * @param {string} options.title - Page title (default: extracted H1 from markdown or 'Document')
 * @param {string} options.css - Custom CSS styles to include
 * @param {boolean} options.noDefaultStyles - Disable default styling (default: false)
 * @param {string} options.beforeHeadEnd - HTML to inject before </head> tag
 * @param {string} options.afterBodyStart - HTML to inject after <body> tag
 * @param {string} options.beforeBodyEnd - HTML to inject before </body> tag
 * @param {Object} options.markedOptions - Options to pass to marked parser
 * @returns {string} Complete HTML page string
 */
function hyperMarked(markdown, options = {}) {
  if (typeof markdown !== 'string') {
    throw new Error('Markdown content must be a string');
  }

  // Determine title with priority:
  // 1. Explicit title (highest priority)
  // 2. Extracted H1 from markdown
  // 3. Default 'Document' (lowest priority)
  let finalTitle = 'Document';

  if (options.title) {
    // Explicit title provided - use it
    finalTitle = options.title;
  } else {
    // Try to extract from H1
    const extractedTitle = tryExtractTitle(markdown);
    if (extractedTitle) {
      finalTitle = extractedTitle;
    }
  }

  const {
    title = finalTitle,
    css = '',
    noDefaultStyles = false,
    beforeHeadEnd = '',
    afterBodyStart = '',
    beforeBodyEnd = '',
    markedOptions = {}
  } = { ...options, title: finalTitle };

  // Configure marked with default options and user overrides
  const markedConfig = {
    headerIds: false,
    mangle: false,
    ...markedOptions
  };

  // Convert markdown to HTML
  const htmlContent = marked(markdown, markedConfig);

  // Default CSS styles
  const defaultStyles = `
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 600;
    }
    h1 { font-size: 2.5em; border-bottom: 2px solid #eee; padding-bottom: 0.3em; }
    h2 { font-size: 2em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    h3 { font-size: 1.5em; }
    h4 { font-size: 1.2em; }
    h5 { font-size: 1em; }
    h6 { font-size: 0.9em; }
    p { margin-bottom: 1em; }
    a { color: #0366d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
    blockquote {
      margin: 0;
      padding: 0 1em;
      color: #6a737d;
      border-left: 0.25em solid #dfe2e5;
    }
    code {
      padding: 0.2em 0.4em;
      margin: 0;
      font-size: 85%;
      background-color: rgba(27,31,35,0.05);
      border-radius: 3px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    }
    pre {
      padding: 16px;
      overflow: auto;
      font-size: 85%;
      line-height: 1.45;
      background-color: #f6f8fa;
      border-radius: 6px;
      margin-bottom: 1em;
    }
    pre code {
      display: inline;
      max-width: auto;
      padding: 0;
      margin: 0;
      overflow: visible;
      line-height: inherit;
      word-wrap: normal;
      background-color: transparent;
      border: 0;
    }
    table {
      border-spacing: 0;
      border-collapse: collapse;
      margin-bottom: 1em;
      width: 100%;
    }
    table th, table td {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }
    table th {
      font-weight: 600;
      background-color: #f6f8fa;
    }
    ul, ol {
      padding-left: 2em;
      margin-bottom: 1em;
    }
    li {
      margin-bottom: 0.25em;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    hr {
      height: 0.25em;
      padding: 0;
      margin: 24px 0;
      background-color: #e1e4e8;
      border: 0;
    }
  `;

  // Combine styles
  const allStyles = noDefaultStyles
    ? css
    : (css ? `${defaultStyles}\n${css}` : defaultStyles);

  // Generate complete HTML page
  const htmlPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${allStyles ? `<style>\n${allStyles}\n  </style>` : ''}${beforeHeadEnd ? `\n${beforeHeadEnd}` : ''}
</head>
<body>${afterBodyStart ? `\n${afterBodyStart}` : ''}
${htmlContent}${beforeBodyEnd ? `\n${beforeBodyEnd}` : ''}
</body>
</html>`;

  return htmlPage;
}

export {
  hyperMarked,
  tryExtractTitle
};

export default hyperMarked;
