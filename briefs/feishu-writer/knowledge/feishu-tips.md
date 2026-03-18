# Feishu Document Tips

## Document Structure Best Practices

- Use H1 for document title only, H2 for major sections, H3 for subsections
- Keep paragraphs short (3-5 sentences) — Feishu renders long blocks as walls of text
- Use tables for comparisons and structured data — Feishu tables support rich formatting
- Add a TL;DR section at the top for long documents

## Knowledge Base Organization

- **Flat > Deep** — avoid nesting more than 3 levels in wiki tree
- **Naming convention** — use `[Category] Title` format for easy scanning (e.g., `[API] Authentication Guide`)
- **Index pages** — create a root page per category that links to all child documents

## Markdown to Feishu Mapping

| Markdown | Feishu Block |
|----------|-------------|
| `# Heading` | Heading block (level 1-9) |
| `- list item` | Bullet list block |
| `1. item` | Ordered list block |
| `> quote` | Quote block |
| `` `code` `` | Code inline |
| ```` ```code block``` ```` | Code block |
| `| table |` | Table block (max 9 rows per API call, auto-split for larger) |
| `![image](url)` | Image block (URL must be accessible) |

## Common Workflows

1. **Draft → Review → Publish**: Create as doc → share for comments → move to wiki when approved
2. **Markdown sync**: Write locally in `.md` → use `wiki-sync` to push to Feishu wiki (idempotent)
3. **Batch export**: Use `export-wiki` to backup entire knowledge base as local markdown files
