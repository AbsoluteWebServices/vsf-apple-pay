import { CustomQuery } from '@vue-storefront/core';
import { ApplePayPaymentSession, ApplePayPaymentSessionParams } from './paymentSession';

export interface ApplePayApiMethods {
  getPaymentSession(params: ApplePayPaymentSessionParams, customQuery?: CustomQuery): Promise<ApplePayPaymentSession>;
}
