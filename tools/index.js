#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class GitCommitSquasher {
  constructor() {
    this.repoPath = process.cwd();
  }

  /**
   * Get all commits from today
   */
  getTodayCommits() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const command = `git log --oneline --since="${today} 00:00:00" --until="${today} 23:59:59" --format="%H %s"`;
      const output = execSync(command, { cwd: this.repoPath, encoding: 'utf8' });
      
      if (!output.trim()) {
        console.log('No commits found for today.');
        return [];
      }

      return output.trim().split('\n').map(line => {
        const [hash, ...messageParts] = line.split(' ');
        return {
          hash: hash,
          message: messageParts.join(' ')
        };
      });
    } catch (error) {
      console.error('Error getting today\'s commits:', error.message);
      return [];
    }
  }

  /**
   * Get commit details including date
   */
  getCommitDetails(hash) {
    try {
      const command = `git show --format="%H%n%an%n%ae%n%ad%n%s%n%b" --no-patch ${hash}`;
      const output = execSync(command, { cwd: this.repoPath, encoding: 'utf8' });
      const lines = output.trim().split('\n');
      
      return {
        hash: lines[0],
        author: lines[1],
        email: lines[2],
        date: lines[3],
        subject: lines[4],
        body: lines.slice(5).join('\n')
      };
    } catch (error) {
      console.error(`Error getting commit details for ${hash}:`, error.message);
      return null;
    }
  }

  /**
   * Create a squash commit with preserved date
   */
  createSquashCommit(commits, options = {}) {
    if (commits.length === 0) {
      console.log('No commits to squash.');
      return;
    }

    if (commits.length === 1) {
      console.log('Only one commit today, no squashing needed.');
      return;
    }

    const firstCommit = this.getCommitDetails(commits[0].hash);
    if (!firstCommit) {
      console.error('Could not get details of first commit.');
      return;
    }

    // Create commit message
    const commitMessage = this.generateCommitMessage(commits, options);
    
    // Reset to the commit before today's commits
    const resetTarget = this.getResetTarget(commits);
    
    try {
      // Soft reset to preserve changes
      execSync(`git reset --soft ${resetTarget}`, { cwd: this.repoPath });
      
      // Create new commit with preserved date
      const env = {
        ...process.env,
        GIT_AUTHOR_DATE: firstCommit.date,
        GIT_COMMITTER_DATE: firstCommit.date
      };

      execSync(`git commit -m "${commitMessage}"`, { 
        cwd: this.repoPath, 
        env,
        stdio: 'inherit'
      });

      console.log(`✅ Successfully squashed ${commits.length} commits into one with preserved date: ${firstCommit.date}`);
      console.log(`📝 Commit message: ${commitMessage}`);
      
    } catch (error) {
      console.error('Error during squash:', error.message);
      console.log('You may need to manually resolve conflicts or check your git status.');
    }
  }

  /**
   * Get the commit hash to reset to (before today's commits)
   */
  getResetTarget(commits) {
    try {
      const lastCommitHash = commits[commits.length - 1].hash;
      const command = `git rev-parse ${lastCommitHash}^`;
      return execSync(command, { cwd: this.repoPath, encoding: 'utf8' }).trim();
    } catch (error) {
      console.error('Error getting reset target:', error.message);
      return 'HEAD~' + commits.length;
    }
  }

  /**
   * Generate commit message based on squashed commits
   */
  generateCommitMessage(commits, options = {}) {
    const { format = 'summary' } = options;
    
    switch (format) {
      case 'summary':
        return `Daily commit squash - ${commits.length} commits`;
      
      case 'detailed':
        const messages = commits.map(c => `- ${c.message}`).join('\n');
        return `Daily commit squash - ${commits.length} commits:\n\n${messages}`;
      
      case 'timestamp':
        const today = new Date().toISOString().split('T')[0];
        return `Daily commit squash - ${today} (${commits.length} commits)`;
      
      case 'custom':
        return options.customMessage || `Daily commit squash - ${commits.length} commits`;
      
      default:
        return `Daily commit squash - ${commits.length} commits`;
    }
  }

  /**
   * Interactive mode for reviewing commits before squashing
   */
  async interactiveSquash() {
    const commits = this.getTodayCommits();
    
    if (commits.length === 0) {
      console.log('No commits found for today.');
      return;
    }

    console.log(`\n📅 Found ${commits.length} commits from today:\n`);
    commits.forEach((commit, index) => {
      console.log(`${index + 1}. ${commit.hash.substring(0, 8)} - ${commit.message}`);
    });

    console.log('\nOptions:');
    console.log('1. Squash all commits');
    console.log('2. Squash with detailed message');
    console.log('3. Squash with timestamp');
    console.log('4. Custom message');
    console.log('5. Cancel');

    // For simplicity, we'll use a basic prompt
    // In a real implementation, you might want to use a proper CLI library
    console.log('\nEnter your choice (1-5):');
    
    // This is a simplified version - in practice you'd use readline or a CLI library
    return new Promise((resolve) => {
      process.stdin.once('data', (data) => {
        const choice = data.toString().trim();
        resolve({ choice, commits });
      });
    });
  }

  /**
   * Main execution method
   */
  async run(options = {}) {
    const { interactive = false, format = 'summary', customMessage = '' } = options;

    if (interactive) {
      const result = await this.interactiveSquash();
      if (!result) return;
      
      const { choice, commits } = result;
      
      switch (choice) {
        case '1':
          this.createSquashCommit(commits, { format: 'summary' });
          break;
        case '2':
          this.createSquashCommit(commits, { format: 'detailed' });
          break;
        case '3':
          this.createSquashCommit(commits, { format: 'timestamp' });
          break;
        case '4':
          console.log('Enter custom message:');
          process.stdin.once('data', (data) => {
            const message = data.toString().trim();
            this.createSquashCommit(commits, { format: 'custom', customMessage: message });
          });
          break;
        case '5':
          console.log('Operation cancelled.');
          break;
        default:
          console.log('Invalid choice.');
      }
    } else {
      const commits = this.getTodayCommits();
      this.createSquashCommit(commits, { format, customMessage });
    }
  }

  /**
   * Preview what would be squashed without actually doing it
   */
  preview() {
    const commits = this.getTodayCommits();
    
    if (commits.length === 0) {
      console.log('No commits found for today.');
      return;
    }

    console.log(`\n📅 Preview: Would squash ${commits.length} commits from today:\n`);
    commits.forEach((commit, index) => {
      console.log(`${index + 1}. ${commit.hash.substring(0, 8)} - ${commit.message}`);
    });

    const firstCommit = this.getCommitDetails(commits[0].hash);
    if (firstCommit) {
      console.log(`\n📅 Preserved date would be: ${firstCommit.date}`);
    }

    const message = this.generateCommitMessage(commits);
    console.log(`📝 Commit message would be: ${message}`);
  }
}

// CLI interface
function main() {
  const args = process.argv.slice(2);
  const squasher = new GitCommitSquasher();

  const help = `
Git Daily Commit Squasher

Usage: node tools/index.js [options]

Options:
  --help, -h          Show this help message
  --preview, -p       Preview what would be squashed
  --interactive, -i   Interactive mode
  --format <type>     Commit message format (summary, detailed, timestamp, custom)
  --message <text>    Custom commit message (use with --format custom)

Examples:
  node tools/index.js                    # Squash with default settings
  node tools/index.js --preview          # Preview without squashing
  node tools/index.js --interactive      # Interactive mode
  node tools/index.js --format detailed  # Squash with detailed message
  node tools/index.js --format custom --message "My custom message"
`;

  if (args.includes('--help') || args.includes('-h')) {
    console.log(help);
    return;
  }

  if (args.includes('--preview') || args.includes('-p')) {
    squasher.preview();
    return;
  }

  const options = {
    interactive: args.includes('--interactive') || args.includes('-i'),
    format: 'summary'
  };

  // Parse format option
  const formatIndex = args.indexOf('--format');
  if (formatIndex !== -1 && args[formatIndex + 1]) {
    options.format = args[formatIndex + 1];
  }

  // Parse custom message
  const messageIndex = args.indexOf('--message');
  if (messageIndex !== -1 && args[messageIndex + 1]) {
    options.customMessage = args[messageIndex + 1];
  }

  squasher.run(options);
}

// Export for use as module
module.exports = GitCommitSquasher;

// Run if called directly
if (require.main === module) {
  main();
}
