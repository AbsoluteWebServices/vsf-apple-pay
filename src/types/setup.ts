export interface ClientInstance {
  post(url: string, body: any, options?: any): Promise<any>;
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


