// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import keycloakConfig from "./keycloak.config";

export const environment = {
  production: false,
  apiHost: 'http://192.168.32.90:4389',
  fpvHost: 'http://192.168.32.90:8080',
  mediaHost: 'http://192.168.32.90:6400',
  janusServer:'http://192.168.32.90:8088',
  // apiHost: window.origin+':8888',
  // fpvHost: window.origin+':8080',
  // mediaHost: window.origin+':6400',

  pollingInterval: 750,

  baselineMissionRef: 'UTo4vDVDEYYLxKp2',

  pathPlanningStartPathId: '61052a6d-729c-46d3-82f6-d051fa3b6ad8',
  pathPlanningHomePathId: 'fb3c3f70-4380-45be-a50c-c5fe238c77ff',
};
