interface Vaadin {
  developmentModeCallback?: {
    'usage-statistics'?(): void;
  };
  registrations?: Array<{ is: string; version: string }>;
  usageStatsChecker?: {
    maybeGatherAndSend(): void;
  };
  featureFlags?: record<string,boolean>;
}

interface Window {
  Vaadin: Vaadin;
}
