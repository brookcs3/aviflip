import { execSync } from 'child_process';

// GitHub repository details
const GITHUB_USERNAME = 'brookcs3'; // The provided GitHub username
const REPO_NAME = 'aviflip'; // The repository name
const BRANCH_NAME = 'main';

// GitHub token from environment variable
const GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

if (!GITHUB_TOKEN) {
  console.error('Error: GITHUB_ACCESS_TOKEN environment variable is not set.');
  process.exit(1);
}

// Function to execute shell commands
function execute(command) {
  try {
    console.log(`Executing: ${command.replace(GITHUB_TOKEN, '****')}`); // Hide token in logs
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Command failed: ${command.replace(GITHUB_TOKEN, '****')}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Main function to sync with GitHub
async function syncWithGitHub() {
  try {
    // Check if .git directory exists
    let isGitInitialized = false;
    try {
      execSync('git rev-parse --is-inside-work-tree', { stdio: 'pipe' });
      isGitInitialized = true;
    } catch (error) {
      // Git is not initialized
    }

    if (!isGitInitialized) {
      // Initialize git repository
      execute('git init');
      
      // Configure Git to use token for authentication
      const remoteUrl = `https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git`;
      execute(`git remote add origin ${remoteUrl}`);
    }

    // Configure Git user
    execute('git config user.name "Replit User"');
    execute('git config user.email "replituser@example.com"');

    // Add all files
    execute('git add .');

    // Commit changes
    const commitMessage = `Update JPG to AVIF Converter ${new Date().toISOString()}`;
    execute(`git commit -m "${commitMessage}" --allow-empty`);

    // Push to GitHub
    execute(`git push -u origin ${BRANCH_NAME} --force`);

    console.log('Successfully pushed to GitHub!');
  } catch (error) {
    console.error('Error syncing with GitHub:', error.message);
    process.exit(1);
  }
}

// Run the sync function
syncWithGitHub().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});