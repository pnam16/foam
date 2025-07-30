#!/usr/bin/env node

import {execSync} from "child_process";

const repoPath = process.cwd();

/**
 * Get all commits
 */
const getAllCommits = () => {
  try {
    const command = 'git --no-pager log --oneline --format="%H %s"';
    const output = execSync(command, {cwd: repoPath, encoding: "utf8"});

    if (!output.trim()) {
      console.log("No commits found.");
      return [];
    }

    return output
      .trim()
      .split("\n")
      .map((line) => {
        const [hash, ...messageParts] = line.split(" ");
        return {
          hash: hash,
          message: messageParts.join(" "),
        };
      });
  } catch (error) {
    console.error("Error getting commits:", error.message);
    return [];
  }
};

/**
 * Get commit details including date
 */
const getCommitDetails = (hash) => {
  try {
    const command = `git --no-pager show --format="%H%n%an%n%ae%n%ad%n%s%n%b" --no-patch ${hash}`;
    const output = execSync(command, {cwd: repoPath, encoding: "utf8"});
    const lines = output.trim().split("\n");

    return {
      hash: lines[0],
      author: lines[1],
      email: lines[2],
      date: lines[3],
      subject: lines[4],
      body: lines.slice(5).join("\n"),
    };
  } catch (error) {
    console.error(`Error getting commit details for ${hash}:`, error.message);
    return null;
  }
};

/**
 * Get the commit hash to reset to (before all commits)
 */
const getResetTarget = (commits) => {
  try {
    const lastCommitHash = commits[commits.length - 1].hash;
    const command = `git --no-pager rev-parse ${lastCommitHash}^`;
    return execSync(command, {cwd: repoPath, encoding: "utf8"}).trim();
  } catch (error) {
    console.error("Error getting reset target:", error.message);
    return "HEAD~" + commits.length;
  }
};

/**
 * Generate commit message for squashed commits
 */
const generateCommitMessage = (commits) => {
  return `Squash all commits - ${commits.length} commits`;
};

/**
 * Create a squash commit with preserved date
 */
const createSquashCommit = (commits) => {
  if (commits.length === 0) {
    console.log("No commits to squash.");
    return;
  }

  if (commits.length === 1) {
    console.log("Only one commit found, no squashing needed.");
    return;
  }

  const firstCommit = getCommitDetails(commits[0].hash);
  if (!firstCommit) {
    console.error("Could not get details of first commit.");
    return;
  }

  // Create commit message
  const commitMessage = generateCommitMessage(commits);

  // Reset to the commit before all commits
  const resetTarget = getResetTarget(commits);

  try {
    // Soft reset to preserve changes
    execSync(`git --no-pager reset --soft ${resetTarget}`, {cwd: repoPath});

    // Create new commit with preserved date
    const env = {
      ...process.env,
      GIT_AUTHOR_DATE: firstCommit.date,
      GIT_COMMITTER_DATE: firstCommit.date,
    };

    execSync(`git --no-pager commit -m "${commitMessage}"`, {
      cwd: repoPath,
      env,
      stdio: "inherit",
    });

    console.log(
      `✅ Successfully squashed ${commits.length} commits into one with preserved date: ${firstCommit.date}`,
    );
    console.log(`📝 Commit message: ${commitMessage}`);
  } catch (error) {
    console.error("Error during squash:", error.message);
    console.log(
      "You may need to manually resolve conflicts or check your git status.",
    );
  }
};

/**
 * Preview what would be squashed without actually doing it
 */
const preview = () => {
  const commits = getAllCommits();

  if (commits.length === 0) {
    console.log("No commits found.");
    return;
  }

  console.log(`\n📅 Preview: Would squash ${commits.length} commits:\n`);
  commits.forEach((commit, index) => {
    console.log(
      `${index + 1}. ${commit.hash.substring(0, 8)} - ${commit.message}`,
    );
  });

  const firstCommit = getCommitDetails(commits[0].hash);
  if (firstCommit) {
    console.log(`\n📅 Preserved date would be: ${firstCommit.date}`);
  }

  const message = generateCommitMessage(commits);
  console.log(`📝 Commit message would be: ${message}`);
};

/**
 * Main execution method
 */
const run = (options = {}) => {
  const {preview: isPreview = false} = options;

  if (isPreview) {
    preview();
  } else {
    const commits = getAllCommits();
    createSquashCommit(commits);
  }
};

// CLI interface
const main = () => {
  const args = process.argv.slice(2);

  const help = `
Git Commit Squasher

Usage: node tools/index.js [options]

Options:
  --help, -h          Show this help message
  --preview, -p       Preview what would be squashed
  --all               Squash all commits

Examples:
  node tools/index.js --all              # Squash all commits
  node tools/index.js --preview --all    # Preview all commits
`;

  if (args.includes("--help") || args.includes("-h")) {
    console.log(help);
    return;
  }

  const options = {
    preview: args.includes("--preview") || args.includes("-p"),
  };

  run(options);
};

// Export for use as module
export {
  getAllCommits,
  getCommitDetails,
  getResetTarget,
  generateCommitMessage,
  createSquashCommit,
  preview,
  run,
};

// Run if called directly
const normalizePath = (path) => path.replace(/\\/g, "/");

// Check if this file is being run directly
const isMainModule = import.meta.url.endsWith(normalizePath(process.argv[1]));

if (isMainModule) {
  main();
}
