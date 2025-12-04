import { describe, it, expect } from 'bun:test';
import * as formatting from './formatting';

describe('Command Handler Unit Tests', () => {
  
  // Test empty selection handling (Requirements 6.1, 6.3)
  describe('Empty selection handling', () => {
    it('should handle empty text for wrapping operations', () => {
      const emptyText = '';
      
      // Test addition
      const addition = formatting.wrapSelection(emptyText, '{++', '++}');
      expect(addition.newText).toBe('{++++}');
      
      // Test deletion
      const deletion = formatting.wrapSelection(emptyText, '{--', '--}');
      expect(deletion.newText).toBe('{----}');
      
      // Test bold
      const bold = formatting.wrapSelection(emptyText, '**', '**');
      expect(bold.newText).toBe('****');
      
      // Test italic
      const italic = formatting.wrapSelection(emptyText, '_', '_');
      expect(italic.newText).toBe('__');
      
      // Test inline code
      const code = formatting.wrapSelection(emptyText, '`', '`');
      expect(code.newText).toBe('``');
      
      // Test bold italic
      const boldItalic = formatting.formatBoldItalic(emptyText);
      expect(boldItalic.newText).toBe('******');
    });

    it('should handle empty text for comment operations with cursor positioning', () => {
      const emptyText = '';
      
      // Test comment insertion
      const comment = formatting.wrapSelection(emptyText, '{>>', '<<}', 3);
      expect(comment.newText).toBe('{>><<}');
      expect(comment.cursorOffset).toBe(3);
      
      // Test highlight and comment
      const highlightComment = formatting.highlightAndComment(emptyText);
      expect(highlightComment.newText).toBe('{====}{>><<}');
      expect(highlightComment.cursorOffset).toBe(9); // Position between >> and <<
      
      // Test substitute and comment
      const substituteComment = formatting.substituteAndComment(emptyText);
      expect(substituteComment.newText).toBe('{~~~>~~}{>><<}');
      expect(substituteComment.cursorOffset).toBe(11); // Position between >> and <<
    });

    it('should handle empty text for substitution with cursor positioning', () => {
      const emptyText = '';
      const substitution = formatting.wrapSelection(emptyText, '{~~', '~>~~}', 4);
      expect(substitution.newText).toBe('{~~~>~~}');
      expect(substitution.cursorOffset).toBe(4); // Position after ~>
    });

    it('should handle empty lines for line-based operations', () => {
      const emptyText = '';
      
      // Test bulleted list
      const bullet = formatting.wrapLines(emptyText, '- ');
      expect(bullet.newText).toBe('');
      
      // Test numbered list
      const numbered = formatting.wrapLinesNumbered(emptyText);
      expect(numbered.newText).toBe('');
      
      // Test quote block
      const quote = formatting.wrapLines(emptyText, '> ', true);
      expect(quote.newText).toBe('');
    });
  });

  // Test cursor positioning for comment-related commands (Requirements 6.1, 6.3)
  describe('Cursor positioning for interactive commands', () => {
    it('should position cursor correctly for substitution', () => {
      const text = 'old text';
      const result = formatting.wrapSelection(text, '{~~', '~>~~}', text.length + 4);
      
      expect(result.newText).toBe('{~~old text~>~~}');
      expect(result.cursorOffset).toBe(12); // After "~>" for entering replacement (3 + 8 + 1 = 12)
    });

    it('should position cursor correctly for comment insertion', () => {
      const text = '';
      const result = formatting.wrapSelection(text, '{>>', '<<}', 3);
      
      expect(result.newText).toBe('{>><<}');
      expect(result.cursorOffset).toBe(3); // Between >> and <<
    });

    it('should position cursor correctly for highlight and comment', () => {
      const text = 'important text';
      const result = formatting.highlightAndComment(text);
      
      expect(result.newText).toBe('{==important text==}{>><<}');
      expect(result.cursorOffset).toBe(23); // Between >> and << in comment
    });

    it('should position cursor correctly for substitute and comment', () => {
      const text = 'old text';
      const result = formatting.substituteAndComment(text);
      
      expect(result.newText).toBe('{~~old text~>~~}{>><<}');
      expect(result.cursorOffset).toBe(19); // Between >> and << in comment
    });

    it('should position cursor correctly for addition and comment', () => {
      const text = 'new text';
      const result = formatting.additionAndComment(text);
      
      expect(result.newText).toBe('{++new text++}{>><<}');
      expect(result.cursorOffset).toBe(17); // Between >> and << in comment
    });

    it('should position cursor correctly for deletion and comment', () => {
      const text = 'removed text';
      const result = formatting.deletionAndComment(text);
      
      expect(result.newText).toBe('{--removed text--}{>><<}');
      expect(result.cursorOffset).toBe(21); // Between >> and << in comment
    });

    it('should not have cursor offset for simple wrapping operations', () => {
      const text = 'sample';
      
      const bold = formatting.wrapSelection(text, '**', '**');
      expect(bold.cursorOffset).toBeUndefined();
      
      const italic = formatting.wrapSelection(text, '_', '_');
      expect(italic.cursorOffset).toBeUndefined();
      
      const highlight = formatting.wrapSelection(text, '{==', '==}');
      expect(highlight.cursorOffset).toBeUndefined();
    });
  });

  // Test multi-selection support through formatting functions (Requirements 6.1, 6.3)
  describe('Multi-selection support', () => {
    it('should handle multiple text selections independently for wrapping', () => {
      const selections = ['first', 'second', 'third'];
      
      // Simulate processing multiple selections
      const results = selections.map(text => 
        formatting.wrapSelection(text, '**', '**')
      );
      
      expect(results[0].newText).toBe('**first**');
      expect(results[1].newText).toBe('**second**');
      expect(results[2].newText).toBe('**third**');
    });

    it('should handle multiple selections for line-based operations', () => {
      const selections = ['line one', 'line two', 'line three'];
      
      // Simulate processing multiple selections
      const results = selections.map(text => 
        formatting.wrapLines(text, '- ')
      );
      
      expect(results[0].newText).toBe('- line one');
      expect(results[1].newText).toBe('- line two');
      expect(results[2].newText).toBe('- line three');
    });

    it('should maintain cursor positioning for multiple selections with interactive commands', () => {
      const selections = ['text1', 'text2'];
      
      // Simulate processing multiple selections for substitution
      const results = selections.map(text => 
        formatting.wrapSelection(text, '{~~', '~>~~}', text.length + 4)
      );
      
      expect(results[0].newText).toBe('{~~text1~>~~}');
      expect(results[0].cursorOffset).toBe(9);
      
      expect(results[1].newText).toBe('{~~text2~>~~}');
      expect(results[1].cursorOffset).toBe(9);
    });
  });

  // Additional edge cases
  describe('Edge cases', () => {
    it('should handle text with existing formatting syntax', () => {
      const textWithBold = '**already bold**';
      const result = formatting.wrapSelection(textWithBold, '_', '_');
      expect(result.newText).toBe('_**already bold**_');
    });

    it('should format text as bold italic', () => {
      const text = 'important text';
      const result = formatting.formatBoldItalic(text);
      expect(result.newText).toBe('***important text***');
    });

    it('should handle multi-line selections for line-based operations', () => {
      const multiLine = 'line 1\nline 2\nline 3';
      
      const bullet = formatting.wrapLines(multiLine, '- ');
      expect(bullet.newText).toBe('- line 1\n- line 2\n- line 3');
      
      const numbered = formatting.wrapLinesNumbered(multiLine);
      expect(numbered.newText).toBe('1. line 1\n2. line 2\n3. line 3');
    });

    it('should handle selections with blank lines', () => {
      const textWithBlanks = 'line 1\n\nline 3';
      
      const bullet = formatting.wrapLines(textWithBlanks, '- ');
      expect(bullet.newText).toBe('- line 1\n\n- line 3');
      
      const quote = formatting.wrapLines(textWithBlanks, '> ');
      expect(quote.newText).toBe('> line 1\n\n> line 3');
    });

    it('should handle heading formatting on various text', () => {
      const text = 'My Heading';
      
      const h1 = formatting.formatHeading(text, 1);
      expect(h1.newText).toBe('# My Heading');
      
      const h3 = formatting.formatHeading(text, 3);
      expect(h3.newText).toBe('### My Heading');
      
      const h6 = formatting.formatHeading(text, 6);
      expect(h6.newText).toBe('###### My Heading');
    });
  });
});
