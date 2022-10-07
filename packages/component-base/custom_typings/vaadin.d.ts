type Vaadin = {
  developmentModeCallback?: {
    'usage-statistics'?(): void;
  };
  registrations?: Array<{ is: string; version: string }>;
  usageStatsChecker?: {
    maybeGatherAndSend(): void;
  };
};

type Window = {
  Vaadin: Vaadin;
};
