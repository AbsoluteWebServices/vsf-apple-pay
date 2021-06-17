import { AxiosInstance } from 'axios';

export interface ClientInstance extends AxiosInstance {
}
export interface ClientConfig {
  merchantId: string;
  merchantName: string;
  domainName: string;
  certPath: string;
  keyPath: string;
  certPassphrase: string;
}

export interface Config extends ClientConfig {
  client?: ClientInstance;
};


