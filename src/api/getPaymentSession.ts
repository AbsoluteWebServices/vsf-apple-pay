import { Context } from '../types/context';
import {
  ApplePayPaymentSession,
  ApplePayPaymentSessionParams
} from '../types/paymentSession';

export default async (
  { config, client }: Context,
  params: ApplePayPaymentSessionParams
): Promise<ApplePayPaymentSession> => {
  const { merchantId, merchantName, domainName } = config;
  const validationURL = params.validationURL;

  return await client.post(validationURL, {
    merchantIdentifier: merchantId,
    displayName: merchantName,
    initiative: 'web',
    initiativeContext: domainName
  });
}
