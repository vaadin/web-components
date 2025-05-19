import dotenv from 'dotenv';
import fs from 'node:fs';

dotenv.config();

const REPO_OWNER = 'vaadin';
const REPO_NAME = 'web-components';
const BRANCHES = ['main', '24.8', '24.7', '24.6', '24.5', '23.5'];
const GITHUB_TOKEN = process.env.GITHUB_API_TOKEN; // Set this in your .env file

if (!GITHUB_TOKEN) {
  console.error('Error: GITHUB_API_TOKEN is required. Set it in a .env file.');
  process.exit(1);
}

const headers = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github.v3+json',
};

async function getCommits(branch, page = 1) {
  const response = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?sha=${branch}&per_page=100&page=${page}`,
    { headers },
  );
  if (!response.ok) {
    throw new Error(`Error: Failed to fetch commits from GitHub: status=${response.status}`);
  }
  return await response.json();
}

function extractVersion(commitMessage) {
  const match = commitMessage.match(/chore\(release\):\s*(\d+\.\d+\.\d+(?:-(alpha|beta|rc)\d+)?)$/u);
  return match ? match[1] : null;
}

function parseVersion(version) {
  const match = version.match(/(\d+)\.(\d+)\.(\d+)(?:-(alpha|beta|rc)(\d+))?/u);
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    preRelease: match[4] || null,
    preReleaseNumber: match[5] ? parseInt(match[5], 10) : null,
  };
}

function determineNextPatchVersion(versionString) {
  const version = parseVersion(versionString);

  if (version.preRelease) {
    version.preReleaseNumber += 1;
    return `${version.major}.${version.minor}.${version.patch}-${version.preRelease}${version.preReleaseNumber}`;
  }

  version.patch += 1;
  return `${version.major}.${version.minor}.${version.patch}`;
}

async function getBranchInfo(branch) {
  const branchInfo = {
    branch,
    commits: [],
  };
  // Loading 5 pages should be enough to find the last release commit
  for (let page = 1; page < 5; page += 1) {
    const commits = await getCommits(branch, page);
    if (commits.length === 0) {
      break;
    }

    for (const commit of commits) {
      if (commit.commit.message.startsWith('chore(release)')) {
        const version = extractVersion(commit.commit.message);
        if (!version) {
          // Effectively the same as not being able to find a release commit
          break;
        }
        branchInfo.releaseCommit = commit;
        branchInfo.currentVersion = version;
        branchInfo.nextPatchVersion = determineNextPatchVersion(version);
        return branchInfo;
      }
      branchInfo.commits.push(commit);
    }
  }

  console.error('Error: Could not find release commit for branch:', branch);
  return null;
}

async function run() {
  const branchInfos = [];
  for (const branch of BRANCHES) {
    const branchInfo = await getBranchInfo(branch);
    if (branchInfo) {
      branchInfos.push(branchInfo);
    }
  }

  const template = fs.readFileSync('./scripts/check-releases.template.html', 'utf8');
  const filledTemplate = template.replace(
    '/*{inject-branch-info}*/',
    `window.branches = ${JSON.stringify(branchInfos, null, 2)};`,
  );

  fs.writeFileSync('./scripts/check-releases.html', filledTemplate, 'utf8');
}

run();
