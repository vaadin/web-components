interface Vaadin {
  developmentModeCallback?: {
    'usage-statistics'?(): void;
  };
  registrations?: Array<{ is: string; version: string }>;
  usageStatsChecker?: {
    maybeGatherAndSend(): void;
  };
}

interface Window {
  Vaadin: Vaadin;
}
