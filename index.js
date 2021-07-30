const core = require('@actions/core');
const github = require('@actions/github');

async function addTag() {
  const githubToken = core.getInput('repo-token');
  const octokit = github.getOctokit(githubToken);

  const res = await octokit.rest.repos.getCommit({ ...github.context.repo, ref: github.context.sha });
  for (const file of res.data.files) {
    if ((file.filename = core.getInput('submodule_path'))) {
      console.log('SUBMODULE CHANGED!!!!!!!!!');
      console.log(file.filename);
      console.log(file.filename);
      console.log(file.filename);
      console.log(file.filename);
      console.log(file.filename);
      console.log(file.filename);
      console.log(file.filename);
      console.log('SUBMODULE CHANGED!!!!!!!!!');

      const submodule_sha = (
        await octokit.rest.repos.getContent({
          ...github.context.repo,
          path: core.getInput('submodule_path'),
          ref: github.context.sha,
        })
      ).data.sha;

      const currentTag = await octokit.rest.repos.getLatestRelease({
        owner: core.getInput('owner'),
        repo: core.getInput('repo'),
      });
      const newTag = `v1.${parseInt(currentTag.data.tag_name.split('.')[1]) + 1}`;
      console.log(JSON.stringify(github.context.repo));
      await octokit.rest.repos.createRelease({
        owner: core.getInput('owner'),
        repo: core.getInput('repo'),
        tag_name: newTag,
        target_commitish: submodule_sha,
      });
    }
  }
}

try {
  addTag();

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
