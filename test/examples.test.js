import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hyperMarked } from '../lib/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('example scenarios', () => {
  test('blog post example', () => {
    const markdown = `# My Awesome Blog Post

Welcome to my blog! This post demonstrates the power of **hyper-marked**.

## What is hyper-marked?

hyper-marked is a simple and powerful tool that converts markdown to complete HTML pages.

### Features

- ✅ Easy to use
- ✅ Beautiful default styling
- ✅ Fully customizable
- ✅ TypeScript support

## Code Example

Here's how to use it:

\`\`\`javascript
const { hyperMarked } = require('hyper-marked');

const html = hyperMarked('# Hello');
console.log(html);
\`\`\`

## Links and References

- [GitHub](https://github.com)
- [npm](https://npmjs.com)

> This is a blockquote that adds some visual interest to the content.

### Conclusion

That's all for now. Thanks for reading!
`;

    const html = hyperMarked(markdown, {
      title: 'My Awesome Blog Post',
      css: `
        .blog-header { 
          text-align: center; 
          color: #2c3e50; 
        }
        .highlight { 
          background-color: #fff3cd; 
          padding: 2px 4px; 
        }
      `,
      beforeHeadEnd: '<meta name="author" content="Blog Author">',
      afterBodyStart: '<nav class="site-nav">Navigation</nav>',
      beforeBodyEnd: '<script>console.log("Blog post loaded");</script>'
    });

    assert(html.includes('<title>My Awesome Blog Post</title>'));
    assert(html.includes('<h1>My Awesome Blog Post</h1>'));
    assert(html.includes('<strong>hyper-marked</strong>'));
    assert(html.includes('hyperMarked'));
    assert(html.includes('.blog-header'));
    assert(html.includes('text-align: center'));
    assert(html.includes('<meta name="author" content="Blog Author">'));
    assert(html.includes('<nav class="site-nav">Navigation</nav>'));
    assert(html.includes('<script>console.log("Blog post loaded");</script>'));
  });

  test('documentation example', () => {
    const markdown = `# API Documentation

## Installation

\`\`\`bash
npm install hyper-marked
\`\`\`

## Usage

### Basic Usage

\`\`\`javascript
const { markdownToHtmlPage } = require('hyper-marked');
const html = markdownToHtmlPage('# Hello');
\`\`\`

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| title | string | 'Document' | Page title |
| lang | string | 'en' | Language |
| css | string | '' | Custom CSS |

### Examples

#### Custom Styling

\`\`\`javascript
const html = hyperMarked(markdown, {
  title: 'My Doc',
  css: 'body { font-family: Arial; }'
});
\`\`\`

#### Disable Default Styles

\`\`\`javascript
const html = hyperMarked(markdown, {
  noDefaultStyles: true
});
\`\`\`

## API Reference

### hyperMarked(markdown, options)

Converts markdown to HTML page.

**Parameters:**
- \`markdown\` (string) - The markdown content
- \`options\` (object) - Configuration options

**Returns:** Complete HTML page string

---

That's the complete API documentation!
`;

    const html = hyperMarked(markdown, {
      title: 'hyper-marked API Documentation',
      css: `
        .api-section {
          border-left: 4px solid #007acc;
          padding-left: 20px;
          margin: 20px 0;
        }
        .parameter {
          font-family: monospace;
          background-color: #f1f3f4;
          padding: 2px 6px;
          border-radius: 3px;
        }
      `,
      beforeHeadEnd: '<link rel="canonical" href="https://docs.example.com/hyper-marked">',
      afterBodyStart: '<div class="docs-header">Documentation</div>'
    });

    assert(html.includes('<title>hyper-marked API Documentation</title>'));
    assert(html.includes('<h1>API Documentation</h1>'));
    assert(html.includes('<table>'));
    assert(html.includes('<th>Option</th>'));
    assert(html.includes('<td>title</td>'));
    assert(html.includes('npm install hyper-marked'));
    assert(html.includes('.api-section'));
    assert(html.includes('<link rel="canonical" href="https://docs.example.com/hyper-marked">'));
    assert(html.includes('<div class="docs-header">Documentation</div>'));
  });

  test('readme example', () => {
    const markdown = `# hyper-marked

🚀 Convert markdown strings to complete HTML pages using marked.

## Quick Start

\`\`\`bash
npm install hyper-marked
\`\`\`

\`\`\`javascript
const { hyperMarked } = require('hyper-marked');

const markdown = '# Hello World\\n\\nThis is **bold** text.';
const html = hyperMarked(markdown);

console.log(html); // Complete HTML page!
\`\`\`

## Features

- 📝 Markdown to HTML conversion
- 🎨 Beautiful default styling
- ⚙️ Fully customizable
- 📱 Responsive design
- 🔧 TypeScript support

## Examples

### Custom Title

\`\`\`javascript
const html = hyperMarked(markdown, {
  title: 'My Document'
});
\`\`\`

### Custom Styling

\`\`\`javascript
const html = hyperMarked(markdown, {
  css: 'body { background: #f0f0f0; }'
});
\`\`\`

## License

MIT © 2024
`;

    const html = hyperMarked(markdown, {
      title: 'hyper-marked - Markdown to HTML Converter'
    });

    assert(html.includes('<title>hyper-marked - Markdown to HTML Converter</title>'));
    assert(html.includes('<h1>hyper-marked</h1>'));
    assert(html.includes('🚀 Convert markdown'));
    assert(html.includes('<h2>Quick Start</h2>'));
    assert(html.includes('npm install hyper-marked'));
    assert(html.includes('📝 Markdown to HTML'));
  });

  test('minimal example', () => {
    const markdown = '# Simple\n\nJust a simple document.';
    const html = hyperMarked(markdown);

    assert(html.includes('<!DOCTYPE html>'));
    assert(html.includes('<h1>Simple</h1>'));
    assert(html.includes('<p>Just a simple document.</p>'));
  });

  test('complex styling example', () => {
    const markdown = `# Styled Document

This document has custom styling applied.

## Section with Background

This section should have a special background.

### Code Block

\`\`\`python
def hello_world():
    print("Hello, World!")
    return True
\`\`\`

### Quote

> This is an important quote that should stand out.

### List

1. First item
2. Second item
3. Third item

That's all!
`;

    const html = hyperMarked(markdown, {
      title: 'Beautifully Styled Document',
      css: `
        body {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 30px;
          margin: 20px;
        }
        h1 {
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          border-bottom: 2px solid rgba(255,255,255,0.3);
        }
        h2 {
          color: #ffd700;
          border-bottom: 1px solid rgba(255,215,0,0.3);
        }
        blockquote {
          background: rgba(255, 255, 255, 0.1);
          border-left: 4px solid #ffd700;
          border-radius: 0 10px 10px 0;
        }
        pre {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        code {
          background: rgba(255, 255, 255, 0.2);
          color: #ffd700;
        }
      `,
      beforeHeadEnd: '<link rel="preconnect" href="https://fonts.googleapis.com">',
      afterBodyStart: '<div class="gradient-overlay"></div>',
      beforeBodyEnd: '<script>document.body.classList.add("loaded");</script>'
    });

    assert(html.includes('<title>Beautifully Styled Document</title>'));
    assert(html.includes('linear-gradient'));
    assert(html.includes('backdrop-filter'));
    assert(html.includes('text-shadow'));
    assert(html.includes('#ffd700'));
    assert(html.includes('<link rel="preconnect" href="https://fonts.googleapis.com">'));
    assert(html.includes('<div class="gradient-overlay"></div>'));
    assert(html.includes('<script>document.body.classList.add("loaded");</script>'));
  });

  test('file generation example', () => {
    const markdown = `# Test File Generation

This is a test to ensure files can be properly generated.

## Content

Some content here with **formatting**.

### List

- Item A
- Item B
- Item C

Done!
`;

    const html = hyperMarked(markdown, {
      title: 'Generated File Test',
      beforeHeadEnd: '<!-- Generated file test -->',
      afterBodyStart: '<div id="app">',
      beforeBodyEnd: '</div><script>console.log("File generated successfully");</script>'
    });

    // Test that the HTML can be written to a file
    const testDir = path.join(__dirname, 'temp');
    const testFile = path.join(testDir, 'test-generation.html');

    // Create temp directory if it doesn't exist
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    try {
      fs.writeFileSync(testFile, html);
      
      // Verify file exists and has content
      assert(fs.existsSync(testFile));
      
      const fileContent = fs.readFileSync(testFile, 'utf8');
      assert(fileContent.includes('<title>Generated File Test</title>'));
      assert(fileContent.includes('<h1>Test File Generation</h1>'));
      assert(fileContent.includes('<!-- Generated file test -->'));
      assert(fileContent.includes('<div id="app">'));
      assert(fileContent.includes('</div><script>console.log("File generated successfully");</script>'));
      
      // Clean up
      fs.unlinkSync(testFile);
      fs.rmdirSync(testDir);
    } catch (error) {
      // Clean up on error
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }
      if (fs.existsSync(testDir)) {
        fs.rmdirSync(testDir);
      }
      throw error;
    }
  });
});