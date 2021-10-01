<template>
  <div v-if="canMakePayments" :class="buttonClasses" @click="onClick">
    <slot :type="type">
      <span v-if="type === 'buy'" class="text">{{ $t("Buy with") }}</span>
      <span class="logo" />
    </slot>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "@vue/composition-api";
import { useVSFContext } from "@vue-storefront/core";
import { usePaymentSession } from "@absolute-web/vsf-apple-pay";

const lineItemsToDisplay = ["subtotal", "shipping", "tax"];

export default {
  name: "ApplePayButton",
  props: {
    totals: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: false,
      default: "buy",
      validator: function (value) {
        return (
          [
            "plain",
            "buy",
            "set-up",
            "donate",
            "check-out",
            "book",
            "subscribe",
          ].indexOf(value) !== -1
        );
      },
    },
    color: {
      type: String,
      required: false,
      default: "black",
      validator: function (value) {
        return ["black", "white"].indexOf(value) !== -1;
      },
    },
    withLine: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { $applepay } = useVSFContext();
    const {
      paymentSession,
      load: loadPaymentSession,
      error,
    } = usePaymentSession();

    const {
      merchantId,
      currencyCode,
      countryCode,
      supportedNetworks,
      merchantCapabilities,
    } = $applepay.config;
    const canMakePayments = ref(false);
    const session = ref(null);
    const buttonClasses = computed(() => {
      if (props.type === "buy") {
        return `apple-pay-button-with-text apple-pay-button-${props.color}${
          props.withLine ? "-with-line" : ""
        }-with-text`;
      } else {
        return `apple-pay-button apple-pay-${
          props.type
        }-button apple-pay-button-${props.color}${
          props.withLine ? "-with-line" : ""
        }`;
      }
    });

    const lineItems = computed(() => {
      const lineItems = [];

      for (const key in props.totals) {
        if (Object.hasOwnProperty.call(props.totals, key)) {
          const amount = props.totals[key];

          if (lineItemsToDisplay.includes(key)) {
            lineItems.push({
              label: key,
              type: "final",
              amount: amount.toFixed(2),
            });
          }
        }
      }

      return lineItems;
    });

    const total = computed(() => props.totals?.total || 0);

    const setupButton = async () => {
      try {
        const _canMakePayments = await window.ApplePaySession.canMakePayments(
          merchantId
        );

        if (_canMakePayments) {
          canMakePayments.value = true;
        }
      } catch (err) {
        emit("error", err);
      }
    };

    const onValidateMerchant = async (event) => {
      // 1. You call your server, passing it the URL from the event’s validationURL property.
      // 2. Your server uses the validation URL to request a session from the Apple Pay server,
      //    as described in Requesting an Apple Pay Payment Session.
      //    Never send the request for a merchant session from the client.
      // 3. In response, your server receives an opaque merchant session object.
      // 4. You pass the merchant session object to your Apple Pay session’s
      //    completeMerchantValidation method. You can use the merchant session object a single time.
      //    It expires five minutes after it is created.

      try {
        await loadPaymentSession({ validationURL: event.validationURL });

        if (error.value.load) {
          throw error.value.load;
        }

        session.value.completeMerchantValidation(paymentSession.value);
      } catch (err) {
        emit("error", err);
      }
    };

    const onPaymentAuthorized = (event) => {
      // The onpaymentauthorized function must complete the payment
      // and respond by calling completePayment before the 30 second timeout,
      // after which a message appears stating that the payment could not be completed.

      const paymentToken = event.payment?.token;

      if (paymentToken) {
        session.value.completePayment({
          status: window.ApplePaySession.STATUS_SUCCESS,
        });
        emit("success", paymentToken);
      } else {
        session.value.completePayment({
          status: window.ApplePaySession.STATUS_FAILURE,
        });
        emit("error", event);
      }
    };

    const onCancel = (event) => {
      session.value.abort();
      emit("error", "Aborted");
    };

    const onClick = async (e) => {
      if (props.disabled) {
        return;
      }
      emit("click");
      const request = {
        countryCode,
        currencyCode,
        supportedNetworks,
        merchantCapabilities,
        total: {
          label: "Total",
          amount: total.value.toFixed(2),
        },
        lineItems: lineItems.value,
      };
      session.value = new window.ApplePaySession(3, request);
      session.value.onvalidatemerchant = onValidateMerchant;
      session.value.onpaymentauthorized = onPaymentAuthorized;
      session.value.oncancel = onCancel;
      session.value.begin();
    };

    onMounted(() => {
      if (merchantId && window.ApplePaySession) {
        setupButton();
      }
    });

    return {
      canMakePayments,
      buttonClasses,
      onClick,
    };
  },
};
</script>
