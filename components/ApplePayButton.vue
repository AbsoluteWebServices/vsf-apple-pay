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

<style scoped>
@supports (-webkit-appearance: -apple-pay-button) {
  /* Template for logo only button (height independent). */
  .apple-pay-button {
    display: block;
    cursor: pointer;
    -webkit-appearance: -apple-pay-button;
  }
  .apple-pay-button-black {
    -apple-pay-button-style: black;
  }
  .apple-pay-button-black-with-line {
    -apple-pay-button-style: black-outline;
  }
  .apple-pay-button-white {
    -apple-pay-button-style: white;
  }
  .apple-pay-button-white-with-line {
    -apple-pay-button-style: white-outline;
  }
  /* Template for "Buy with" button with height: 32 */
  .apple-pay-button-with-text {
    display: block;
    cursor: pointer;
    -webkit-appearance: -apple-pay-button;
    -apple-pay-button-type: buy;
  }
  .apple-pay-button-with-text > * {
    display: none;
  }
  .apple-pay-button-black-with-text {
    -apple-pay-button-style: black;
  }
  .apple-pay-button-black-with-line-with-text {
    -apple-pay-button-style: black-outline;
  }
  .apple-pay-button-white-with-text {
    -apple-pay-button-style: white;
  }
  .apple-pay-button-white-with-line-with-text {
    -apple-pay-button-style: white-outline;
  }
  /* Template for additional Apple Pay button types */
  .apple-pay-set-up-button {
    -apple-pay-button-type: set-up;
  }
  .apple-pay-donate-button {
    -apple-pay-button-type: donate;
  }
  .apple-pay-check-out-button {
    -apple-pay-button-type: check-out;
  }
  .apple-pay-book-button {
    -apple-pay-button-type: book;
  }
  .apple-pay-subscribe-button {
    -apple-pay-button-type: subscribe;
  }
}

@supports not (-webkit-appearance: -apple-pay-button) {
  /* Template for logo only button (height independent). */
  .apple-pay-button {
    display: block;
    background-size: 100% 60%;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    border-radius: 5px;
    padding: 0px;
    box-sizing: border-box;
    min-width: 200px;
    min-height: 32px;
    max-height: 64px;
  }
  .apple-pay-button-black {
    background-image: -webkit-named-image(apple-pay-logo-white);
    background-color: black;
  }
  .apple-pay-button-white {
    background-image: -webkit-named-image(apple-pay-logo-black);
    background-color: white;
  }
  .apple-pay-button-white-with-line {
    background-image: -webkit-named-image(apple-pay-logo-black);
    background-color: white;
    border: 0.5px solid black;
  }
  /* Template for "Buy with" button with height: 32 */
  .apple-pay-button-with-text {
    --apple-pay-scale: 1; /* (height / 32) */
    display: flex;
    justify-content: center;
    font-size: 12px;
    border-radius: 5px;
    padding: 0px;
    box-sizing: border-box;
    min-width: 200px;
    min-height: 32px;
    max-height: 64px;
  }
  .apple-pay-button-black-with-text {
    background-color: black;
    color: white;
  }
  .apple-pay-button-white-with-text {
    background-color: white;
    color: black;
  }
  .apple-pay-button-white-with-line-with-text {
    background-color: white;
    color: black;
    border: 0.5px solid black;
  }
  .apple-pay-button-with-text.apple-pay-button-black-with-text > .logo {
    background-image: -webkit-named-image(apple-pay-logo-white);
    background-color: black;
  }
  .apple-pay-button-with-text.apple-pay-button-white-with-text > .logo {
    background-image: -webkit-named-image(apple-pay-logo-black);
    background-color: white;
  }
  .apple-pay-button-with-text.apple-pay-button-white-with-line-with-text
    > .logo {
    background-image: -webkit-named-image(apple-pay-logo-black);
    background-color: white;
  }
  .apple-pay-button-with-text > .text {
    font-family: -apple-system;
    font-size: calc(1em * var(--apple-pay-scale));
    font-weight: 300;
    align-self: center;
    margin-right: calc(2px * var(--apple-pay-scale));
  }
  .apple-pay-button-with-text > .logo {
    width: calc(35px * var(--scale));
    height: 100%;
    background-size: 100% 60%;
    background-repeat: no-repeat;
    background-position: 0 50%;
    margin-left: calc(2px * var(--apple-pay-scale));
    border: none;
  }
}
</style>
