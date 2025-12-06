# Change Log

All notable changes to the "mdmarkup" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

**BREAKING CHANGE:** Configuration setting renamed for consistency
- Renamed `mdmarkup.disableAuthorNames` to `mdmarkup.includeAuthorNameInComments`
- The new setting uses positive logic (default: `true`) instead of negative logic (default: `false`)
- **Migration:** If you previously set `disableAuthorNames: true`, you should now set `includeAuthorNameInComments: false`
- **Migration:** If you previously set `disableAuthorNames: false` or left it at default, no action needed (new default is `true`)

## [0.9.0] - Dec 2025

### Major Rewrite

This version represents a major rewrite and expansion of the original extension. Over 90% of the TypeScript code is new, while a small portion of the original snippet and grammar configuration has been adapted and extended. The extension has evolved from a simple syntax highlighter into a comprehensive Markdown editing tool.

### Added

**Multi-line Pattern Support:**
- Full support for CriticMarkup patterns spanning multiple lines
- Support for patterns containing empty lines
- Block-level parsing to prevent markdown-it from splitting patterns
- Comprehensive test coverage with property-based testing

**Markdown Preview Rendering:**
- markdown-it plugin for live preview rendering
- Theme-aware CSS styling with light/dark mode support
- HTML generation with semantic tags (ins, del, mark, span)
- Proper handling of nested Markdown within CriticMarkup patterns

**Author Attribution:**
- Automatic author names in comments using OS username
- Optional custom author name configuration
- Optional timestamp in ISO 8601 format
- Configuration settings for customization

**Markdown Formatting Tools:**
- Text formatting: Bold, Italic, Bold Italic, Strikethrough, Underline, Inline Code
- Lists: Bulleted List, Numbered List, Task List
- Blocks: Code Block, Quote Block
- Headings: H1 through H6
- Links: Insert Link
- Table reflow with intelligent column alignment preservation

**UI Enhancements:**
- Toolbar buttons for Markdown Formatting and Annotations submenus
- Context menu integration with organized submenus
- Nested Heading submenu for better organization
- Icons for toolbar buttons and submenus

**Testing Infrastructure:**
- Comprehensive unit tests for all modules
- Property-based testing using fast-check (100+ iterations per property)
- Test coverage for edge cases and error conditions
- Manual test guides and checklists

**Configuration Options:**
- `mdmarkup.includeAuthorNameInComments`: Include author name in comments (default: true)
- `mdmarkup.authorName`: Custom author name
- `mdmarkup.includeTimestampInComments`: Include timestamps in comments (default: true)

### Changed

**Renamed Extension:**
- Changed name from "CriticMarkup" to "mdmarkup" for clarity, expanded scope
- Updated all references, scopes, and identifiers
- Maintained backward compatibility with CriticMarkup specification

**Syntax Highlighting:**
- Updated and extended TextMate grammar derived from the original extension
- Automatic theme adaptation (light/dark/high-contrast)
- Uses `markup.inserted`, `markup.deleted`, `markup.changed`, etc.
- Removed custom color settings in favor of theme integration

**Navigation Commands:**
- Enhanced regex patterns for better multi-line support
- Improved filtering of nested/overlapping patterns
- Better handling of edge cases

**Code Architecture:**
- Modular design with separate files for concerns
- `src/formatting.ts`: Text transformation logic
- `src/author.ts`: Author name handling
- `src/changes.ts`: Navigation logic
- `src/preview/mdmarkup-plugin.ts`: Preview rendering
- TypeScript with strict type checking

**Tooling:**
- Migrated from npm to Bun for package management
- Modern TypeScript configuration (ES2019 target)
- Bun test runner for fast test execution
- Property-based testing with fast-check

### Known Limitations

- Multi-line patterns must start at beginning of line for preview rendering
- Mid-line multi-line patterns only work for navigation, not preview
- TextMate has inherent limitations with very long multi-line patterns
- These limitations are documented in README and design documents

### Documentation

- Comprehensive README with fork history and feature comparison
- AGENTS.md with detailed architecture documentation
- Design documents for major features in `.kiro/specs/`
  - Manual test guides and checklists
  - Property-based test documentation

## [0.2.0] - 2019-04-27 (Original Extension)

### Added
- Implemented functionality to go to next/previous change

### Changed
- Tidied up code and repository

## [0.1.1] - 2019-04-16 (Original Extension)

### Changed
- Improved support for markup that extends over multiple lines

## [0.1.0] - 2019-03-28 (Original Extension)

### Added
- Initial release by Joel Lööw
- Basic CriticMarkup syntax highlighting
- Snippets for five CriticMarkup patterns
- Custom color settings for syntax highlighting

---

## Version Comparison

### Original Extension (v0.2.0, 2019)
- ~200 lines of TypeScript
- Basic syntax highlighting with custom colors
- Snippets and navigation commands
- No tests, no preview, no formatting tools
- Archived and unmaintained

### Current Fork (v0.9.0, 2025)
- ~3,500+ lines of TypeScript
- Major rewrite with 90%+ new TypeScript code; snippets and TextMate grammar adapted from original extension
- Multi-line pattern support
- Markdown preview rendering
- Author attribution with timestamps
- Markdown formatting commands
- Table reflow with alignment
- Toolbar buttons and context menus
- Comprehensive test coverage
- Modern tooling (Bun, fast-check)

## Links

- [GitHub Repository](https://github.com/jbearak/mdmarkup)
- [CriticMarkup Official Site](http://criticmarkup.com/)
- [Original Extension (archived)](https://github.com/CriticMarkup/vscode-criticmarkup)