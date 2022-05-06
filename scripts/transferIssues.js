const fs = require('fs').promises;
const dotenv = require('dotenv');
const { Octokit } = require('octokit');
const axios = require('axios');

dotenv.config();

// If DRY_RUN then no actual changes are made
const DRY_RUN = process.env.PRODUCTION_RUN !== 'true';

// If TEST_ON_SINGLE_ISSUE then only the special test issue is affected
// (see https://github.com/vaadin/magi-cli/issues/142)
const TEST_ON_SINGLE_ISSUE = process.env.TEST_ON_SINGLE_ISSUE === 'true';

// GitHub API client (both REST and GraphQL)
const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN });

// ZenHub API client
const zhApi = axios.create({
  baseURL: 'https://api.zenhub.com/',
  headers: {
    'X-Authentication-Token': process.env.ZENHUB_API_TOKEN,
  },
  adapter: zhRateLimitingAdapter(axios.defaults.adapter),
});

// The packages listed here will be skipped by this script.
// All issues opened in that repos will remain untouched.
const EXCLUDED_PACKAGES = [
  // Do not exclude even though it's managed by the CE team
  // https://vaadin.slack.com/archives/C01MHLE0FN3/p1621246586005600
  // 'vaadin-messages'
];

// All open issues from the source repos will be transferred to _this_ repo:
const TARGET_REPO = {
  name: 'web-components',
  owner: 'vaadin',
};

// Moslty useful for testing to limit the scope when running this script
let shouldExcludeIssue = () => false;
if (TEST_ON_SINGLE_ISSUE) {
  // Run a small-scale test with a signle issue only
  // That issue was created specifically for testing this script
  shouldExcludeIssue = (issue) => {
    return issue.title !== 'Test issue for the tansfer-issue script';
  };
}

// Moslty useful for testing to limit the scope when running this script
let shouldExcludeRepo = () => false;
if (TEST_ON_SINGLE_ISSUE) {
  // Run a small-scale test with a signle issue only
  // That issue was created specifically for testing this script
  shouldExcludeRepo = (repo) => {
    return repo.full_name !== 'vaadin/magi-cli';
  };
}

async function getSourceReposList() {
  const packages = await fs.readdir('packages');
  if (TEST_ON_SINGLE_ISSUE) {
    packages.push('magi-cli', 'web-components');
  }

  const repos = await Promise.all(
    packages
      .filter((package) => {
        const skip = EXCLUDED_PACKAGES.indexOf(package) > -1;
        if (skip) {
          console.log(`Skipped the package ${package} as it's in the skip list`);
        }
        return !skip;
      })
      .map(async (package) => {
        try {
          const { data: repo } = await octokit.rest.repos.get({
            owner: 'vaadin',
            repo: package,
          });
          return repo;
        } catch (e) {
          if (!!e.constructor && e.constructor.name === 'RequestError' && e.status === 404) {
            console.log(`Skipped the package ${package} as it has no separate repo`);
          } else {
            throw e;
          }
        }
      }),
  );

  return repos
    .filter((repo) => !!repo) // Remove skipped packages from the list
    .filter((repo) => {
      const skip = shouldExcludeRepo(repo);
      if (skip) {
        console.log(`Skipped the repo ${repo.full_name} because the shouldExcludeRepo() filter returned true`);
      }
      return !skip;
    });
}

const zhWorkspaceNameById = new Map();
async function getZenHubWorkspaceName(workspace_id, repo_id) {
  if (!zhWorkspaceNameById.has(workspace_id)) {
    zhWorkspaceNameById.set(
      workspace_id,
      (async (workspace_id, repo_id) => {
        const { data: workspaces } = await zhApi.get(`/p2/repositories/${repo_id}/workspaces`);
        const idx = workspaces.findIndex((workspace) => workspace.id === workspace_id);
        if (idx > -1) {
          return workspaces[idx].name;
        }
        throw new Error(`Cannot find ZenHub workspace with ID ${workspace_id} for the repo with ID ${repo_id}`);
      })(workspace_id, repo_id),
    );
  }

  return zhWorkspaceNameById.get(workspace_id);
}

// Special handling for ZenHub REST API rate limiting
// (see https://github.com/ZenHubIO/API#api-rate-limit)
function zhRateLimitingAdapter(adapter) {
  return async (config) => {
    let response;
    let status = 403;
    while (status === 403) {
      try {
        response = await adapter(config);
        status = response.status;
      } catch (e) {
        if (e.isAxiosError && e.response.status === 403) {
          const resetAtMs = e.response.headers['x-ratelimit-reset'] * 1000;
          const sentAtMs = new Date(e.response.headers.date).getTime();
          const timeoutMs = resetAtMs - sentAtMs;
          console.log(`timeout until ZenHub API request rate reset: ${timeoutMs} ms`);
          await new Promise((r) => {
            setTimeout(r, timeoutMs);
          });
        } else {
          throw e;
        }
      }
    }

    return response;
  };
}

async function createLabelInRepo(label, repo) {
  let newLabel;
  if (DRY_RUN) {
    newLabel = await Promise.resolve(label);
  } else {
    const { data } = await octokit.rest.issues.createLabel({
      owner: repo.owner.login,
      repo: repo.name,
      name: label.name,
      description: label.description,
      color: label.color,
    });
    newLabel = data;
  }

  return {
    ...newLabel,
    transferred: true,
  };
}

async function transferIssue(issue, targetRepo) {
  if (DRY_RUN) {
    return { ...issue };
  }
  const response = await octokit.graphql(
    `mutation TransferIssue($issueNodeId: ID!, $targetRepoNodeId: ID!, $clientMutationId: String) {
        transferIssue(input: {
          clientMutationId: $clientMutationId,
          issueId: $issueNodeId,
          repositoryId: $targetRepoNodeId
        }) {
          issue {
            number
            repository {
              name
              databaseId
              owner {
                login
              }
            }
          }
        }
      }`,
    {
      clientMutationId: issue.url,
      issueNodeId: issue.node_id,
      targetRepoNodeId: targetRepo.node_id,
    },
  );
  return response.transferIssue.issue;
}

async function transferLabels(labels, issue) {
  if (DRY_RUN) {
    return [...labels];
  }
  const { data } = await octokit.rest.issues.addLabels({
    owner: issue.repository.owner.login,
    repo: issue.repository.name,
    issue_number: issue.number,
    labels: labels.map((label) => label.name),
  });
  return data;
}

async function transferZhPipelines(pipelines, issue) {
  if (DRY_RUN) {
    return Promise.resolve();
  }
  await Promise.all(
    pipelines.map(async (pipeline) => {
      zhApi.post(
        `/p2/workspaces/${pipeline.workspace_id}/repositories/${issue.repository.databaseId}/issues/${issue.number}/moves`,
        {
          pipeline_id: pipeline.pipeline_id,
          position: 'bottom',
        },
      );
    }),
  );
}

async function makeRepoLabelsMap(repo) {
  const map = new Map();
  const repoLabels = {
    get: (labelName) => map.get(labelName.toLowerCase()),
    set: (labelName, label) => map.set(labelName.toLowerCase(), label),
    has: (labelName) => map.has(labelName.toLowerCase()),
    values: () => map.values(),
    ensure: async (label) => {
      if (!repoLabels.has(label.name)) {
        // First store a promise to remember that a transfer of _this_ label has
        // been scheduled to avoid transferring the same label several times.
        const promise = createLabelInRepo(label, repo);
        repoLabels.set(label.name, promise);

        // Eventually, store the transferred label itself
        console.log(`creating a label '${label.name}' in the ${repo.full_name} repo`);
        repoLabels.set(label.name, await promise);
      } else if ('then' in repoLabels.get(label.name)) {
        console.log(`waiting until the label '${label.name}' is created in the ${repo.full_name} repo`);
        await repoLabels.get(label.name);
      }
    },
  };

  // Fetch the list of all existing labels on the target repo
  const iterator = octokit.paginate.iterator(octokit.rest.issues.listLabelsForRepo, {
    owner: repo.owner.login,
    repo: repo.name,
    per_page: 100,
  });

  for await (const { data: labels } of iterator) {
    for (const label of labels) {
      repoLabels.set(label.name, { ...label, transferred: false });
    }
  }

  return repoLabels;
}

async function main() {
  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();
  console.log(`Logged-in to GitHub as ${login}`);

  const { data: targetRepo } = await octokit.rest.repos.get({
    owner: TARGET_REPO.owner,
    repo: TARGET_REPO.name,
  });
  console.log(`Transferring issues to the ${targetRepo.full_name} repo (GraphQL Node ID: ${targetRepo.node_id})`);

  const targetRepoLabels = await makeRepoLabelsMap(targetRepo);
  console.log(`Existing labels in the ${targetRepo.full_name} repo:`);
  for (const { name, color, description } of targetRepoLabels.values()) {
    console.log(`\t${JSON.stringify({ name, color, description })}`);
  }

  const { data: targetRepoZhWorkspaces } = await zhApi.get(`/p2/repositories/${targetRepo.id}/workspaces`);

  console.time('issues');
  let totalIssueCount = 0;
  let totalZhEpics = 0;
  let totalIssuesWithZhEstimate = 0;

  const repos = await getSourceReposList();
  await Promise.all(
    repos.map(async (repo) => {
      let issueCount = 0;
      console.log(`Transferring issues from the repo ${repo.full_name}...`);

      const iterator = octokit.paginate.iterator(octokit.rest.issues.listForRepo, {
        owner: repo.owner.login,
        repo: repo.name,
        per_page: 100,
      });

      // Iterate through each page of issues
      for await (const { data: issues } of iterator) {
        // Iterate through each issue in a page
        for (const issue of issues) {
          // Do not transfer open PRs
          if (issue.html_url.indexOf('/pull/') > -1) {
            continue;
          }

          if (shouldExcludeIssue(issue)) {
            console.log(`Skipping ${repo.name}#${issue.number} because the shouldExcludeIssue() filter returned true`);
            continue;
          }

          const [{ data: labels }, zhIssue] = await Promise.all([
            // Fetch all labels on the issue
            // (no need for pagination as there is never too many)
            octokit.rest.issues.listLabelsOnIssue({
              owner: repo.owner.login,
              repo: repo.name,
              issue_number: issue.number,
            }),
            // AND at the same time fetch ZenHub pipelines for the issue
            (async () => {
              const { data: zhIssue } = await zhApi.get(`/p1/repositories/${repo.id}/issues/${issue.number}`);
              const pipelinesWithWorkspaceName = await Promise.all(
                zhIssue.pipelines.map(async (pipeline) => ({
                  ...pipeline,
                  workspace: await getZenHubWorkspaceName(pipeline.workspace_id, repo.id),
                })),
              );
              return { ...zhIssue, pipelines: pipelinesWithWorkspaceName };
            })(),
          ]);

          if (zhIssue.is_epic) {
            console.log(`Skipping ${repo.name}#${issue.number} because it's a ZH Epic`);
            totalZhEpics += 1;
            continue;
          }

          if (zhIssue.estimate) {
            console.log(
              `${repo.name}#${issue.number} has a ZH estimate of ${zhIssue.estimate.value}. ` +
                `The estimate won't be transferred automatically, please do it manually.`,
            );
            totalIssuesWithZhEstimate += 1;
          }

          const transferredIssue = await transferIssue(issue, targetRepo);

          // Add the original repo name as an extra label on the transferred issue
          // (but use the 'theme' label for styles issues)
          labels.push(
            ['vaadin-lumo-styles', 'vaadin-material-styles'].indexOf(repo.name) > -1
              ? { name: 'theme', color: '5319E7', description: '' }
              : { name: repo.name, color: 'eeeeee', description: '' },
          );

          await Promise.all(labels.map(targetRepoLabels.ensure));
          await transferLabels(labels, transferredIssue);

          if (zhIssue.pipelines.length > 0) {
            await transferZhPipelines(
              zhIssue.pipelines.filter((pipeline) => {
                const isTargetRepoInPipelineWorkspace =
                  targetRepoZhWorkspaces.findIndex((workspace) => workspace.id === pipeline.workspace_id) > -1;
                if (!isTargetRepoInPipelineWorkspace) {
                  console.log(
                    `ZenHub pipeline ${pipeline.name} in ${pipeline.workspace} on the ` +
                      `issue ${repo.name}#${issue.number} cannot be transferred because ` +
                      `the target repo ${targetRepo.name} is not included into the ` +
                      `${pipeline.workspace} ZenHub workspace.`,
                  );
                }
                return isTargetRepoInPipelineWorkspace;
              }),
              transferredIssue,
            );
          }

          console.log('%s#%d: %s', repo.name, issue.number, issue.title);
          console.log(`\ttransferred to ---> ${targetRepo.name}#${transferredIssue.number}`);
          if (labels.length > 0) {
            console.log(
              `\tlabels: [${labels
                .map((label) => label.name + (targetRepoLabels.get(label.name).transferred ? ' [CREATED]' : ''))
                .join(', ')}]`,
            );
          }
          if (zhIssue.pipelines.length > 0) {
            console.log(
              `\tpipelines: [${zhIssue.pipelines
                .map((pipeline) => {
                  const isTargetRepoInPipelineWorkspace =
                    targetRepoZhWorkspaces.findIndex((workspace) => workspace.id === pipeline.workspace_id) > -1;
                  return `${pipeline.name} in ${pipeline.workspace}${
                    isTargetRepoInPipelineWorkspace ? '' : ' [UNTRANSFERRED]'
                  }`;
                })
                .join(', ')}]`,
            );
          }
          issueCount += 1;
        }
      }

      console.log(`total issues in the ${repo.name} repo: ${issueCount}`);
      totalIssueCount += issueCount;
    }),
  );

  console.log(`total issues in all repos combined: ${totalIssueCount}`);
  console.log(`total ZenHub Epics skipped in all repos combined: ${totalZhEpics}`);
  console.log(`total issues with ZenHub estimates in all repos combined: ${totalIssuesWithZhEstimate}`);
  console.timeEnd(`issues`);
}

main().catch(console.log);
