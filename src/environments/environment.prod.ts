export const environment = {
  production: true,
  // apiHost: 'http://192.168.32.90:4389',
  // fpvHost: 'http://192.168.32.90:8080',
  // mediaHost: 'http://192.168.32.90:6400',
  // janusServer:'http://192.168.32.90:8088',

  apiHost: window.origin === "https://ids.hdcircles.tech" ? window.origin+':8888' : window.origin+':4389',
  fpvHost: window.origin+':8080',
  mediaHost: window.origin+':6400',
  janusServer: window.origin === "https://ids.hdcircles.tech" ? window.origin+':8089' : window.origin+':8088',

  pollingInterval: 750,

  baselineMissionRef: 'UTo4vDVDEYYLxKp2',

  pathPlanningStartPathId: '61052a6d-729c-46d3-82f6-d051fa3b6ad8',
  pathPlanningHomePathId: 'fb3c3f70-4380-45be-a50c-c5fe238c77ff',
};
