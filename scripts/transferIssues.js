const fs = require('fs/promises');
const dotenv = require('dotenv');
const { Octokit } = require('octokit');

dotenv.config();

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
        console.log(`Transferring issues for the package ${package}...`);

        let issueCount = 0;
        try {
          const iterator = octokit.paginate.iterator(octokit.rest.issues.listForRepo, {
            owner: 'vaadin',
            repo: package,
            per_page: 100
          });

          // iterate through each page of issues
          for await (const { data: issues } of iterator) {
            // iterate through each issue in a page
            for (const issue of issues) {
              const [{ data: labels }] = await Promise.all([
                octokit.rest.issues.listLabelsOnIssue({
                  owner: 'vaadin',
                  repo: package,
                  issue_number: issue.number
                })
              ]);

              console.log('%s#%d: %s', package, issue.number, issue.title);

              if (labels.length > 0) {
                console.log(`\t[${labels.map((label) => label.name).join(', ')}]`);
              }
              issueCount += 1;
            }
          }
        } catch (e) {
          if (!!e.constructor && e.constructor.name === 'RequestError' && e.status === 404) {
            console.log(`Skipped the package ${package} as it has no separate repo`);
          } else {
            throw e;
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
