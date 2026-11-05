// Presentation grammar for the Bend syntax used in the notes.
// Highlighting is independent of the compiler and does not validate programs.
module.exports = {
  comment: /#.*/,
  string: {
    pattern: /"(?:\\.|[^"\\])*"/,
    greedy: true,
  },
  definition: {
    pattern: /(\b(?:def|law)\s+)[a-zA-Z_]\w*/,
    lookbehind: true,
    alias: "function",
  },
  keyword: /\b(?:def|law|type|is|match|case|for|let|return|import|with|do|if|else)\b/,
  constructor: {
    pattern: /\b[A-Z][a-zA-Z0-9_]*(?=\s*\{)/,
    alias: "class-name",
  },
  type: {
    pattern: /\b[A-Z][a-zA-Z0-9_]*\b/,
    alias: "builtin",
  },
  function: /\b[a-z_]\w*(?=\s*\()/,
  number: /\b(?:0x[\da-fA-F]+|\d+(?:\.\d+)?)\b/,
  operator: /==|!=|->|=>|<=|>=|[+*/%=<>!&|^-]/,
  punctuation: /[{}[\]();:,.]/,
}
