import {TestRunnerConfig, TestRunnerCoreConfig} from '@web/test-runner';

import devServerConfig from './web-dev-server.config.js';

const testRunnerConfig: TestRunnerConfig = {
  plugins: devServerConfig.plugins,
  testRunnerHtml(testRunnerImport: string, config: Partial<TestRunnerCoreConfig>) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <script>this.IS_REACT_ACT_ENVIRONMENT = true;</script>
  <script type="module" src="${testRunnerImport}"></script>
</body>
</html>`;
  },
};

export default testRunnerConfig;