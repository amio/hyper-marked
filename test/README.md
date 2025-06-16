# Tests for hyper-marked

This directory contains the test suite for the `hyper-marked` package using Node.js native test runner.

## Test Files

- `hyper-marked.test.js` - Core functionality tests
- `examples.test.js` - Example scenario tests and integration tests

## Running Tests

To run all tests:

```bash
npm test
```

To run tests with more detailed output:

```bash
node --test test/**/*.test.js
```

To run a specific test file:

```bash
node --test test/hyper-marked.test.js
```

## Test Coverage

The test suite covers:

### Core Functionality (`hyper-marked.test.js`)
- ✅ Basic markdown to HTML conversion
- ✅ Custom options (title)
- ✅ Custom CSS injection
- ✅ Default styles enable/disable
- ✅ HTML injection points (beforeHeadEnd, afterBodyStart, beforeBodyEnd)
- ✅ Marked parser options
- ✅ Convenience function (`convert`)
- ✅ Complex markdown features (tables, lists, code blocks, etc.)
- ✅ Error handling for invalid inputs
- ✅ Empty content handling
- ✅ HTML structure validation
- ✅ File generation integration

### Example Scenarios (`examples.test.js`)
- ✅ Blog post generation
- ✅ Documentation pages
- ✅ README conversion
- ✅ Minimal usage
- ✅ Complex styling scenarios
- ✅ File system integration

## Test Strategy

The tests use Node.js native test runner which provides:
- Zero external dependencies for testing
- Built-in assertion library
- Structured test organization with `describe` and `test`
- Clear test output and reporting

## Adding New Tests

When adding new tests:

1. Use descriptive test names
2. Test both positive and negative cases
3. Include integration tests for file operations
4. Verify HTML structure and content
5. Test custom configurations and edge cases

Example test structure:

```javascript
const { test, describe } = require('node:test');
const assert = require('node:assert');
const { hyperMarked } = require('../lib/index.js');

describe('feature name', () => {
  test('should do something specific', () => {
    const result = hyperMarked('# Test');
    assert(result.includes('<h1>Test</h1>'));
  });
});
```
