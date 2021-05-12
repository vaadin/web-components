const fs = require('fs/promises');
const dotenv = require('dotenv');
const { Octokit } = require('octokit');
const axios = require('axios');

dotenv.config();

const zhApi = axios.create({
  baseURL: 'https://api.zenhub.com/',
  headers: {
    'X-Authentication-Token': process.env.ZENHUB_API_TOKEN
  }
});

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

  let totalIssueCount = 0;
  console.time('issues');
  const packages = await fs.readdir('packages');
  await Promise.all(
    packages.map((package) =>
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
            const [{ data: labels }, pipelines] = await Promise.all([
              // fetch all labels on the issue
              // (no need for pagination as there is never too many)
              octokit.rest.issues.listLabelsOnIssue({
                owner: 'vaadin',
                repo: package,
                issue_number: issue.number
              }),
              // AND at the same time fetch ZenHub pipelines for the issue
              zhApi.get(`/p1/repositories/${repo.id}/issues/${issue.number}`).then(({ data: { pipelines } }) =>
                // enrich the returned pipelines list with the ZenHub workspace name for each pipeline
                Promise.all(
                  pipelines.map(async (pipeline) => ({
                    ...pipeline,
                    workspace: await getZenHubWorkspaceName(pipeline.workspace_id, repo.id)
                  }))
                )
              )
            ]);

            console.log('%s#%d: %s', package, issue.number, issue.title);
            if (labels.length > 0) {
              console.log(`\tlabels: [${labels.map((label) => label.name).join(', ')}]`);
            }
            if (pipelines.length > 0) {
              console.log(
                `\tpipelines: [${pipelines.map((pipeline) => `${pipeline.name} in ${pipeline.workspace}`).join(', ')}]`
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
  console.timeEnd(`issues`);
}

main().catch(console.log);
