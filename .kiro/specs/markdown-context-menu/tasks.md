# Implementation Plan

- [x] 1. Create formatting module with core text transformation functions
  - Create `src/formatting.ts` with the `TextTransformation` interface
  - Implement `wrapSelection()` function for wrapping text with prefix/suffix delimiters
  - Implement `wrapLines()` function for prepending text to each line
  - Implement `wrapLinesNumbered()` function for numbered list formatting
  - Implement `formatHeading()` function for heading level formatting
  - _Requirements: 1.2, 1.3, 1.5, 2.2, 2.3, 2.4, 2.5, 2.6, 3.2, 3.3, 4.2, 4.3, 2.8_

- [x] 1.1 Write property test for text wrapping
  - **Property 1: Text wrapping preserves content**
  - **Validates: Requirements 1.2, 1.3, 1.5, 2.2, 2.3, 2.4, 2.5**

- [x] 1.2 Write property test for substitution wrapping
  - **Property 2: Substitution wrapping structure**
  - **Validates: Requirements 1.4**

- [x] 1.3 Write property test for highlight and comment
  - **Property 3: Highlight and comment combination**
  - **Validates: Requirements 1.7**

- [x] 1.4 Write property test for code block wrapping
  - **Property 4: Code block wrapping with newlines**
  - **Validates: Requirements 2.6**

- [x] 1.5 Write property test for line prefixing
  - **Property 5: Line prefixing applies to all lines**
  - **Validates: Requirements 3.2, 4.2**

- [x] 1.6 Write property test for numbered lists
  - **Property 6: Numbered list sequential numbering**
  - **Validates: Requirements 3.3**

- [x] 1.7 Write property test for quote block idempotence
  - **Property 7: Quote block idempotence**
  - **Validates: Requirements 4.3**

- [x] 1.8 Write property test for multi-paragraph independence
  - **Property 8: Multi-paragraph line independence**
  - **Validates: Requirements 6.4**

- [x] 1.9 Write property test for heading formatting
  - **Property 9: Heading level prefix**
  - **Validates: Requirements 2.8**

- [x] 2. Implement command handlers in extension.ts
  - Register all CriticMarkup annotation commands (addition, deletion, substitution, highlight, comment, highlight+comment)
  - Register all Markdown formatting commands (bold, italic, underline, inline code, code block, bulleted list, numbered list, quote block)
  - Register all heading level commands (H1-H6)
  - Each handler should get the active editor, extract selections, call formatting functions, and apply edits
  - Handle cursor positioning for commands that need it (substitution, comment, highlight+comment)
  - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 2.2, 2.3, 2.4, 2.5, 2.6, 3.2, 3.3, 4.2, 2.8_

- [x] 2.1 Write unit tests for command handlers
  - Test empty selection handling
  - Test multi-selection support
  - Test cursor positioning for comment-related commands
  - _Requirements: 6.1, 6.3_

- [x] 3. Add command and menu contributions to package.json
  - Define all command contributions with titles and IDs
  - Create submenu definitions for "Markdown Annotations", "Markdown Formatting", and "Heading"
  - Add commands to `editor/context` menu with appropriate `when` clauses (`editorLangId == markdown`)
  - Organize commands into their respective submenus with proper grouping
  - Nest the Heading submenu under Markdown Formatting
  - _Requirements: 1.1, 2.1, 5.1, 5.2_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Manual testing and edge case verification
  - Test all commands with various text selections in Markdown files
  - Verify menus only appear in Markdown documents
  - Test edge cases: empty selections, multi-line selections, text with existing formatting
  - Verify cursor positioning for interactive commands
  - _Requirements: 5.1, 5.2, 6.1, 6.2, 6.3, 6.4_
