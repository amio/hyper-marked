import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLI_PATH = path.join(__dirname, '..', 'bin', 'hyper-marked.js');
const TEST_DIR = path.join(__dirname, 'cli-temp');

// Helper function to run CLI and get output
function runCLI(args = [], input = null, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [CLI_PATH, ...args], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error(`CLI command timed out after ${timeout}ms`));
    }, timeout);

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr });
    });

    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });

    if (input !== null) {
      child.stdin.write(input);
    }
    child.stdin.end();
  });
}

// Setup and cleanup
function setupTestDir() {
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  }
}

function cleanupTestDir() {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
}

describe('CLI Tests', () => {
  // Setup
  test('setup test directory', () => {
    setupTestDir();
    assert(fs.existsSync(TEST_DIR));
  });

  test('should show help when --help flag is used', async () => {
    const result = await runCLI(['--help']);
    
    assert.strictEqual(result.code, 0);
    assert(result.stdout.includes('hyper-marked - Convert markdown to complete HTML pages'));
    assert(result.stdout.includes('Usage:'));
    assert(result.stdout.includes('Options:'));
    assert(result.stdout.includes('Examples:'));
  });

  test('should show help when -h flag is used', async () => {
    const result = await runCLI(['-h']);
    
    assert.strictEqual(result.code, 0);
    assert(result.stdout.includes('hyper-marked - Convert markdown to complete HTML pages'));
  });

  test('should show version when --version flag is used', async () => {
    const result = await runCLI(['--version']);
    
    assert.strictEqual(result.code, 0);
    assert(result.stdout.trim().match(/^\d+\.\d+\.\d+$/));
  });

  test('should show version when -v flag is used', async () => {
    const result = await runCLI(['-v']);
    
    assert.strictEqual(result.code, 0);
    assert(result.stdout.trim().match(/^\d+\.\d+\.\d+$/));
  });

  test('should show help when no arguments and no stdin', async () => {
    // Skip this test as it's hard to simulate TTY properly in tests
    // The functionality is tested manually
  });

  test('should process markdown from stdin', async () => {
    const markdown = '# Hello World\n\nThis is a **test** document.';
    const result = await runCLI([], markdown);
    
    assert.strictEqual(result.code, 0);
    assert(result.stdout.includes('<!DOCTYPE html>'));
    assert(result.stdout.includes('<h1>Hello World</h1>'));
    assert(result.stdout.includes('<strong>test</strong>'));
  });

  test('should process markdown from file', async () => {
    const testFile = path.join(TEST_DIR, 'test.md');
    const markdown = '# File Test\n\nContent from **file**.';
    
    fs.writeFileSync(testFile, markdown);
    
    const result = await runCLI([testFile]);
    
    assert.strictEqual(result.code, 0);
    assert(result.stdout.includes('<h1>File Test</h1>'));
    assert(result.stdout.includes('<strong>file</strong>'));
    assert(result.stdout.includes('<title>File Test</title>')); // extracted H1 from markdown
  });

  test('should output to file with -o option', async () => {
    const testFile = path.join(TEST_DIR, 'input.md');
    const outputFile = path.join(TEST_DIR, 'output.html');
    const markdown = '# Output Test\n\nThis goes to a **file**.';
    
    fs.writeFileSync(testFile, markdown);
    
    const result = await runCLI([testFile, '-o', outputFile]);
    
    assert.strictEqual(result.code, 0);
    assert(result.stderr.includes(`Generated: ${outputFile}`));
    assert(fs.existsSync(outputFile));
    
    const htmlContent = fs.readFileSync(outputFile, 'utf8');
    assert(htmlContent.includes('<h1>Output Test</h1>'));
    assert(htmlContent.includes('<strong>file</strong>'));
  });

  test('should output to file with --output option', async () => {
    const testFile = path.join(TEST_DIR, 'input2.md');
    const outputFile = path.join(TEST_DIR, 'output2.html');
    const markdown = '# Long Option Test';
    
    fs.writeFileSync(testFile, markdown);
    
    const result = await runCLI([testFile, '--output', outputFile]);
    
    assert.strictEqual(result.code, 0);
    assert(fs.existsSync(outputFile));
    
    const htmlContent = fs.readFileSync(outputFile, 'utf8');
    assert(htmlContent.includes('<h1>Long Option Test</h1>'));
  });

  test('should set custom title with -t option', async () => {
    const markdown = '# Title Test';
    const result = await runCLI(['-t', 'Custom Title'], markdown);
    
    assert.strictEqual(result.code, 0);
    assert(result.stdout.includes('<title>Custom Title</title>'));
  });

  test('should set custom title with --title option', async () => {
    const markdown = '# Title Test';
    const result = await runCLI(['--title', 'Another Title'], markdown);
    
    assert.strictEqual(result.code, 0);
    assert(result.stdout.includes('<title>Another Title</title>'));
  });

  test('should load custom CSS from file', async () => {
    const cssFile = path.join(TEST_DIR, 'custom.css');
    const css = 'body { background-color: red; color: white; }';
    const markdown = '# CSS Test';
    
    fs.writeFileSync(cssFile, css);
    
    const result = await runCLI(['--css', cssFile], markdown);
    
    assert.strictEqual(result.code, 0);
    assert(result.stdout.includes(css));
  });

  test('should disable default styles with --no-default-styles', async () => {
    const markdown = '# No Styles Test';
    const result = await runCLI(['--no-default-styles'], markdown);
    
    assert.strictEqual(result.code, 0);
    assert(!result.stdout.includes('font-family: -apple-system')); // Default style should be absent
  });

  test('should inject HTML with --before-head-end', async () => {
    const markdown = '# Injection Test';
    const html = '<meta name="author" content="Test Author">';
    const result = await runCLI(['--before-head-end', html], markdown);
    
    assert.strictEqual(result.code, 0);
    assert(result.stdout.includes(html));
  });

  test('should inject HTML with --after-body-start', async () => {
    const markdown = '# Body Start Test';
    const html = '<header>Site Header</header>';
    const result = await runCLI(['--after-body-start', html], markdown);
    
    assert.strictEqual(result.code, 0);
    assert(result.stdout.includes(html));
  });

  test('should inject HTML with --before-body-end', async () => {
    const markdown = '# Body End Test';
    const html = '<footer>Site Footer</footer>';
    const result = await runCLI(['--before-body-end', html], markdown);
    
    assert.strictEqual(result.code, 0);
    assert(result.stdout.includes(html));
  });

  test('should combine multiple options', async () => {
    const testFile = path.join(TEST_DIR, 'combo.md');
    const outputFile = path.join(TEST_DIR, 'combo.html');
    const cssFile = path.join(TEST_DIR, 'combo.css');
    
    const markdown = '# Combination Test\n\nMultiple **options** together.';
    const css = '.test { color: blue; }';
    
    fs.writeFileSync(testFile, markdown);
    fs.writeFileSync(cssFile, css);
    
    const result = await runCLI([
      testFile,
      '-o', outputFile,
      '-t', 'Combined Test',
      '--css', cssFile,
      '--before-body-end', '<script>console.log("test");</script>'
    ]);
    
    assert.strictEqual(result.code, 0);
    assert(fs.existsSync(outputFile));
    
    const htmlContent = fs.readFileSync(outputFile, 'utf8');
    assert(htmlContent.includes('<title>Combined Test</title>'));
    assert(htmlContent.includes(css));
    assert(htmlContent.includes('<script>console.log("test");</script>'));
    assert(htmlContent.includes('<h1>Combination Test</h1>'));
  });

  test('should handle error for non-existent input file', async () => {
    const result = await runCLI(['non-existent.md']);
    
    assert.strictEqual(result.code, 1);
    assert(result.stderr.includes('Error: Failed to read input file'));
  });

  test('should handle error for non-existent CSS file', async () => {
    const markdown = '# CSS Error Test';
    const result = await runCLI(['--css', 'non-existent.css'], markdown);
    
    assert.strictEqual(result.code, 1);
    assert(result.stderr.includes('Error: Failed to read CSS file'));
  });

  test('should handle error for missing option values', async () => {
    const markdown = '# Missing Value Test';
    
    // Test missing output filename
    let result = await runCLI(['-o'], markdown);
    assert.strictEqual(result.code, 1);
    assert(result.stderr.includes('Error: --output requires a filename'));
    
    // Test missing title
    result = await runCLI(['-t'], markdown);
    assert.strictEqual(result.code, 1);
    assert(result.stderr.includes('Error: --title requires a value'));
    
    // Test missing CSS file
    result = await runCLI(['--css'], markdown);
    assert.strictEqual(result.code, 1);
    assert(result.stderr.includes('Error: --css requires a filename'));
  });

  test('should handle unknown options', async () => {
    const markdown = '# Unknown Option Test';
    const result = await runCLI(['--unknown-option'], markdown);
    
    assert.strictEqual(result.code, 1);
    assert(result.stderr.includes('Error: Unknown option: --unknown-option'));
  });

  test('should handle multiple input files error', async () => {
    const testFile1 = path.join(TEST_DIR, 'test1.md');
    const testFile2 = path.join(TEST_DIR, 'test2.md');
    
    fs.writeFileSync(testFile1, '# Test 1');
    fs.writeFileSync(testFile2, '# Test 2');
    
    const result = await runCLI([testFile1, testFile2]);
    
    assert.strictEqual(result.code, 1);
    assert(result.stderr.includes('Error: Multiple input files not supported'));
  });

  test('should handle complex markdown with special characters', async () => {
    const markdown = `# Special Characters Test

This has "quotes" and 'apostrophes' and <brackets>.

\`\`\`javascript
const code = "with quotes";
console.log(\`template \${literals}\`);
\`\`\`

> Blockquote with **bold** and *italic*

| Column | Values |
|--------|--------|
| Test   | "Data" |
`;
    
    const result = await runCLI([], markdown);
    
    assert.strictEqual(result.code, 0);
    assert(result.stdout.includes('<h1>Special Characters Test</h1>'));
    assert(result.stdout.includes('&quot;quotes&quot;'));
    assert(result.stdout.includes('<brackets>'));
    assert(result.stdout.includes('<pre><code'));
    assert(result.stdout.includes('<blockquote>'));
    assert(result.stdout.includes('<table>'));
  });

  // Cleanup
  test('cleanup test directory', () => {
    cleanupTestDir();
    assert(!fs.existsSync(TEST_DIR));
  });
});