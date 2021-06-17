import { Agent } from 'https';
import { readFileSync } from 'fs';
import axios from 'axios';
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

  const client = axios.create({
    httpsAgent
  });

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
