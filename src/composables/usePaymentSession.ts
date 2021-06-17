import { Context } from '@vue-storefront/core';
import { ApplePayPaymentSession, ApplePayPaymentSessionParams } from '../types';
import { usePaymentSessionFactory, UsePaymentSessionFactoryParams } from '../factories/usePaymentSessionFactory';

const factoryParams: UsePaymentSessionFactoryParams = {
  load: async (context: Context, params: ApplePayPaymentSessionParams): Promise<ApplePayPaymentSession> => {
    return context.$applepay.api.getPaymentSession(params);
  },
};


export default usePaymentSessionFactory(factoryParams);
