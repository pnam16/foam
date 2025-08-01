# Foam Knowledge Vault

> A comprehensive personal knowledge management system built with Foam, featuring intelligent git commit management and structured note organization.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Foam](https://img.shields.io/badge/Foam-0.20+-purple.svg)](https://foambubble.github.io/foam/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/yourusername/foam/graphs/commit-activity)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Guide](#usage-guide)
- [Development Tools](#development-tools)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## 🎯 Overview

The Foam Knowledge Vault is a sophisticated personal knowledge management system designed to transform scattered thoughts into organized, interconnected knowledge. Built on the powerful [Foam](https://foambubble.github.io/foam/) framework, this vault provides an intuitive interface for creating, linking, and managing knowledge across multiple domains.

Perfect for developers, researchers, and knowledge workers, this system combines the power of interconnected notes with advanced development tools for git commit management, making it ideal for maintaining clean project histories while documenting your learning journey.

### 🎯 Target Audience

- **Developers** seeking to document code concepts and project progress
- **Researchers** organizing findings and connecting related concepts
- **Knowledge Workers** building a second brain for better productivity
- **Students** creating interconnected study notes and learning resources
- **Project Managers** tracking progress and maintaining documentation

### 🚀 Key Benefits

- **🧠 Second Brain**: Transform scattered thoughts into organized knowledge
- **🔗 Connected Thinking**: Discover relationships between concepts through backlinks
- **📈 Project Tracking**: Monitor progress across multiple projects and domains
- **🛠️ Developer-Friendly**: Built-in tools for git history management
- **📱 Cross-Platform**: Works seamlessly across different devices and platforms
- **🔍 Powerful Search**: Find information quickly with intelligent search capabilities
- **📊 Visual Insights**: Graph view reveals hidden connections in your knowledge

## ✨ Features

### 📚 Core Knowledge Management
- **📝 Daily Notes**: Capture daily thoughts, tasks, and reflections with automated templates
- **🔗 Backlink System**: Automatic discovery of connections between related concepts
- **📊 Graph View**: Visual representation of knowledge connections and relationships
- **🏷️ Tagging System**: Organize content with flexible categorization
- **📋 Templates**: Consistent note structure across different types of content
- **🔍 Full-Text Search**: Powerful search across all notes and content
- **📱 Mobile-Friendly**: Responsive design for access on any device

### 🎯 Project Management
- **🎯 Active Project Tracking**: Monitor ongoing projects with detailed progress notes
- **📋 Ticket Management**: Track issues and feature requests within the vault
- **🚀 Release Management**: Document release cycles and version history
- **📈 Milestone Tracking**: Set and monitor project milestones
- **📊 Progress Visualization**: Visual progress tracking and reporting

### 🛠️ Development Tools
- **🔧 Git Commit Squashing**: Intelligent commit history management
- **👀 Preview Mode**: Review changes before applying operations
- **📅 Daily Organization**: Group commits by date for cleaner history
- **🛡️ Safety Features**: Built-in safeguards to prevent data loss
- **🔄 Automated Workflows**: Streamlined development processes
- **📝 Commit Message Templates**: Consistent commit message formatting

### 📖 Content Organization
- **📚 Programming Knowledge**: Technical documentation and code concepts
- **📈 Trading Analysis**: Market strategies and technical analysis
- **🏢 Business Projects**: Professional project documentation
- **📖 Learning Resources**: Educational content and study notes
- **🎨 Creative Projects**: Design and creative process documentation

## 🛠️ Tech Stack

### 🏗️ Core Technologies
- **[Foam](https://foambubble.github.io/foam/)**: Knowledge management framework built on VS Code
- **[Markdown](https://www.markdownguide.org/)**: Universal markup language for content creation
- **[Node.js](https://nodejs.org/)**: JavaScript runtime for development tools
- **[Git](https://git-scm.com/)**: Version control and history management

### 🔧 Development Tools
- **VS Code Extensions**:
  - [Foam for VS Code](https://marketplace.visualstudio.com/items?itemName=foam.foam-vscode)
  - [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)
  - [Markdown Preview Enhanced](https://marketplace.visualstudio.com/items?itemName=shd101wyy.markdown-preview-enhanced)
- **Build Tools**:
  - [Prettier](https://prettier.io/) (code formatting)
  - Custom CSS styling
- **Publishing**:
  - [Jekyll](https://jekyllrb.com/) layouts for web publishing

### 📦 Dependencies
```json
{
  "prettier": "^3.6.2",
  "type": "module"
}
```

## 🚀 Installation

### 📋 Prerequisites

Before installing the Foam Knowledge Vault, ensure you have the following installed:

- **[Node.js](https://nodejs.org/)** (version 18 or higher)
- **[Git](https://git-scm.com/)** (for version control)
- **[VS Code](https://code.visualstudio.com/)** (recommended editor)

### 📥 Step-by-Step Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd foam
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Install VS Code Extensions**
   ```bash
   code --install-extension foam.foam-vscode
   code --install-extension yzhang.markdown-all-in-one
   code --install-extension shd101wyy.markdown-preview-enhanced
   ```

4. **Configure Foam**
   - Open the project in VS Code
   - Foam will automatically detect the workspace
   - Customize settings in `.vscode/settings.json` if needed

5. **Verify Installation**
   ```bash
   # Test the git squashing tool
   npm run squash:preview:all
   ```

### 🔧 Post-Installation Setup

1. **Configure Git** (if not already done)
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

2. **Customize Templates**
   - Edit `templates/daily-note.md` to match your workflow
   - Create additional templates for specific use cases

3. **Set Up Publishing** (optional)
   - Configure Jekyll for web publishing
   - Set up GitHub Pages or other hosting service

## 🎯 Quick Start

### 1. 🗺️ Explore the Vault
- Open the **Graph View** to see connections between notes
- Navigate through the folder structure to understand organization
- Check the latest daily note for recent updates

### 2. 📝 Create Your First Note
```bash
# Use Foam's command palette
Cmd/Ctrl + Shift + P → "Foam: Create New Note"
```

### 3. 🔗 Link Related Content
- Use `[[wiki-links]]` to create connections between notes
- Add tags with `#tag` for categorization
- Create backlinks automatically by mentioning other notes

### 4. 🛠️ Use Development Tools
```bash
# Preview your git history
npm run squash:preview:daily

# Squash commits for cleaner history
npm run squash:daily
```

### 5. 📊 View Your Knowledge Graph
- Open the Graph View to visualize connections
- Discover hidden relationships between concepts
- Identify knowledge gaps and opportunities

## 📖 Usage Guide

### 📅 Daily Note Workflow

1. **Create Daily Notes**
   - Use the daily note template for consistency
   - Capture thoughts, tasks, and project updates
   - Link to relevant permanent notes

2. **Organize Content**
   - Move important concepts to permanent notes
   - Use tags for easy discovery
   - Create templates for recurring content types

3. **Maintain Connections**
   - Regularly review and update backlinks
   - Use the graph view to discover new connections
   - Keep the knowledge base interconnected

### 🎯 Project Management

1. **Track Active Projects**
   - Create project-specific folders
   - Document progress and milestones
   - Link to related daily notes

2. **Manage Releases**
   - Document release preparation steps
   - Track version history
   - Maintain release notes

3. **Handle Tickets**
   - Create detailed ticket documentation
   - Link tickets to related code and decisions
   - Track resolution progress

### 🔧 Git History Management

The vault includes sophisticated tools for managing git commit history:

```bash
# Daily commit organization
npm run squash:daily          # Squash commits by day
npm run squash:preview:daily  # Preview daily squashing

# All commits management
npm run squash:all           # Squash all commits
npm run squash:preview:all   # Preview all commits
```

### 📚 Knowledge Organization Best Practices

1. **Use Consistent Naming**
   - Follow a clear naming convention for files
   - Use descriptive titles that explain the content
   - Include dates in filenames when relevant

2. **Create Meaningful Links**
   - Link related concepts together
   - Use descriptive link text
   - Regularly review and update broken links

3. **Tag Strategically**
   - Use tags for broad categorization
   - Create tag hierarchies for complex topics
   - Keep tag usage consistent across notes

## 🛠️ Development Tools

### 🔧 Git Commit Squashing

The vault includes a custom Node.js tool for intelligent git commit management.

#### 📋 Available Commands

| Command | Description | Use Case |
|---------|-------------|----------|
| `squash:daily` | Squash commits by day | Clean up daily development work |
| `squash:preview:daily` | Preview daily squashing | Review before applying |
| `squash:all` | Squash all commits | Prepare for major releases |
| `squash:preview:all` | Preview all squashing | Review complete history |

#### 🛡️ Safety Features

- **Preview Mode**: Review all changes before applying
- **Date Preservation**: Maintains original commit timestamps
- **Soft Reset**: Prevents data loss during operations
- **Error Handling**: Comprehensive error messages and recovery instructions
- **Backup Creation**: Automatic backup before major operations

#### 📝 Best Practices

1. **Always preview first**: Use preview commands before applying changes
2. **Backup before major operations**: Create a backup branch before squashing all commits
3. **Use daily squashing regularly**: Keep history clean with regular maintenance
4. **Document significant changes**: Add notes about major squashing operations
5. **Test in development**: Always test tools in a development environment first

### 🔍 Search and Navigation

- **Full-text search** across all notes
- **Tag-based filtering** for quick content discovery
- **Backlink navigation** to explore related content
- **Graph view** for visual relationship discovery

## 📁 Project Structure

```
foam/
├── 📅 daily/                    # Daily notes and journals
│   └── 2025-07-30.md          # Latest daily note
├── 📚 notes/                   # Permanent knowledge notes
│   ├── 💻 programming/         # Code concepts and documentation
│   │   └── javascript-closures.md
│   └── 📈 trading/            # Market analysis and strategies
│       └── wyckoff-schematic.md
├── 🚀 projects/               # Project-specific notes
│   ├── 🏢 TCI/               # TCI HR system project
│   │   └── hr/
│   │       ├── 📋 prepare/    # Release preparation
│   │       ├── 📝 release-note/ # Release documentation
│   │       └── 🎫 tickets/    # Issue tracking
│   └── 📦 foam-vault-setup.md # Setup project documentation
├── 📋 templates/              # Note templates
│   └── daily-note.md         # Daily note template
├── 🛠️ tools/                 # Development tools and scripts
│   └── index.js             # Git commit squashing tool
├── 🎨 _layouts/             # Jekyll layout templates
├── 💅 assets/               # CSS and styling
│   └── css/
│       └── style.scss
└── 📎 attachments/          # Images and files
    └── foam-icon.png
```

## ⚙️ Configuration

### 🔧 VS Code Settings

Create or update `.vscode/settings.json`:

```json
{
  "foam.openDailyNote.directory": "daily",
  "foam.openDailyNote.filenameFormat": "YYYY-MM-DD",
  "foam.openDailyNote.fileExtension": "md",
  "foam.openDailyNote.template": "templates/daily-note.md",
  "foam.graph.style": "default",
  "foam.graph.distance": 100,
  "foam.graph.repulsion": 4000,
  "foam.graph.linkLength": 30
}
```

### 📝 Template Customization

Customize the daily note template in `templates/daily-note.md`:

```markdown
# {{date:YYYY-MM-DD}}

## 📝 Today's Notes

## ✅ Tasks

## 🔗 Links

## 📚 Resources
```

### 🎨 Styling Customization

Modify `assets/css/style.scss` to customize the appearance:

```scss
// Custom styling for your knowledge vault
.knowledge-vault {
  // Add your custom styles here
}
```

## 🤝 Contributing

We welcome contributions to improve this knowledge vault! Here's how you can help:

### 📋 How to Contribute

1. **Fork the Repository**
   ```bash
   git clone <your-fork-url>
   cd foam
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Add new notes or improve existing ones
   - Enhance the development tools
   - Update documentation

4. **Test Your Changes**
   ```bash
   # Test the development tools
   npm run squash:preview:all
   npm run squash:preview:daily
   ```

5. **Submit a Pull Request**
   - Provide a clear description of your changes
   - Include any relevant documentation updates
   - Ensure all tests pass

### 📝 Contribution Guidelines

- **Code Style**: Follow the existing code formatting (Prettier)
- **Documentation**: Update README and relevant documentation
- **Testing**: Test all development tools before submitting
- **Commit Messages**: Use clear, descriptive commit messages
- **Branch Naming**: Use descriptive branch names (e.g., `feature/git-squashing-enhancement`)

### 🎯 Areas for Contribution

- **Content**: Add new knowledge areas or improve existing notes
- **Tools**: Enhance the git squashing functionality
- **Templates**: Create new note templates for different use cases
- **Documentation**: Improve guides and tutorials
- **Styling**: Enhance the visual presentation
- **Testing**: Add comprehensive test coverage
- **Performance**: Optimize search and navigation features

### 🐛 Reporting Issues

When reporting issues, please include:

- **Description**: Clear description of the problem
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**: Your operating system, Node.js version, etc.
- **Screenshots**: Visual evidence if applicable

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

The ISC License is a permissive license that allows for:
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ✅ Patent use

**Note**: This license is compatible with the MIT License and is one of the most permissive open-source licenses available.

## 🆘 Support

### 📚 Documentation

- **[Foam Documentation](https://foambubble.github.io/foam/)**: Official Foam documentation
- **[Markdown Guide](https://www.markdownguide.org/)**: Markdown syntax reference
- **[Git Documentation](https://git-scm.com/doc)**: Git reference and tutorials

### 🔗 Community Resources

- **[Foam Community](https://foambubble.github.io/foam/community)**: Connect with other Foam users
- **[GitHub Discussions](https://github.com/foambubble/foam/discussions)**: Community discussions
- **[Stack Overflow](https://stackoverflow.com/questions/tagged/foam)**: Q&A platform

### 📧 Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/foam/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/foam/discussions)
- **Email**: your.email@example.com

## 🔗 Quick Links

- **📅 Latest Daily Note**: [[2025-08-01]]
- **🚀 Active Project**: [[projects/TCI/hr/tickets/36914|TCI HR #36914]]
- **💻 Programming**: [[notes/programming/javascript-closures|JavaScript Closures]]
- **📈 Trading**: [[notes/trading/wyckoff-schematic|Wyckoff Method]]

## 🏷️ Tags & Categories

- `#programming` - Code and technical concepts
- `#trading` - Market analysis and strategies
- `#TCI` - TCI project related notes
- `#HR` - Human resources system development
- `#daily` - Daily notes and reflections
- `#knowledge-management` - Knowledge organization and structure
- `#development` - Development tools and processes
- `#documentation` - Documentation and guides

---

<div align="center">

**Built with ❤️ using [Foam](https://foambubble.github.io/foam/)**

*Last updated: {{date:YYYY-MM-DD}}*

[![GitHub stars](https://img.shields.io/github/stars/yourusername/foam?style=social)](https://github.com/yourusername/foam/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/foam?style=social)](https://github.com/yourusername/foam/network/members)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/foam)](https://github.com/yourusername/foam/issues)

</div>

[//begin]: # "Autogenerated link references for markdown compatibility"
[daily/2025-07-30]: daily/2025-07-30.md "2025-07-30"
[projects/TCI/hr/tickets/36914|TCI HR #36914]: projects/TCI/hr/tickets/36914.md "36914"
[notes/programming/javascript-closures|JavaScript Closures]: notes/programming/javascript-closures.md "JavaScript Closures"
[notes/trading/wyckoff-schematic|Wyckoff Method]: notes/trading/wyckoff-schematic.md "Wyckoff Schematic"
[//end]: # "Autogenerated link references"
