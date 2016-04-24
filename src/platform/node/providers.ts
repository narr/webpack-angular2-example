import {
  // provide,
  NODE_HTTP_PROVIDERS,
  NODE_ROUTER_PROVIDERS
} from 'angular2-universal';

export const APPLICATION_PROVIDERS = [
  ...NODE_HTTP_PROVIDERS,
  ...NODE_ROUTER_PROVIDERS
];

export const PROVIDERS = [
  ...APPLICATION_PROVIDERS
];
