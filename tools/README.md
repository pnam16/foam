# Git Commit Squasher

A Node.js tool to automatically squash git commits while preserving the original date of the first commit. Can work with today's commits, all commits, or commits within a specific date range.

## Features

- 🔍 **Find commits**: Automatically identifies commits (today's, all, or date range)
- 📅 **Preserve dates**: Maintains the original date of the first commit
- 🎯 **Multiple formats**: Choose from different commit message formats
- 👀 **Preview mode**: See what would be squashed before doing it
- 🎮 **Interactive mode**: Review and choose options interactively
- 🛡️ **Safe operations**: Uses soft reset to preserve your changes
- 📊 **Flexible ranges**: Support for date ranges and commit limits

## Installation

The tool is already included in your Foam workspace. No additional installation needed.

## Usage

### Basic Usage

```bash
# Squash today's commits with default settings
npm run squash

# Squash all commits
npm run squash:all

# Or directly with node
node tools/index.js
node tools/index.js --all
```

### Preview Mode

```bash
# See what would be squashed without actually doing it
npm run squash:preview

# Preview all commits
npm run squash:preview:all

# Or with the flag
node tools/index.js --preview
node tools/index.js --preview --all
```

### Interactive Mode

```bash
# Interactive mode to review commits and choose options
npm run squash:interactive

# Or with the flag
node tools/index.js --interactive
```

### Different Message Formats

```bash
# Detailed format (includes all commit messages)
npm run squash:detailed

# Timestamp format (includes date)
npm run squash:timestamp

# Custom message
node tools/index.js --format custom --message "My custom squash message"
```

### Date Range and Limits

```bash
# Squash commits from a specific date range
node tools/index.js --since "2025-01-01" --until "2025-01-31"

# Limit number of commits to squash
node tools/index.js --limit 10

# Combine options
node tools/index.js --since "2025-01-01" --limit 5 --format detailed
```

## Command Line Options

| Option                | Description                           | Example                                               |
| --------------------- | ------------------------------------- | ----------------------------------------------------- |
| `--help`, `-h`        | Show help message                     | `node tools/index.js --help`                          |
| `--preview`, `-p`     | Preview without squashing             | `node tools/index.js --preview`                       |
| `--interactive`, `-i` | Interactive mode                      | `node tools/index.js --interactive`                   |
| `--format <type>`     | Commit message format                 | `node tools/index.js --format detailed`               |
| `--message <text>`    | Custom commit message                 | `node tools/index.js --format custom --message "..."` |
| `--all`               | Squash all commits (not just today's) | `node tools/index.js --all`                           |
| `--since <date>`      | Start date for commit range           | `node tools/index.js --since "2025-01-01"`            |
| `--until <date>`      | End date for commit range             | `node tools/index.js --until "2025-01-31"`            |
| `--limit <number>`    | Limit number of commits               | `node tools/index.js --limit 10`                      |

## Commit Message Formats

### Summary (default)
```
Daily commit squash - 3 commits
```

### Detailed
```
Daily commit squash - 3 commits:

- Add new feature
- Fix bug in login
- Update documentation
```

### Timestamp
```
Daily commit squash - 2025-01-27 (3 commits)
```

### Custom
```
Your custom message here
```

## How It Works

1. **Find commits**: Uses `git log` with optional filters to find commits (today's, all, or date range)
2. **Get details**: Retrieves the first commit's date and author information
3. **Soft reset**: Uses `git reset --soft` to preserve all changes
4. **Create commit**: Creates a new commit with the preserved date using environment variables
5. **Preserve date**: Sets `GIT_AUTHOR_DATE` and `GIT_COMMITTER_DATE` to the original date

## Safety Features

- **Preview mode**: Always preview before squashing
- **Soft reset**: Your changes are preserved even if something goes wrong
- **Error handling**: Graceful error handling with helpful messages
- **Validation**: Checks for edge cases (no commits, single commit, etc.)

## Examples

### Scenario 1: Multiple commits today
```bash
$ npm run squash:preview
📅 Preview: Would squash 3 commits:

1. a1b2c3d4 - Add new feature
2. e5f6g7h8 - Fix bug in login
3. i9j0k1l2 - Update documentation

📅 Preserved date would be: Mon Jan 27 10:30:00 2025 +0000
📝 Commit message would be: Daily commit squash - 3 commits
```

### Scenario 2: All commits
```bash
$ npm run squash:preview:all
📅 Preview: Would squash 15 commits:

1. a1b2c3d4 - Initial commit
2. e5f6g7h8 - Add README
3. i9j0k1l2 - Add features
...

📅 Preserved date would be: Mon Jan 20 09:15:00 2025 +0000
📝 Commit message would be: Daily commit squash - 15 commits
```

### Scenario 3: No commits today
```bash
$ npm run squash
No commits found.
```

### Scenario 4: Only one commit today
```bash
$ npm run squash
Only one commit found, no squashing needed.
```

## Integration with Git Hooks

You can integrate this tool with git hooks for automatic daily squashing:

### Pre-push hook example
```bash
#!/bin/bash
# .git/hooks/pre-push

# Only squash if there are multiple commits today
COMMIT_COUNT=$(git log --oneline --since="$(date +%Y-%m-%d) 00:00:00" --until="$(date +%Y-%m-%d) 23:59:59" | wc -l)

if [ "$COMMIT_COUNT" -gt 1 ]; then
    echo "Multiple commits today detected. Running daily squash..."
    node tools/index.js --format detailed
fi
```

### Weekly squash hook example
```bash
#!/bin/bash
# .git/hooks/pre-push

# Squash all commits from the last week
node tools/index.js --since "$(date -d '7 days ago' +%Y-%m-%d)" --until "$(date +%Y-%m-%d)" --format detailed
```

## Troubleshooting

### "No commits found"
- Make sure you have commits in the specified range
- Check your git log: `git log --oneline --since="$(date +%Y-%m-%d)"`
- For all commits: `git log --oneline`

### "Error during squash"
- Check your git status: `git status`
- Make sure you're in a git repository
- Ensure you have the necessary permissions

### "Could not get details of first commit"
- The commit hash might be invalid
- Try running `git log` to verify commit history

## Contributing

Feel free to enhance this tool by:
- Adding more commit message formats
- Improving error handling
- Adding support for different date ranges
- Creating a proper CLI interface with libraries like `commander` or `yargs`

## License

This tool is part of your Foam workspace and follows the same license.
