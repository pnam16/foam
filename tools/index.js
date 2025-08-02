#!/usr/bin/env node

import {execSync} from "child_process";

const repoPath = process.cwd();

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
    // util = next daye
    // Calculate the next day in YYYY-MM-DD format
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    const nextDate = d.toISOString().slice(0, 10);
    const command = `git --no-pager log --oneline --format="%H %s" --since="${date} 18:30:00 UTC" --until="${nextDate} 18:30:00 UTC"`;

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
 * Create a squash commit with preserved date
 */
const createSquashCommit = (commits, date) => {
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
  const commitMessage = `${date} (${commits.length} commits)`;

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
      `Successfully squashed ${commits.length} commits into one with preserved date: ${firstCommit.date}`,
    );
    console.log(`Commit message: ${commitMessage}`);
  } catch (error) {
    console.error("Error during squash:", error.message);
    console.log(
      "You may need to manually resolve conflicts or check your git status.",
    );
  }
};

/**
 * Squash commits for each day
 */
const squashDaily = () => {
  let dates = getCommitDates();

  if (dates.length === 0) {
    console.log("No commits found.");
    return;
  }

  // Process dates in reverse order (oldest first) to avoid conflicts
  dates = dates.sort();

  for (const date of dates) {
    const commits = getCommitsByDate(date);

    if (commits.length > 1) {
      console.log(`\nProcessing ${date} (${commits.length} commits)...`);
      createSquashCommit(commits, date);
    } else if (commits.length === 1) {
      console.log(`\nSkipping ${date} (only 1 commit, no squashing needed)`);
    } else {
      console.log(`\nSkipping ${date} (no commits)`);
    }
  }

  console.log("\nDaily squash process completed!");
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
      console.log(`\n${date}: ${commits.length} commits would be squashed`);
      commits.forEach((commit, index) => {
        console.log(
          `   ${index + 1}. ${commit.hash.substring(0, 8)} - ${commit.message}`,
        );
      });
      const message = `${date} (${commits.length} commits)`;
      console.log(`   Message: ${message}`);
    } else if (commits.length === 1) {
      console.log(`\n${date}: 1 commit (no squashing needed)`);
    } else {
      console.log(`\n${date}: no commits`);
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
    console.log(
      "Please use --preview --daily to preview daily squash operations.",
    );
  } else {
    console.log(
      "Please specify --daily or --preview --daily option. Use --help for more information.",
    );
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

// Run if called directly
const normalizePath = (path) => path.replace(/\\/g, "/");

// Check if this file is being run directly
const isMainModule = import.meta.url.endsWith(normalizePath(process.argv[1]));

if (isMainModule) {
  main();
}
