export interface TextTransformation {
  newText: string;
  cursorOffset?: number; // Optional cursor position relative to start
}

/**
 * Wraps selected text with prefix and suffix delimiters
 * @param text - The text to wrap
 * @param prefix - The prefix delimiter
 * @param suffix - The suffix delimiter
 * @param cursorOffset - Optional cursor position relative to start of newText
 * @returns TextTransformation with wrapped text and optional cursor offset
 */
export function wrapSelection(
  text: string,
  prefix: string,
  suffix: string,
  cursorOffset?: number
): TextTransformation {
  const newText = prefix + text + suffix;
  return {
    newText,
    cursorOffset
  };
}

/**
 * Prepends a prefix to each line in the text
 * @param text - The text to process
 * @param linePrefix - The prefix to add to each line
 * @param skipIfPresent - If true, skip lines that already start with the prefix
 * @returns TextTransformation with prefixed lines
 */
export function wrapLines(
  text: string,
  linePrefix: string,
  skipIfPresent?: boolean
): TextTransformation {
  const lines = text.split('\n');
  const processedLines = lines.map(line => {
    // Skip empty lines
    if (line.trim() === '') {
      return line;
    }
    
    // Skip if line already has the prefix and skipIfPresent is true
    if (skipIfPresent && line.trimStart().startsWith(linePrefix.trim())) {
      return line;
    }
    
    return linePrefix + line;
  });
  
  return {
    newText: processedLines.join('\n')
  };
}

/**
 * Prepends sequential numbers to each line
 * @param text - The text to process
 * @returns TextTransformation with numbered lines
 */
export function wrapLinesNumbered(text: string): TextTransformation {
  const lines = text.split('\n');
  let counter = 1;
  
  const processedLines = lines.map(line => {
    // Skip empty lines
    if (line.trim() === '') {
      return line;
    }
    
    return `${counter++}. ${line}`;
  });
  
  return {
    newText: processedLines.join('\n')
  };
}

/**
 * Formats text as a heading with the specified level
 * @param text - The text to format
 * @param level - The heading level (1-6)
 * @returns TextTransformation with heading prefix
 */
export function formatHeading(text: string, level: number): TextTransformation {
  const prefix = '#'.repeat(level) + ' ';
  return {
    newText: prefix + text
  };
}


/**
 * Wraps text with highlight and appends a comment placeholder
 * @param text - The text to highlight
 * @returns TextTransformation with highlight and comment, cursor positioned in comment
 */
export function highlightAndComment(text: string): TextTransformation {
  const highlighted = `{==${text}==}`;
  const withComment = highlighted + '{>><<}';
  const cursorOffset = highlighted.length + 3; // Position between >> and <<
  
  return {
    newText: withComment,
    cursorOffset
  };
}


/**
 * Wraps text in a code block with triple backticks
 * @param text - The text to wrap
 * @returns TextTransformation with code block formatting
 */
export function wrapCodeBlock(text: string): TextTransformation {
  const newText = '```\n' + text + '\n```';
  return { newText };
}

/**
 * Wraps text with both bold and italic formatting
 * @param text - The text to format
 * @returns TextTransformation with bold italic formatting
 */
export function formatBoldItalic(text: string): TextTransformation {
  return wrapSelection(text, '***', '***');
}

/**
 * Wraps text with substitution markup and appends a comment placeholder
 * @param text - The text to substitute
 * @returns TextTransformation with substitution and comment, cursor positioned in comment
 */
export function substituteAndComment(text: string): TextTransformation {
  const substitution = `{~~${text}~>~~}`;
  const withComment = substitution + '{>><<}';
  const cursorOffset = substitution.length + 3; // Position between >> and <<
  
  return {
    newText: withComment,
    cursorOffset
  };
}

/**
 * Wraps text with addition markup and appends a comment placeholder
 * @param text - The text to mark as addition
 * @returns TextTransformation with addition and comment, cursor positioned in comment
 */
export function additionAndComment(text: string): TextTransformation {
  const addition = `{++${text}++}`;
  const withComment = addition + '{>><<}';
  const cursorOffset = addition.length + 3; // Position between >> and <<
  
  return {
    newText: withComment,
    cursorOffset
  };
}

/**
 * Wraps text with deletion markup and appends a comment placeholder
 * @param text - The text to mark as deletion
 * @returns TextTransformation with deletion and comment, cursor positioned in comment
 */
export function deletionAndComment(text: string): TextTransformation {
  const deletion = `{--${text}--}`;
  const withComment = deletion + '{>><<}';
  const cursorOffset = deletion.length + 3; // Position between >> and <<
  
  return {
    newText: withComment,
    cursorOffset
  };
}
