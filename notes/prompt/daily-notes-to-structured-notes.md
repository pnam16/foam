# Daily Notes to Structured Notes Converter

## Purpose

Extract and organize content from daily notes into structured, searchable note files for better knowledge management.

## Process

1. **Extract Content**: Parse daily note files for key topics and concepts
2. **Create Structured Notes**: Generate individual note files based on content themes
3. **Merge Similar Topics**: Consolidate overlapping subjects into unified notes
4. **Maintain Links**: Preserve cross-references between related notes

## Requirements

- **Content Organization**: Group related concepts by subject matter
- **File Structure**: Create notes in appropriate subdirectories (programming/, personal/, career/, etc.)
- **Cross-linking**: Use `[[]]` syntax for internal note references
- **Metadata**: Include source daily notes and related topics
- **Consolidation**: Merge duplicate or overlapping content when appropriate

## Output Format

- Clear headings and subheadings
- Code examples where relevant
- Related topic links
- Source attribution to daily notes
- Consistent markdown formatting

## Example Mapping

- Daily note → Multiple topic-specific notes
- JavaScript concepts → `notes/programming/javascript-*.md`
- React topics → `notes/programming/react-*.md`
- Personal topics → `notes/personal/*.md`
- Career topics → `notes/career/*.md`
