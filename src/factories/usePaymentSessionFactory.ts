import { Ref, computed } from 'vue-demi';
import {
  configureFactoryParams,
  Context,
  FactoryParams,
  Logger,
  sharedRef,
} from '@vue-storefront/core';
import { UsePaymentSession, UsePaymentSessionErrors } from '../types/composables';
import { ApplePayPaymentSessionParams, ApplePayPaymentSession } from '../types/paymentSession';

export interface UsePaymentSessionFactoryParams extends FactoryParams{
  load: (context: Context, params: ApplePayPaymentSessionParams) => Promise<ApplePayPaymentSession>;
}

export function usePaymentSessionFactory(
  factoryParams: UsePaymentSessionFactoryParams,
) {
  return function usePaymentSession(ssrKey = 'usePaymentSession'): UsePaymentSession {
    const paymentSession: Ref<ApplePayPaymentSession> = sharedRef<ApplePayPaymentSession>({}, `usePaymentSession-paymentSession-${ssrKey}`);
    const loading: Ref<boolean> = sharedRef<boolean>(false, `usePaymentSession-loading-${ssrKey}`);
    const error: Ref<UsePaymentSessionErrors> = sharedRef({
      load: null,
    }, `usePaymentSession-error-${ssrKey}`);
    // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
    const _factoryParams = configureFactoryParams(factoryParams);

    const load = async (params: ApplePayPaymentSessionParams) => {
      Logger.debug(`usePaymentSession/${ssrKey}/load`);

      try {
        loading.value = true;
        paymentSession.value = await _factoryParams.load(params);
        error.value.load = null;
      } catch (err) {
        error.value.load = err;
        Logger.error(`usePaymentSession/${ssrKey}/load`, err);
      } finally {
        loading.value = false;
      }
    };

    return {
      paymentSession: computed(() => paymentSession.value),
      loading: computed(() => loading.value),
      error: computed(() => error.value),
      load,
    };
  };
}
