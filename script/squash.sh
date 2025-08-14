#!/bin/bash

# Git Commit Squasher
# Squashes all commits into one with today's date

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  print_error "Not in a git repository"
  exit 1
fi

# Get today's date in YYYY-MM-DD format
TODAY=$(date +%Y-%m-%d)



# Function to perform the squash
perform_squash() {
  # Get commit count
  COMMIT_COUNT=$(git rev-list --count HEAD)

  if [ "$COMMIT_COUNT" -eq 0 ]; then
    print_info "No commits to squash"
    exit 0
  fi

  if [ "$COMMIT_COUNT" -eq 1 ]; then
    print_info "Only one commit found, no squashing needed"
    exit 0
  fi

  print_info "Repository has $COMMIT_COUNT total commits"

  # Check if working directory is clean
  if ! git diff-index --quiet HEAD --; then
    print_warning "Working directory has uncommitted changes"
    print_info "Current git status:"
    git status
    echo
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      print_info "Aborted"
      exit 0
    fi
  fi

  # Get the root commit (first commit)
  ROOT_COMMIT=$(git rev-list --max-parents=0 HEAD)
  print_info "Resetting to root commit: ${ROOT_COMMIT:0:8}"

  # Perform soft reset to root commit
  git reset --soft "$ROOT_COMMIT"

  # Create new commit with today's date
  git commit -m "$TODAY"

  print_info "Successfully squashed $COMMIT_COUNT commits into one with message: \"$TODAY\""

  # Force push to remote repository
  print_info "Force pushing to remote repository..."
  if git push --force-with-lease; then
    print_info "Successfully pushed squashed commit to remote repository"
  else
    print_warning "Force push failed. You may need to manually push with: git push --force"
  fi
}

# Main execution
case "${1:-}" in
  --help|-h)
    cat << EOF
Git Commit Squasher

Usage: ./squash.sh [options]

Options:
  --help, -h          Show this help message

Examples:
  ./squash.sh              # Squash all commits with today's date and force push

EOF
    ;;
  "")
    perform_squash
    ;;
  *)
    print_error "Unknown option: $1"
    print_info "Use --help for usage information"
    exit 1
    ;;
esac
