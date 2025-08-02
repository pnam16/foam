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
 * Get all unique dates from commits
 */
const getCommitDates = () => {
  try {
    const command = 'git --no-pager log --format="%ad" --date=short';
    const output = execSync(command, {cwd: repoPath, encoding: "utf8"});

    if (!output.trim()) {
      return [];
    }

    const dates = output.trim().split("\n");
    return [...new Set(dates)].sort().reverse(); // Remove duplicates and sort newest first
  } catch (error) {
    console.error("Error getting commit dates:", error.message);
    return [];
  }
};

/**
 * Get commits from a specific date
 */
const getCommitsByDate = (date) => {
  try {
    const command = `git --no-pager log --oneline --format="%H %s" --since="${date} 00:00:00" --until="${date} 23:59:59"`;
    const output = execSync(command, {cwd: repoPath, encoding: "utf8"});

    if (!output.trim()) {
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
    console.error("Error getting commits for date:", error.message);
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
 * Get the commit hash to reset to (before the specified commits)
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
const generateCommitMessage = (commits, date = null) => {
  if (date) {
    return `Daily commit squash - ${date} (${commits.length} commits)`;
  }
  return `Squash all commits - ${commits.length} commits`;
};

/**
 * Create a squash commit with preserved date
 */
const createSquashCommit = (commits, date = null) => {
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
  const commitMessage = generateCommitMessage(commits, date);

  // Reset to the commit before the specified commits
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
 * Squash commits for each day
 */
const squashDaily = () => {
  const dates = getCommitDates();

  if (dates.length === 0) {
    console.log("No commits found.");
    return;
  }

  console.log(`Found commits from ${dates.length} different days:\n`);
  dates.forEach((date, index) => {
    const commits = getCommitsByDate(date);
    console.log(`${index + 1}. ${date}: ${commits.length} commits`);
  });

  console.log("\nStarting daily squash process...\n");

  // Process dates in reverse order (oldest first) to avoid conflicts
  const sortedDates = [...dates].sort();

  for (const date of sortedDates) {
    const commits = getCommitsByDate(date);
    if (commits.length > 1) {
      console.log(`\n🔄 Processing ${date} (${commits.length} commits)...`);
      createSquashCommit(commits, date);
    } else if (commits.length === 1) {
      console.log(
        `\n⏭️  Skipping ${date} (only 1 commit, no squashing needed)`,
      );
    } else {
      console.log(`\n⏭️  Skipping ${date} (no commits)`);
    }
  }

  console.log("\n✅ Daily squash process completed!");
};

/**
 * Preview daily squash
 */
const previewDaily = () => {
  let dates = getCommitDates();

  if (dates.length === 0) {
    console.log("No commits found.");
    return;
  }

  console.log(`Found commits from ${dates.length} different days:\n`);

  // Process dates in reverse order (oldest first)
  dates = dates.sort();

  for (const date of dates) {
    const commits = getCommitsByDate(date);

    if (commits.length > 1) {
      console.log(`\n📅 ${date}: ${commits.length} commits would be squashed`);
      commits.forEach((commit, index) => {
        console.log(
          `   ${index + 1}. ${commit.hash.substring(0, 8)} - ${commit.message}`,
        );
      });
      const message = generateCommitMessage(commits, date);
      console.log(`   📝 Message: ${message}`);
    } else if (commits.length === 1) {
      console.log(`\n📅 ${date}: 1 commit (no squashing needed)`);
    } else {
      console.log(`\n📅 ${date}: no commits`);
    }
  }
};

/**
 * Main execution method
 */
const run = (options = {}) => {
  const {preview: isPreview = false, daily = false} = options;

  if (daily) {
    if (isPreview) {
      previewDaily();
    } else {
      squashDaily();
    }
  } else if (isPreview) {
    preview();
  } else {
    console.log("Please specify --daily or --preview option. Use --help for more information.");
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
  --daily             Squash commits for each day separately

Examples:
  node tools/index.js --daily            # Squash commits for each day
  node tools/index.js --preview --daily  # Preview daily squash
`;

  if (args.includes("--help") || args.includes("-h")) {
    console.log(help);
    return;
  }

  const options = {
    preview: args.includes("--preview") || args.includes("-p"),
    daily: args.includes("--daily"),
  };

  run(options);
};

// Export for use as module
export {
  getAllCommits,
  getCommitDates,
  getCommitsByDate,
  getCommitDetails,
  getResetTarget,
  generateCommitMessage,
  createSquashCommit,
  preview,
  squashDaily,
  previewDaily,
  run,
};

// Run if called directly
const normalizePath = (path) => path.replace(/\\/g, "/");

// Check if this file is being run directly
const isMainModule = import.meta.url.endsWith(normalizePath(process.argv[1]));

if (isMainModule) {
  main();
}
