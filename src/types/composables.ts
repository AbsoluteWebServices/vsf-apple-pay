import { ComputedProperty } from '@absolute-web/vsf-core';
import { ApplePayPaymentSession, ApplePayPaymentSessionParams } from './paymentSession';

export interface UsePaymentSessionErrors {
  load: Error | null;
}

export interface UsePaymentSession {
  paymentSession: ComputedProperty<ApplePayPaymentSession>;
  load: (params: ApplePayPaymentSessionParams) => Promise<void>;
  loading: ComputedProperty<boolean>;
  error: ComputedProperty<UsePaymentSessionErrors>;
}
