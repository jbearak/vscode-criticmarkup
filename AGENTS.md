# AGENTS.md

## Overview

This is a VS Code extension that adds comprehensive Markdown formatting and markup tools to Visual Studio Code. It uses [standard Markdown syntax](https://daringfireball.net/projects/markdown/syntax) with [Critic Markup](https://github.com/CriticMarkup/CriticMarkup-toolkit) syntax for comments and tracked changes (comments, highlights, substitutions, etc.). It provides syntax highlighting, formatting and markup menus (in the editor toolbar and in the right-click menu), navigation between comments and proposed changes, and preview rendering.

## Development commands

- Setup dependencies:
```sh
bun install
```
- Compile TypeScript:
```sh
bun run compile
```
- Watch during development:
```sh
bun run watch
```
- Run tests:
```sh
bun test
```
- Package a `.vsix` for local install or distribution:
```sh
bunx vsce package
```
- Install the built VSIX in VS Code:
```sh
code --install-extension mdmarkup-<version>.vsix
```

Notes:
- Bun is used for all scripts and dependency management
- Bun auto-loads `.env` files; no separate dotenv setup is required
- Tests use Bun's built-in test runner with fast-check for property-based testing

## Code architecture

### Entry point: `src/extension.ts`

Responsibilities:
- Activation: Registers all mdmarkup commands
- Command registration: Annotation, formatting, and navigation commands
- Markdown preview integration: Returns markdown-it plugin for preview rendering
- Configuration: Reads user settings for author names and timestamps

Key command groups:
- **Navigation**: `mdmarkup.nextChange`, `mdmarkup.prevChange` - Navigate between mdmarkup patterns
- **Annotations**: `mdmarkup.markAddition`, `mdmarkup.markDeletion`, `mdmarkup.markSubstitution`, `mdmarkup.highlight`, `mdmarkup.insertComment`, plus combined commands
- **Formatting**: Bold, italic, strikethrough, headings, lists, code blocks, links, table reflow

### Core modules

**`src/changes.ts`** - Navigation logic
- `getAllMatches()`: Finds all mdmarkup patterns in document using regex
- `next()`, `prev()`: Navigate to next/previous pattern
- Supports multi-line patterns including those with empty lines
- Filters nested/overlapping patterns

**`src/formatting.ts`** - Text transformation logic
- `wrapSelection()`: Wraps text with prefix/suffix (used for annotations)
- Markdown formatting functions: bold, italic, lists, headings, etc.
- `reflowTable()`: Intelligent table reformatting with column alignment
- All functions return `TextTransformation` interface

**`src/author.ts`** - Author name handling
- `getAuthorName()`: Retrieves author name from settings or OS username
- `getTimestamp()`: Generates ISO 8601 timestamp for comments
- Respects configuration settings for disabling or customizing author attribution

**`src/preview/mdmarkup-plugin.ts`** - Markdown preview rendering
- markdown-it plugin that renders mdmarkup syntax in preview
- Block-level rule for multi-line patterns with empty lines
- Inline rule for single-line and simple multi-line patterns
- Generates HTML with CSS classes for styling
- **Limitation**: Multi-line patterns must start at beginning of line for preview rendering

### Syntax highlighting

**`syntaxes/mdmarkup.json`** - TextMate injection grammar
- Injects mdmarkup scopes into Markdown documents
- Uses standard TextMate scopes (markup.inserted, markup.deleted, etc.)
- Automatic theme adaptation (light/dark/high-contrast)
- **Limitation**: TextMate has inherent limitations with multi-line pattern highlighting

### Preview styling

**`media/mdmarkup.css`** - Preview stylesheet
- Theme-aware colors using CSS custom properties
- Supports light and dark themes via `prefers-color-scheme`
- Distinct styling for each mdmarkup pattern type
- Semi-transparent backgrounds for readability

### Configuration

Settings in `package.json`:
- `mdmarkup.disableAuthorNames`: Disable automatic author names in comments
- `mdmarkup.authorName`: Custom author name (defaults to OS username)
- `mdmarkup.includeTimestampInComments`: Include timestamp in comment attribution

### UI integration

**Toolbar buttons** (editor/title menu):
- Markdown Formatting submenu
- Markdown Annotations submenu (with prev/nextChange navigation)

**Context menu** (right-click in editor):
- Markdown Annotations submenu
- Markdown Formatting submenu with nested Heading submenu

**Keybindings**:
- `Alt+Shift+K`: Previous Change
- `Alt+Shift+J`: Next Change

## Multi-line pattern support

The extension fully supports multi-line mdmarkup patterns with the following characteristics:

**What works**:
- Navigation commands work for all patterns regardless of position
- Preview rendering works for patterns starting at beginning of line
- Patterns can contain empty lines
- All five pattern types support multi-line content

**Known limitations**:
- Multi-line patterns must start at beginning of line for preview rendering
- Mid-line multi-line patterns only work for navigation, not preview
- TextMate syntax highlighting has limitations with very long multi-line patterns

## Testing strategy

- **Unit tests**: Specific examples and edge cases
- **Property-based tests**: Using fast-check with 100+ iterations per property
- **Manual tests**: Visual confirmation of syntax highlighting and preview rendering
- Test files use Bun's test runner
- All property tests are tagged with feature and property references

## Tooling conventions

- Use Bun for all scripts and dependency management: `bun install`, `bun run <script>`
- Use `bunx vsce package` to build the VSIX
- Prefer Bun's defaults (e.g., `.env` auto-loading) where applicable
- TypeScript compilation target: ES2019
- Test framework: Bun test with fast-check for property-based testing
