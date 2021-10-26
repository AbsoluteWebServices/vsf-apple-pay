import { CustomQuery } from '@absolute-web/vsf-core';
import { ApplePayPaymentSession, ApplePayPaymentSessionParams } from './paymentSession';

export interface ApplePayApiMethods {
  getPaymentSession(params: ApplePayPaymentSessionParams, customQuery?: CustomQuery): Promise<ApplePayPaymentSession>;
}
