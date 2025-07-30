# Git Daily Commit Squasher

A Node.js tool to automatically squash daily git commits while preserving the original date of the first commit.

## Features

- 🔍 **Find today's commits**: Automatically identifies all commits made today
- 📅 **Preserve dates**: Maintains the original date of the first commit
- 🎯 **Multiple formats**: Choose from different commit message formats
- 👀 **Preview mode**: See what would be squashed before doing it
- 🎮 **Interactive mode**: Review and choose options interactively
- 🛡️ **Safe operations**: Uses soft reset to preserve your changes

## Installation

The tool is already included in your Foam workspace. No additional installation needed.

## Usage

### Basic Usage

```bash
# Squash today's commits with default settings
npm run squash

# Or directly with node
node tools/index.js
```

### Preview Mode

```bash
# See what would be squashed without actually doing it
npm run squash:preview

# Or with the flag
node tools/index.js --preview
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

## Command Line Options

| Option | Description | Example |
|--------|-------------|---------|
| `--help`, `-h` | Show help message | `node tools/index.js --help` |
| `--preview`, `-p` | Preview without squashing | `node tools/index.js --preview` |
| `--interactive`, `-i` | Interactive mode | `node tools/index.js --interactive` |
| `--format <type>` | Commit message format | `node tools/index.js --format detailed` |
| `--message <text>` | Custom commit message | `node tools/index.js --format custom --message "..."` |

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

1. **Find commits**: Uses `git log --since` to find all commits from today
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
📅 Preview: Would squash 3 commits from today:

1. a1b2c3d4 - Add new feature
2. e5f6g7h8 - Fix bug in login
3. i9j0k1l2 - Update documentation

📅 Preserved date would be: Mon Jan 27 10:30:00 2025 +0000
📝 Commit message would be: Daily commit squash - 3 commits
```

### Scenario 2: No commits today
```bash
$ npm run squash
No commits found for today.
```

### Scenario 3: Only one commit today
```bash
$ npm run squash
Only one commit today, no squashing needed.
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

## Troubleshooting

### "No commits found for today"
- Make sure you have commits with today's date
- Check your git log: `git log --oneline --since="$(date +%Y-%m-%d)"`

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