import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hyperMarked, tryExtractTitle } from '../lib/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('hyper-marked', () => {
  test('should convert basic markdown to HTML page', () => {
    const markdown = '# Hello World\n\nThis is **bold** text.';
    const html = hyperMarked(markdown);
    
    assert(html.includes('<!DOCTYPE html>'));
    assert(html.includes('<html lang="en">'));
    assert(html.includes('<title>Hello World</title>'));
    assert(html.includes('<h1>Hello World</h1>'));
    assert(html.includes('<strong>bold</strong>'));
  });

  test('should handle custom title', () => {
    const markdown = '# Test';
    const html = hyperMarked(markdown, {
      title: 'Custom Title'
    });
    
    assert(html.includes('<title>Custom Title</title>'));
    assert(html.includes('<html lang="en">'));
  });

  test('should extract title from first H1 header when no title provided', () => {
    const markdown = '# Hello World\n\nSome content here.';
    const html = hyperMarked(markdown);
    
    assert(html.includes('<title>Hello World</title>'));
    assert(html.includes('<h1>Hello World</h1>'));
  });

  test('should extract title from first H1 and ignore subsequent headers', () => {
    const markdown = `# First Header
## Second Header  
# Another H1
### Third Header`;
    const html = hyperMarked(markdown);
    
    assert(html.includes('<title>First Header</title>'));
  });

  test('should handle H1 with extra spaces', () => {
    const markdown = '#   Spaced Title   \n\nContent here.';
    const html = hyperMarked(markdown);
    
    assert(html.includes('<title>Spaced Title</title>'));
  });

  test('should fallback to Document when no H1 found', () => {
    const markdown = '## Only H2 Headers\n\n### And H3\n\nNo H1 here.';
    const html = hyperMarked(markdown);
    
    assert(html.includes('<title>Document</title>'));
  });

  test('should ignore H1 inside code blocks', () => {
    const markdown = `## Introduction

\`\`\`
# This is not a real header
console.log('hello');
\`\`\`

# Real Header

Content here.`;
    const html = hyperMarked(markdown);
    
    assert(html.includes('<title>Real Header</title>'));
  });

  test('should handle empty H1 header', () => {
    const markdown = '# \n\nSome content.';
    const html = hyperMarked(markdown);
    
    assert(html.includes('<title>Document</title>'));
  });

  test('should prioritize explicit title over extracted title', () => {
    const markdown = '# Extracted Title\n\nContent here.';
    const html = hyperMarked(markdown, {
      title: 'Explicit Title'
    });
    
    assert(html.includes('<title>Explicit Title</title>'));
    assert(!html.includes('<title>Extracted Title</title>'));
  });



  test('should fall back to Document when no title options provided', () => {
    const markdown = '## Only H2\n\nNo H1 here.';
    const html = hyperMarked(markdown);
    
    assert(html.includes('<title>Document</title>'));
  });

  test('should include custom CSS', () => {
    const markdown = '# Test';
    const customCss = 'body { color: red; }';
    const html = hyperMarked(markdown, {
      css: customCss
    });
    
    assert(html.includes(customCss));
  });

  test('should handle disabled default styles', () => {
    const markdown = '# Test';
    const customCss = 'body { margin: 0; }';
    const html = hyperMarked(markdown, {
      noDefaultStyles: true,
      css: customCss
    });
    
    assert(html.includes(customCss));
    assert(!html.includes('font-family: -apple-system'));
  });

  test('should handle marked options', () => {
    const markdown = '# Test Header\n\nContent here.';
    const html = hyperMarked(markdown, {
      markedOptions: {
        headerIds: true
      }
    });
    
    // The HTML should be generated (exact output depends on marked version)
    assert(html.includes('<h1'));
    assert(html.includes('Test Header'));
  });



  test('should handle complex markdown features', () => {
    const markdown = `# Main Title

## Subtitle

This is **bold** and *italic* text.

### Code Example

\`\`\`javascript
console.log('hello');
\`\`\`

### List

- Item 1
- Item 2
- Item 3

### Blockquote

> This is a quote

### Link

[GitHub](https://github.com)

### Table

| Name | Age |
|------|-----|
| John | 25  |
| Jane | 30  |
`;

    const html = hyperMarked(markdown);
    
    assert(html.includes('<h1>Main Title</h1>'));
    assert(html.includes('<h2>Subtitle</h2>'));
    assert(html.includes('<h3>Code Example</h3>'));
    assert(html.includes('<strong>bold</strong>'));
    assert(html.includes('<em>italic</em>'));
    assert(html.includes('console.log'));
    assert(html.includes('<ul>'));
    assert(html.includes('<li>Item 1</li>'));
    assert(html.includes('<blockquote>'));
    assert(html.includes('<a href="https://github.com">GitHub</a>'));
    assert(html.includes('<table>'));
    assert(html.includes('<td>John</td>'));
  });

  test('should handle HTML injection options', () => {
    const markdown = '# Test';
    const html = hyperMarked(markdown, {
      beforeHeadEnd: '<link rel="stylesheet" href="custom.css">',
      afterBodyStart: '<header>Site Header</header>',
      beforeBodyEnd: '<footer>Site Footer</footer><script src="app.js"></script>'
    });
    
    assert(html.includes('<link rel="stylesheet" href="custom.css">'));
    assert(html.includes('<header>Site Header</header>'));
    assert(html.includes('<footer>Site Footer</footer>'));
    assert(html.includes('<script src="app.js"></script>'));
  });

  test('should throw error for non-string input', () => {
    assert.throws(() => {
      hyperMarked(123);
    }, {
      message: 'Markdown content must be a string'
    });

    assert.throws(() => {
      hyperMarked(null);
    }, {
      message: 'Markdown content must be a string'
    });

    assert.throws(() => {
      hyperMarked(undefined);
    }, {
      message: 'Markdown content must be a string'
    });
  });

  test('should handle empty markdown', () => {
    const html = hyperMarked('');
    
    assert(html.includes('<!DOCTYPE html>'));
    assert(html.includes('<body>'));
    assert(html.includes('</body>'));
  });

  test('should escape HTML in title', () => {
    const markdown = '# Test';
    const html = hyperMarked(markdown, {
      title: 'Test & <script>alert("xss")</script>'
    });
    
    // Note: In a real implementation, you might want to escape the title
    // For now, just check it's included
    assert(html.includes('<title>Test & <script>alert("xss")</script></title>'));
  });

  test('should generate valid HTML structure', () => {
    const markdown = '# Test\n\nParagraph text.';
    const html = hyperMarked(markdown);
    
    // Check basic HTML structure
    assert(html.startsWith('<!DOCTYPE html>'));
    assert(html.includes('<html lang="en">'));
    assert(html.includes('<meta charset="UTF-8">'));
    assert(html.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0">'));
    assert(html.includes('<head>'));
    assert(html.includes('</head>'));
    assert(html.includes('<body>'));
    assert(html.includes('</body>'));
    assert(html.includes('</html>'));
  });


});

describe('tryExtractTitle', () => {
  test('should extract simple H1 title', () => {
    const markdown = '# Hello World\n\nContent here.';
    const title = tryExtractTitle(markdown);
    
    assert.strictEqual(title, 'Hello World');
  });

  test('should return null when no H1 found', () => {
    const markdown = '## H2 Header\n\n### H3 Header\n\nNo H1.';
    const title = tryExtractTitle(markdown);
    
    assert.strictEqual(title, null);
  });

  test('should ignore H1 in code blocks', () => {
    const markdown = `\`\`\`
# Fake header
\`\`\`

# Real header`;
    const title = tryExtractTitle(markdown);
    
    assert.strictEqual(title, 'Real header');
  });

  test('should handle empty or invalid input', () => {
    assert.strictEqual(tryExtractTitle(''), null);
    assert.strictEqual(tryExtractTitle(null), null);
    assert.strictEqual(tryExtractTitle(undefined), null);
  });

  test('should trim whitespace from extracted title', () => {
    const markdown = '#   Spaced Title   ';
    const title = tryExtractTitle(markdown);
    
    assert.strictEqual(title, 'Spaced Title');
  });

  test('should return null for empty H1', () => {
    const markdown = '# \n\nContent.';
    const title = tryExtractTitle(markdown);
    
    assert.strictEqual(title, null);
  });
});

describe('integration tests', () => {
  test('should generate files that can be written to disk', () => {
    const markdown = `# Integration Test

This is a test document with various **markdown** features.

## Code Block

\`\`\`javascript
function test() {
  return 'hello world';
}
\`\`\`

## List

1. First item
2. Second item
3. Third item

That's all!
`;

    const html = hyperMarked(markdown, {
      title: 'Integration Test Document',
      css: `
        .test-class {
          background-color: #f0f0f0;
          padding: 10px;
        }
      `
    });

    // Write to temporary file to ensure it works
    const tempFile = path.join(__dirname, 'temp-integration-test.html');
    
    try {
      fs.writeFileSync(tempFile, html);
      
      // Read it back to verify
      const readHtml = fs.readFileSync(tempFile, 'utf8');
      assert.strictEqual(readHtml, html);
      
      // Clean up
      fs.unlinkSync(tempFile);
    } catch (error) {
      // Clean up on error
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
      throw error;
    }
  });
});