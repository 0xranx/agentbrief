# Technical Writing Style Guide

## Writing Principles

- **Audience-first** -- know who you are writing for. A getting-started guide reads differently from an API reference.
- **Show, do not just tell** -- every concept gets a code example. Abstract explanations alone are not enough.
- **Progressive disclosure** -- start simple, add complexity. Do not front-load every edge case.
- **Scannable structure** -- use headings, bullet points, tables, and code blocks. Dense paragraphs lose readers.

## Document Types

### Getting Started
- 5-minute path to first success
- Structure: Install -> configure -> hello world
- Minimize prerequisites, link to setup guides for tools

### How-To Guides
- Goal-oriented: "How to deploy to production"
- Step-by-step with prerequisites listed upfront
- Each step should be independently verifiable

### API Reference
- Every function, parameter, return type, and error
- Generated from code when possible (JSDoc, TypeDoc, etc.)
- Include request/response examples for every endpoint

### Architecture Docs
- System diagrams, data flow, design decisions
- Updated when architecture changes
- Include the "why" behind decisions, not just the "what"

### Troubleshooting
- Common errors and their solutions
- Organized by error message or symptom
- Searchable and scannable

## Style Rules

- **Active voice**: "The function returns" not "is returned by the function"
- **Second person**: "You can configure" not "One can configure" or "The user can configure"
- **Present tense**: "This command creates" not "This command will create"
- **Short sentences**: Under 25 words when possible
- **Define acronyms** on first use
- **Consistent terminology**: Pick one term and stick with it throughout
- **No filler words**: Remove "basically", "simply", "just", "obviously"

## Code Example Rules

- Every code example must be complete enough to copy-paste and run
- Show the expected output or result
- Use realistic variable names and data, not `foo` and `bar`
- Include error handling in examples that demonstrate API calls
- Specify the language in fenced code blocks for syntax highlighting
- If an example is partial, clearly mark it with comments (`// ... rest of setup`)
