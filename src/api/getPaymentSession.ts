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

  try {
    const response = await client.post(validationURL, {
      merchantIdentifier: merchantId,
      displayName: merchantName,
      initiative: 'web',
      initiativeContext: domainName
    });

    if (response.status !== 200) {
      throw response.data;
    }

    return response.data;
  } catch (err) {
    if (err.response) {
      throw err.response.data;
    } else if (err.request) {
      throw err.request;
    } else {
      throw err;
    }
  }
}
