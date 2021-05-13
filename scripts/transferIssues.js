const fs = require('fs/promises');
const dotenv = require('dotenv');
const { Octokit } = require('octokit');
const axios = require('axios');

dotenv.config();

// if DRY_RUN then no actual changes are made
const DRY_RUN = process.env.PRODUCTION_RUN !== true;

// The packages listed here will be skipped by this script.
// All issues opened in that repos will remain untouched.
const EXCLUDED_PACKAGES = [
  'vaadin-messages' // managed by the CE team
];

const zhApi = axios.create({
  baseURL: 'https://api.zenhub.com/',
  headers: {
    'X-Authentication-Token': process.env.ZENHUB_API_TOKEN
  }
});

// Special handling for ZenHub REST API rate limiting
// (see https://github.com/ZenHubIO/API#api-rate-limit)
function rateLimitingAdapter(adapter) {
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
          const sentAtMs = new Date(e.response.headers['date']).getTime();
          const timeoutMs = resetAtMs - sentAtMs;
          console.log(`timeout until ZenHub API request rate reset: ${timeoutMs} ms`);
          await new Promise((r) => setTimeout(r, timeoutMs));
        } else {
          throw e;
        }
      }
    }

    return response;
  };
}
zhApi.defaults.adapter = rateLimitingAdapter(zhApi.defaults.adapter);

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
        } else {
          throw new Error(`Cannot find ZenHub workspace with ID ${workspace_id} for the repo with ID ${repo_id}`);
        }
      })(workspace_id, repo_id)
    );
  }

  return zhWorkspaceNameById.get(workspace_id);
}

async function main() {
  const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN });

  const {
    data: { login }
  } = await octokit.rest.users.getAuthenticated();
  console.log(`Logged-in to GitHub as ${login}`);

  // fetch the list of all existing labels on the '@vaadin/web-components' repo
  const iterator = octokit.paginate.iterator(octokit.rest.issues.listLabelsForRepo, {
    owner: 'vaadin',
    repo: 'web-components',
    per_page: 100
  });

  const webComponentsRepoLabels = (() => {
    // the webComponentsRepoLabels Map is private to ensure it's only accessed
    // using the functions below that make the key case-insensitive
    const map = new Map();

    return {
      get: (labelName) => map.get(labelName.toLowerCase()),
      set: (labelName, label) => map.set(labelName.toLowerCase(), label),
      has: (labelName) => map.has(labelName.toLowerCase())
    };
  })();

  console.log(`Labels on the @vaadin/web-components repo:`);
  for await (const { data: labels } of iterator) {
    for (const label of labels) {
      webComponentsRepoLabels.set(label.name, { ...label, transferred: false });
      console.log(`\t${JSON.stringify(webComponentsRepoLabels.get(label.name))}`);
    }
  }

  async function ensureWebComponentsRepoLabelExists(label) {
    if (!webComponentsRepoLabels.has(label.name)) {
      webComponentsRepoLabels.set(
        label.name,
        (async () => {
          console.log(`creating a label '${label.name}' in the web-components repo`);
          let newLabel;
          if (DRY_RUN) {
            newLabel = await Promise.resolve(label);
          } else {
            const { data } = await octokit.rest.issues.createLabel({
              owner: 'vaadin',
              repo: 'web-components',
              name: label.name,
              description: label.description,
              color: label.color
            });
            newLabel = data;
          }
          webComponentsRepoLabels.set(label.name, {
            ...newLabel,
            transferred: true
          });
          return newLabel;
        })()
      );
    } else if ('then' in webComponentsRepoLabels.get(label.name)) {
      console.log(`waiting until the label '${label.name}' is created in the web-components repo`);
      await webComponentsRepoLabels.get(label.name);
    }
  }

  let totalIssueCount = 0;
  let totalZhEpics = 0;
  let totalIssuesWithZhEstimate = 0;
  console.time('issues');
  const packages = await fs.readdir('packages');
  await Promise.all(
    packages
      .filter((package) => {
        const skip = EXCLUDED_PACKAGES.indexOf(package) > -1;
        if (skip) {
          console.log(`Skipped the package ${package} as it's in the skip list`);
        }
        return !skip;
      })
      .map((package) =>
        (async () => {
          let repo;
          try {
            const response = await octokit.rest.repos.get({
              owner: 'vaadin',
              repo: package
            });
            repo = response.data;
          } catch (e) {
            if (!!e.constructor && e.constructor.name === 'RequestError' && e.status === 404) {
              console.log(`Skipped the package ${package} as it has no separate repo`);
              return;
            } else {
              throw e;
            }
          }

          let issueCount = 0;
          console.log(`Transferring issues for the package ${package}...`);

          const iterator = octokit.paginate.iterator(octokit.rest.issues.listForRepo, {
            owner: 'vaadin',
            repo: package,
            per_page: 100
          });

          // iterate through each page of issues
          for await (const { data: issues } of iterator) {
            // iterate through each issue in a page
            for (const issue of issues) {
              const [{ data: labels }, zhIssue] = await Promise.all([
                // fetch all labels on the issue
                // (no need for pagination as there is never too many)
                octokit.rest.issues.listLabelsOnIssue({
                  owner: 'vaadin',
                  repo: package,
                  issue_number: issue.number
                }),
                // AND at the same time fetch ZenHub pipelines for the issue
                zhApi.get(`/p1/repositories/${repo.id}/issues/${issue.number}`).then(async (response) => ({
                  ...response.data,
                  // enrich the returned pipelines list with the ZenHub workspace name for each pipeline
                  pipelines: await Promise.all(
                    response.data.pipelines.map(async (pipeline) => ({
                      ...pipeline,
                      workspace: await getZenHubWorkspaceName(pipeline.workspace_id, repo.id)
                    }))
                  )
                }))
              ]);

              if (zhIssue.is_epic) {
                console.log(`Skipping ${package}#${issue.number} because it's a ZH Epic`);
                totalZhEpics += 1;
                continue;
              }

              if (zhIssue.estimate) {
                console.log(`${package}#${issue.number} has a ZH estimate of ${zhIssue.estimate.value}`);
                totalIssuesWithZhEstimate += 1;
              }

              if (labels.length > 0) {
                await Promise.all(labels.map(ensureWebComponentsRepoLabelExists));
              }

              console.log('%s#%d: %s', package, issue.number, issue.title);
              if (labels.length > 0) {
                console.log(
                  `\tlabels: [${labels
                    .map(
                      (label) =>
                        label.name + (webComponentsRepoLabels.get(label.name).transferred ? ' [TRANSFERRED]' : '')
                    )
                    .join(', ')}]`
                );
              }
              if (zhIssue.pipelines.length > 0) {
                console.log(
                  `\tpipelines: [${zhIssue.pipelines
                    .map((pipeline) => `${pipeline.name} in ${pipeline.workspace}`)
                    .join(', ')}]`
                );
              }
              issueCount += 1;
            }
          }

          console.log(`total issues in the ${package} repo: ${issueCount}`);
          totalIssueCount += issueCount;
        })(package)
      )
  );
  console.log(`total issues in all repos combined: ${totalIssueCount}`);
  console.log(`total ZenHub Epics skipped in all repos combined: ${totalZhEpics}`);
  console.log(`total issues with ZenHub estimates in all repos combined: ${totalIssuesWithZhEstimate}`);
  console.timeEnd(`issues`);
}

main().catch(console.log);
