# My Foam Knowledge Vault

Welcome to my personal knowledge management system built with Foam! This vault serves as my digital brain for organizing thoughts, projects, and learning across multiple domains.

## 🗂️ Quick Navigation

### 📅 Daily Notes
- [[daily/2025-07-30|Latest Daily Note (2025-07-30)]]
- [[templates/daily-note|Daily Note Template]]

### 💻 Programming Knowledge
- [[notes/programming/javascript-closures|JavaScript Closures]] - Understanding lexical scoping and function factories

### 📈 Trading & Technical Analysis
- [[notes/trading/wyckoff-schematic|Wyckoff Schematic]] - Market accumulation and distribution phases

### 🚀 Active Projects

#### TCI HR System
- **Current Version**: 0.2.1
- **Latest Tickets**:
  - [[projects/TCI/hr/tickets/36914|#36914]] - Profile closure functionality
  - [[projects/TCI/hr/tickets/36835|#36835]] - Employee relationship updates
- **Release Management**:
  - [[projects/TCI/hr/prepare/0.2.1|Release Preparation]]
  - [[projects/TCI/hr/release-note/0.2.1|Release Notes]]

#### Foam Vault Setup
- [[projects/foam-vault-setup|Setup Project]] - Ongoing vault organization and configuration

## 🎯 Getting Started
1. **Explore the Graph View** to discover connections between notes
2. **Create new notes** using the `Foam: Create New Note` command
3. **Use backlinks** to connect related concepts and ideas
4. **Check daily notes** for recent thoughts, tasks, and project updates

## 📖 How to Use This Vault

### Daily Notes
- Capture daily thoughts, tasks, and reflections
- Track project progress and milestones
- Use the [[templates/daily-note|daily note template]] for consistency

### Permanent Notes
- Store concepts, ideas, and knowledge for long-term reference
- Programming concepts and technical documentation
- Trading strategies and market analysis

### Project Notes
- Track ongoing projects and their progress
- Manage release cycles and ticket tracking
- Document technical decisions and implementations

### Templates
- Use templates for consistent note structure
- Standardize daily notes and project documentation

## 🔧 Technical Setup
This vault is configured with:
- **Foam for VS Code** - Core knowledge management
- **Markdown All in One** - Enhanced markdown support
- **Markdown Preview Enhanced** - Rich preview capabilities
- **Custom CSS styling** for better readability
- **Jekyll layouts** for web publishing

## 🛠️ Development Tools

### Git Commit Squashing
This vault includes a custom tool for managing git commit history by squashing multiple commits into organized, meaningful commits.

#### Available Scripts
```bash
# Squash all commits at once
npm run squash:all

# Preview what would be squashed (all commits)
npm run squash:preview:all

# Squash commits for each day separately
npm run squash:daily

# Preview daily squash operation
npm run squash:preview:daily
```

#### How It Works
- **Daily Squashing**: Groups commits by date and creates one squash commit per day, preserving the original commit date
- **All Commits Squashing**: Combines all commits into a single commit
- **Preview Mode**: Shows what would be squashed without actually performing the operation
- **Smart Processing**: Automatically skips days with only one commit (no squashing needed)

#### Use Cases
- **Clean up frequent small commits** into meaningful daily summaries
- **Maintain clean git history** while preserving chronological information
- **Prepare for releases** by consolidating development commits
- **Review changes** before squashing with preview mode

#### Safety Features
- **Preview mode** to review changes before applying
- **Preserves original commit dates** to maintain timeline accuracy
- **Soft reset approach** to avoid losing work
- **Error handling** with helpful recovery instructions

## 📁 Folder Structure
```
foam/
├── daily/                  # Daily notes and journals
├── notes/                  # Permanent knowledge notes
│   ├── programming/        # Code concepts and documentation
│   └── trading/           # Market analysis and strategies
├── projects/              # Project-specific notes
│   └── TCI/              # TCI HR system project
│       └── hr/
│           ├── prepare/   # Release preparation
│           ├── release-note/ # Release documentation
│           └── tickets/   # Issue tracking
├── templates/             # Note templates
├── tools/                 # Development tools and scripts
│   └── index.js          # Git commit squashing tool
├── _layouts/             # Jekyll layout templates
├── assets/               # CSS and styling
└── attachments/          # Images and files
```

## 🔗 Quick Links
- **Latest Daily**: [[daily/2025-07-30]]
- **Active Project**: [[projects/TCI/hr/tickets/36914|TCI HR #36914]]
- **Programming**: [[notes/programming/javascript-closures|JS Closures]]
- **Trading**: [[notes/trading/wyckoff-schematic|Wyckoff Method]]

## 🏷️ Tags & Categories
- `#programming` - Code and technical concepts
- `#trading` - Market analysis and strategies
- `#TCI` - TCI project related notes
- `#HR` - Human resources system development
- `#daily` - Daily notes and reflections

---
*Last updated: {{date:YYYY-MM-DD}}*

[//begin]: # "Autogenerated link references for markdown compatibility"
[daily/2025-07-30|Latest Daily Note (2025-07-30)]: daily/2025-07-30.md "2025-07-30"
[templates/daily-note|Daily Note Template]: templates/daily-note.md "{{date:YYYY-MM-DD}} - Daily Note"
[notes/programming/javascript-closures|JavaScript Closures]: notes/programming/javascript-closures.md "JavaScript Closures"
[notes/trading/wyckoff-schematic|Wyckoff Schematic]: notes/trading/wyckoff-schematic.md "Wyckoff Schematic"
[projects/TCI/hr/tickets/36914|#36914]: projects/TCI/hr/tickets/36914.md "36914"
[projects/TCI/hr/tickets/36835|#36835]: projects/TCI/hr/tickets/36835.md "36835"
[projects/TCI/hr/prepare/0.2.1|Release Preparation]: projects/TCI/hr/prepare/0.2.1.md "Prepare for release"
[projects/TCI/hr/release-note/0.2.1|Release Notes]: projects/TCI/hr/release-note/0.2.1.md "./release-notes"
[projects/foam-vault-setup|Setup Project]: projects/foam-vault-setup.md "Foam Vault Setup Project"
[templates/daily-note|daily note template]: templates/daily-note.md "{{date:YYYY-MM-DD}} - Daily Note"
[daily/2025-07-30]: daily/2025-07-30.md "2025-07-30"
[projects/TCI/hr/tickets/36914|TCI HR #36914]: projects/TCI/hr/tickets/36914.md "36914"
[notes/programming/javascript-closures|JS Closures]: notes/programming/javascript-closures.md "JavaScript Closures"
[notes/trading/wyckoff-schematic|Wyckoff Method]: notes/trading/wyckoff-schematic.md "Wyckoff Schematic"
[//end]: # "Autogenerated link references"
