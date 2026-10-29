export const API_V4 = 'v4' as const;

export const v4Contract = {
  version: API_V4,
  basePath: '/api/v4/webpagetest',
  endpoints: {
    instantTests: {
      test: 'test',
      balance: 'balance',
      nodes: 'nodes',
      enumerations: 'enumerations',
      history: 'history',
      result: (testId: number) => `results/${testId}`,
      screenshot: (testId: number) => `results/${testId}/screenshot`,
      responseBody: (testId: number) => `results/${testId}/responseBody`,
      artifact: (testId: number, artifactType: number) => `results/${testId}/files/${artifactType}`,
      rerun: (testId: number) => `results/${testId}/rerun`,
      status: (testId: number) => `results/${testId}/status`,
    },
    scheduledTests: {},
  },
} as const;
