import {
  ExpressEngineConfig,
  provide,
  ORIGIN_URL,
  BASE_URL,
  REQUEST_URL,
  enableProdMode
} from 'angular2-universal';

import { DIRECTIVES, PIPES, PROVIDERS } from '../platform/node';

import * as fs from 'fs';
const minify = require('html-minifier').minify;

interface GeneratorOption {
  // originUrl: string; // 'http://localhost:3000'
  baseUrl: string;
  requestUrl: string;
  component: any;
  renderer: any;
  indexFilename: string;
  targetPath: string;
}

export function generator(options: GeneratorOption) {
  const config: ExpressEngineConfig = {
    platformProviders: [
      // provide(ORIGIN_URL, { useValue: options.originUrl }),
      provide(ORIGIN_URL, { useValue: '' }),
      provide(BASE_URL, { useValue: options.baseUrl })
    ],
    providers: [
      ...DIRECTIVES,
      ...PIPES,
      ...PROVIDERS,
      provide(REQUEST_URL, { useValue: options.requestUrl })
    ],
    directives: [options.component],
    async: true,
    preboot: false // preboot: { appRoot: 'app' } // your top level app component selector
  };

  options.renderer.render(options.indexFilename, config, (err, html) => {
    if (err) {
      console.log(err);
      return;
    }
    try {
      fs.accessSync(options.targetPath);
    } catch (e) {
      fs.mkdirSync(options.targetPath);
    }
    console.log(html);
    const mifiedHtml = minify(html, {
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
      collapseWhitespace: true
    });
    // console.log(mifiedHtml);
    fs.writeFileSync(`${options.targetPath}/index.html`, mifiedHtml);
  });
}

enableProdMode();
