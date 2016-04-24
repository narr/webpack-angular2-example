/// <reference path="../typings/browser.d.ts" />

interface WebpackRequire {
  ensure(paths: string[], callback: (require: <T>(path: string) => T) => void,
    chunkName?: string): void;
}
interface NodeRequire extends WebpackRequire { }

// to build for ng-html
// When it is built in the server environment(ng-html), Typescript MouseEvent is not recognized by
// default so add typings for it.
interface MouseE extends MouseEvent { }

// @ Webpack DefinePlugin variables
declare var ENV: string;
declare var HMR: boolean;
declare var PROJECT_PATH: string;
declare var BASE_URL: string;
// Webpack DefinePlugin variables @
