// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { version } from '../../package.json';

export const environment = {
  production: false,
  hmr: false,
  version,
  defaultNode: 'http://localhost:4200',
  market: {
    tickerUrl: 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BURST&tsyms=BTC,USD,EUR',
    tickerInterval: 60 * 1000
  },
  performance: {
    fcasUrl: 'https://platform-api.flipsidecrypto.com/api/v1/assets/573/metrics/FCAS?api_key=6e9c2808-0c48-41d8-81f1-5363d5ceb1af&change_over=7',
    fcasInterval: 60 * 5 * 1000
  },
  activatorServiceUrl: {
    mainNet: 'https://burst-account-activator.vercel.app',
    testNet: 'https://burst-account-activator-testnet.vercel.app'
  },
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
