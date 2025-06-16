import { marked } from 'marked';
import { defaultStyles } from './styles.js';

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

  // Combine styles
  const styles = [
    noDefaultStyles ? '' : defaultStyles,
    css || ''
  ].join('\n');

  // Generate complete HTML page
  const htmlPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>${styles}</style>
  ${beforeHeadEnd || ''}
</head>
<body>
${afterBodyStart || ''}
<div class="markdown-content">${htmlContent}</div>
${beforeBodyEnd || ''}
</body>
</html>`;

  return htmlPage;
}

export {
  hyperMarked,
  tryExtractTitle
};

export default hyperMarked;
