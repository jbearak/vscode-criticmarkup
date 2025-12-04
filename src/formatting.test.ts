import { describe, it } from 'bun:test';
import * as fc from 'fast-check';
import { wrapSelection, wrapLines, wrapLinesNumbered, formatHeading, highlightAndComment, wrapCodeBlock, substituteAndComment, additionAndComment, deletionAndComment } from './formatting';

describe('Formatting Module Property Tests', () => {
  
  // Feature: markdown-context-menu, Property 1: Text wrapping preserves content
  // Validates: Requirements 1.2, 1.3, 1.5, 2.2, 2.3, 2.4, 2.5
  describe('Property 1: Text wrapping preserves content', () => {
    it('should preserve original text for addition markup', () => {
      fc.assert(
        fc.property(fc.string(), (text) => {
          const result = wrapSelection(text, '{++', '++}');
          const extracted = result.newText.slice(3, -3);
          return extracted === text;
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve original text for deletion markup', () => {
      fc.assert(
        fc.property(fc.string(), (text) => {
          const result = wrapSelection(text, '{--', '--}');
          const extracted = result.newText.slice(3, -3);
          return extracted === text;
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve original text for highlight markup', () => {
      fc.assert(
        fc.property(fc.string(), (text) => {
          const result = wrapSelection(text, '{==', '==}');
          const extracted = result.newText.slice(3, -3);
          return extracted === text;
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve original text for bold formatting', () => {
      fc.assert(
        fc.property(fc.string(), (text) => {
          const result = wrapSelection(text, '**', '**');
          const extracted = result.newText.slice(2, -2);
          return extracted === text;
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve original text for italic formatting', () => {
      fc.assert(
        fc.property(fc.string(), (text) => {
          const result = wrapSelection(text, '_', '_');
          const extracted = result.newText.slice(1, -1);
          return extracted === text;
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve original text for underline formatting', () => {
      fc.assert(
        fc.property(fc.string(), (text) => {
          const result = wrapSelection(text, '<u>', '</u>');
          const extracted = result.newText.slice(3, -4);
          return extracted === text;
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve original text for inline code formatting', () => {
      fc.assert(
        fc.property(fc.string(), (text) => {
          const result = wrapSelection(text, '`', '`');
          const extracted = result.newText.slice(1, -1);
          return extracted === text;
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve original text for bold italic formatting', () => {
      fc.assert(
        fc.property(fc.string(), (text) => {
          const result = wrapSelection(text, '***', '***');
          const extracted = result.newText.slice(3, -3);
          return extracted === text;
        }),
        { numRuns: 100 }
      );
    });
  });

  // Feature: markdown-context-menu, Property 2: Substitution wrapping structure
  // Validates: Requirements 1.4
  describe('Property 2: Substitution wrapping structure', () => {
    it('should produce correct substitution structure with cursor positioned after ~>', () => {
      fc.assert(
        fc.property(fc.string(), (text) => {
          const result = wrapSelection(text, '{~~', '~>~~}', 3 + text.length + 2);
          
          // Check structure: starts with {~~, contains original text, followed by ~>~~}
          const startsCorrectly = result.newText.startsWith('{~~');
          const endsCorrectly = result.newText.endsWith('~>~~}');
          const containsText = result.newText.slice(3, 3 + text.length) === text;
          const cursorAfterMarker = result.cursorOffset === 3 + text.length + 2;
          
          return startsCorrectly && endsCorrectly && containsText && cursorAfterMarker;
        }),
        { numRuns: 100 }
      );
    });
  });

  // Feature: markdown-context-menu, Property 3: Highlight and comment combination
  // Validates: Requirements 1.7
  describe('Property 3: Highlight and comment combination', () => {
    it('should wrap text in highlight and append comment with cursor positioned correctly', () => {
      fc.assert(
        fc.property(fc.string(), (text) => {
          const result = highlightAndComment(text);
          
          // Expected structure: {==<text>==}{>><<}
          const expectedHighlight = `{==${text}==}`;
          const expectedFull = expectedHighlight + '{>><<}';
          
          // Check structure matches
          const structureCorrect = result.newText === expectedFull;
          
          // Check cursor is positioned between >> and <<
          const expectedCursorPos = expectedHighlight.length + 3; // after {>>
          const cursorCorrect = result.cursorOffset === expectedCursorPos;
          
          return structureCorrect && cursorCorrect;
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property test for substitute and comment combination
  describe('Substitute and comment combination', () => {
    it('should wrap text in substitution and append comment with cursor positioned correctly', () => {
      fc.assert(
        fc.property(fc.string(), (text) => {
          const result = substituteAndComment(text);
          
          // Expected structure: {~~<text>~>~~}{>><<}
          const expectedSubstitution = `{~~${text}~>~~}`;
          const expectedFull = expectedSubstitution + '{>><<}';
          
          // Check structure matches
          const structureCorrect = result.newText === expectedFull;
          
          // Check cursor is positioned between >> and <<
          const expectedCursorPos = expectedSubstitution.length + 3; // after {>>
          const cursorCorrect = result.cursorOffset === expectedCursorPos;
          
          return structureCorrect && cursorCorrect;
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property test for addition and comment combination
  describe('Addition and comment combination', () => {
    it('should wrap text in addition and append comment with cursor positioned correctly', () => {
      fc.assert(
        fc.property(fc.string(), (text) => {
          const result = additionAndComment(text);
          
          // Expected structure: {++<text>++}{>><<}
          const expectedAddition = `{++${text}++}`;
          const expectedFull = expectedAddition + '{>><<}';
          
          // Check structure matches
          const structureCorrect = result.newText === expectedFull;
          
          // Check cursor is positioned between >> and <<
          const expectedCursorPos = expectedAddition.length + 3; // after {>>
          const cursorCorrect = result.cursorOffset === expectedCursorPos;
          
          return structureCorrect && cursorCorrect;
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property test for deletion and comment combination
  describe('Deletion and comment combination', () => {
    it('should wrap text in deletion and append comment with cursor positioned correctly', () => {
      fc.assert(
        fc.property(fc.string(), (text) => {
          const result = deletionAndComment(text);
          
          // Expected structure: {--<text>--}{>><<}
          const expectedDeletion = `{--${text}--}`;
          const expectedFull = expectedDeletion + '{>><<}';
          
          // Check structure matches
          const structureCorrect = result.newText === expectedFull;
          
          // Check cursor is positioned between >> and <<
          const expectedCursorPos = expectedDeletion.length + 3; // after {>>
          const cursorCorrect = result.cursorOffset === expectedCursorPos;
          
          return structureCorrect && cursorCorrect;
        }),
        { numRuns: 100 }
      );
    });
  });

  // Feature: markdown-context-menu, Property 4: Code block wrapping with newlines
  // Validates: Requirements 2.6
  describe('Property 4: Code block wrapping with newlines', () => {
    it('should wrap text with ``` on separate lines before and after', () => {
      fc.assert(
        fc.property(fc.string(), (text) => {
          const result = wrapCodeBlock(text);
          
          // Check that result starts with ``` followed by newline
          const startsCorrectly = result.newText.startsWith('```\n');
          
          // Check that result ends with newline followed by ```
          const endsCorrectly = result.newText.endsWith('\n```');
          
          // Check that the text is in between
          const extractedText = result.newText.slice(4, -4);
          
          return startsCorrectly && endsCorrectly && extractedText === text;
        }),
        { numRuns: 100 }
      );
    });
  });

  // Feature: markdown-context-menu, Property 5: Line prefixing applies to all lines
  // Validates: Requirements 3.2, 4.2
  describe('Property 5: Line prefixing applies to all lines', () => {
    it('should prefix every non-empty line with bullet marker', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string(), { minLength: 1 }),
          (lines) => {
            const text = lines.join('\n');
            const result = wrapLines(text, '- ');
            const resultLines = result.newText.split('\n');
            
            // Check that every non-empty line starts with '- '
            return resultLines.every((line, idx) => {
              if (lines[idx].trim() === '') {
                return line === lines[idx]; // Empty lines unchanged
              }
              return line.startsWith('- ') && line.slice(2) === lines[idx];
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should prefix every non-empty line with quote marker', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string(), { minLength: 1 }),
          (lines) => {
            const text = lines.join('\n');
            const result = wrapLines(text, '> ');
            const resultLines = result.newText.split('\n');
            
            // Check that every non-empty line starts with '> '
            return resultLines.every((line, idx) => {
              if (lines[idx].trim() === '') {
                return line === lines[idx]; // Empty lines unchanged
              }
              return line.startsWith('> ') && line.slice(2) === lines[idx];
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: markdown-context-menu, Property 6: Numbered list sequential numbering
  // Validates: Requirements 3.3
  describe('Property 6: Numbered list sequential numbering', () => {
    it('should number each non-empty line sequentially starting from 1', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string(), { minLength: 1, maxLength: 20 }),
          (lines) => {
            const text = lines.join('\n');
            const result = wrapLinesNumbered(text);
            const resultLines = result.newText.split('\n');
            
            let expectedNumber = 1;
            return resultLines.every((line, idx) => {
              if (lines[idx].trim() === '') {
                return line === lines[idx]; // Empty lines unchanged
              }
              const expectedPrefix = `${expectedNumber}. `;
              const hasCorrectPrefix = line.startsWith(expectedPrefix);
              const hasCorrectContent = line.slice(expectedPrefix.length) === lines[idx];
              expectedNumber++;
              return hasCorrectPrefix && hasCorrectContent;
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: markdown-context-menu, Property 7: Quote block idempotence
  // Validates: Requirements 4.3
  describe('Property 7: Quote block idempotence', () => {
    it('should produce the same result when applied twice (no double prefixes)', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string(), { minLength: 1 }),
          (lines) => {
            const text = lines.join('\n');
            const firstApplication = wrapLines(text, '> ', true);
            const secondApplication = wrapLines(firstApplication.newText, '> ', true);
            
            // Applying twice should give the same result as applying once
            return firstApplication.newText === secondApplication.newText;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: markdown-context-menu, Property 8: Multi-paragraph line independence
  // Validates: Requirements 6.4
  describe('Property 8: Multi-paragraph line independence', () => {
    it('should transform each non-empty line independently without affecting blank lines', () => {
      fc.assert(
        fc.property(
          fc.array(fc.oneof(fc.string(), fc.constant('')), { minLength: 1 }),
          (lines) => {
            const text = lines.join('\n');
            const result = wrapLines(text, '- ');
            const resultLines = result.newText.split('\n');
            
            // Check that blank lines remain unchanged and non-empty lines are transformed
            return resultLines.every((line, idx) => {
              if (lines[idx].trim() === '') {
                return line === lines[idx]; // Blank lines unchanged
              }
              return line === '- ' + lines[idx]; // Non-empty lines prefixed
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: markdown-context-menu, Property 9: Heading level prefix
  // Validates: Requirements 2.8
  describe('Property 9: Heading level prefix', () => {
    it('should prepend exactly N # characters followed by a space for heading level N', () => {
      fc.assert(
        fc.property(
          fc.string(),
          fc.integer({ min: 1, max: 6 }),
          (text, level) => {
            const result = formatHeading(text, level);
            const expectedPrefix = '#'.repeat(level) + ' ';
            
            // Check that result starts with correct number of # followed by space
            const hasCorrectPrefix = result.newText.startsWith(expectedPrefix);
            
            // Check that the original text follows the prefix
            const hasCorrectContent = result.newText.slice(expectedPrefix.length) === text;
            
            return hasCorrectPrefix && hasCorrectContent;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
        
  