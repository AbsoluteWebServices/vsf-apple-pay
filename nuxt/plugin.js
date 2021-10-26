import { integrationPlugin } from '@absolute-web/vsf-core'

const moduleOptions = JSON.parse('<%= JSON.stringify(options) %>');

const defaultConfig = {
  currencyCode: 'USD',
  countryCode: 'US',
  supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
  merchantCapabilities: [
    'supports3DS',
    'supportsCredit',
    'supportsDebit',
  ],
};

export default integrationPlugin(({ app, integration }) => {
  const settings = {
    ...defaultConfig,
    ...moduleOptions,
  };

  integration.configure('applepay', settings);
});
