import { Agent } from 'https';
import { readFileSync } from 'fs';
import { $fetch } from 'ohmyfetch';
import { apiClientFactory } from '@vue-storefront/core';
import * as api from './api';
import { ClientInstance, Config } from './types';

const onCreate = (settings: Config): { config: Config; client: ClientInstance } => {
  const config = {
    ...settings,
  } as unknown as Config;

  if (settings.client) {
    return {
      client: settings.client,
      config,
    };
  }

  const httpsAgent = new Agent({
    rejectUnauthorized: false,
    cert: readFileSync(config.certPath),
    key: readFileSync(config.keyPath),
    passphrase: config.certPassphrase
  })

  const client = {
    async post(url: string, body: any, options?: any) {
      return $fetch(url, {
        method: 'POST',
        agent: httpsAgent,
        ...options,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
    }
  };

  return {
    client,
    config
  }
}

const { createApiClient } = apiClientFactory({
  onCreate,
  api
});

export {
  createApiClient
};
