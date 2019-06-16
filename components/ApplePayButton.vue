<template>
  <div v-if="canMakePayments" :class="buttonClasses" @click="onClick">
    <template v-if="type = 'buy'">
      <span class="text">{{ t('Buy with') }}</span>
      <span class="logo"/>
    </template>
  </div>
</template>

<script>
import config from 'config'
import i18n from '@vue-storefront/i18n'
import rootStore from '@vue-storefront/core/store'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { KEY } from '../index'
import { SET_PAYMENT_TOKEN } from '../store/mutation-types'

// const ENV_TEST = 'Sandbox'
// const ENV_PROD = 'Production'

export default {
  name: 'ApplePayButton',
  props: {
    type: {
      type: String,
      required: false,
      default: 'buy',
      validator: function (value) {
        return ['plain', 'buy', 'set-up', 'donate', 'check-out', 'book', 'subscribe'].indexOf(value) !== -1
      }
    },
    color: {
      type: String,
      required: false,
      default: 'black',
      validator: function (value) {
        return ['black', 'white'].indexOf(value) !== -1
      }
    },
    withLine: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      canMakePayments: false,
      session: null
    }
  },
  mounted () {
    if (config[KEY]) {
      if (window.ApplePaySession) {
        this.setupButton()
      }
    }
  },
  computed: {
    buttonClasses () {
      if (this.type === 'buy') {
        return `apple-pay-button-with-text apple-pay-button-${this.color}${this.withLine ? '-with-line' : ''}-with-text`
      } else {
        return `apple-pay-button apple-pay-${this.type}-button apple-pay-button-${this.color}${this.withLine ? '-with-line' : ''}`
      }
    },
    totals () {
      return rootStore.getters['cart/totals']
    },
    shippingMethods () {
      return rootStore.getters['shipping/shippingMethods']
    },
    availableShippingMethods () {
      return this.shippingMethods.filter(method => method.available)
    }
  },
  methods: {
    t (text) {
      return i18n.t(text)
    },
    getLineItems () {
      const lineItems = []

      this.totals.forEach(totals => {
        if (totals.code !== 'grand_total') {
          lineItems.push({
            label: totals.title,
            type: 'final',
            amount: totals.value.toFixed(2)
          })
        }
      })

      return lineItems
    },
    getShippingMethods () {
      const shippingMethods = []

      this.availableShippingMethods.forEach(method => {
        shippingMethods.push({
          identifier: method.method_code,
          label: method.method_title,
          amount: method.amount.toFixed(2)
        })
      })

      return shippingMethods
    },
    setupButton () {
      let merchantIdentifier = config[KEY].merchantId

      window.ApplePaySession.canMakePaymentsWithActiveCard(merchantIdentifier)
        .then(canMakePayments => {
          if (canMakePayments) {
            console.log('ApplePayButton canMakePayments')
            this.canMakePayments = true
          } else {
            // Check for the existence of the openPaymentSetup method.
            if (window.ApplePaySession.openPaymentSetup) {
              // Display the Set up Apple Pay Button here…
              window.ApplePaySession.openPaymentSetup(merchantIdentifier)
                .then(success => {
                  if (success) {
                    // Open payment setup successful
                    console.log('Open payment setup successful')
                  } else {
                    // Open payment setup failed
                    console.error('Open payment setup failed')
                  }
                })
                .catch(error => {
                  // Open payment setup error handling
                  console.error(error)
                })
            }
          }
        })
    },
    onClick (e) {
      console.log('ApplePayButton.onClick')
      if (!this.disabled) {
        const storeView = currentStoreView()
        const total = this.totals.find(item => item.code === 'grand_total').value

        if (total > 0) {
          let request = {
            countryCode: storeView.i18n.defaultCountry,
            currencyCode: storeView.i18n.currencyCode,
            supportedNetworks: config[KEY].supportedNetworks,
            merchantCapabilities: config[KEY].merchantCapabilities,
            total: {
              label: config[KEY].merchantName,
              amount: total.toFixed(2)
            },
            lineItems: this.getLineItems(),
            shippingMethods: this.getShippingMethods()
          }
          this.session = new window.ApplePaySession(3, request)
          this.session.onvalidatemerchant = this.onValidateMerchant
          this.session.onpaymentauthorized = this.onPaymentAuthorized
          this.session.oncancel = this.onCancel
          // this.session.onshippingmethodselected = this.onShippingMethodSelected
          // this.session.onshippingcontactselected = this.onShippingContactSelected
          // this.session.onpaymentmethodselected = this.onPaymentMethodSelected
          this.session.begin()
          console.log('ApplePaySession.begin() called')
        }
      }
    },
    onValidateMerchant (event) {
      console.log('ApplePayButton.onValidateMerchant', event)
      // 1. You call your server, passing it the URL from the event’s validationURL property.
      // 2. Your server uses the validation URL to request a session from the Apple Pay server,
      //    as described in Requesting an Apple Pay Payment Session.
      //    Never send the request for a merchant session from the client.
      // 3. In response, your server receives an opaque merchant session object.
      // 4. You pass the merchant session object to your Apple Pay session’s
      //    completeMerchantValidation method. You can use the merchant session object a single time.
      //    It expires five minutes after it is created.

      rootStore.dispatch(KEY + '/requestPaymentSession', event.validationURL)
        .then(session => {
          console.log('ApplePayButton.requestPaymentSession', session)
          this.session.completeMerchantValidation(session)
        })
    },
    onPaymentAuthorized (event) {
      console.log('ApplePayButton.onPaymentAuthorized', event)
      // The onpaymentauthorized function must complete the payment
      // and respond by calling completePayment before the 30 second timeout,
      // after which a message appears stating that the payment could not be completed.

      const paymentData = event.payment
      const paymentToken = paymentData.token

      rootStore.commit(KEY + '/' + SET_PAYMENT_TOKEN, paymentToken)
      this.$emit('payment-authorized', paymentData)

      // if (orderPaid) {
      //   this.session.completePayment({
      //     status: window.ApplePaySession.STATUS_SUCCESS
      //   })
      // } else {
      //   this.session.completePayment({
      //     status: window.ApplePaySession.STATUS_FAILURE,
      //     errors: [
      //       new window.ApplePayError("shippingContactInvalid", "postalCode", "ZIP Code is invalid")
      //     ]
      //   })
      // }
    },
    onCancel (event) {
      console.log('ApplePayButton.onCancel', event)
      console.error('onCancel')
      this.session.abort()
    }
  }
}
</script>

<style scoped>
@supports (-webkit-appearance: -apple-pay-button) {
  /* Template for logo only button (height independent). */
  .apple-pay-button {
    display: inline-block;
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
    display: inline-block;
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
    display: inline-block;
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
    border: .5px solid black;
  }
  /* Template for "Buy with" button with height: 32 */
  .apple-pay-button-with-text {
    --apple-pay-scale: 1; /* (height / 32) */
    display: inline-flex;
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
    border: .5px solid black;
  }
  .apple-pay-button-with-text.apple-pay-button-black-with-text > .logo {
    background-image: -webkit-named-image(apple-pay-logo-white);
    background-color: black;
  }
  .apple-pay-button-with-text.apple-pay-button-white-with-text > .logo {
    background-image: -webkit-named-image(apple-pay-logo-black);
    background-color: white;
  }
  .apple-pay-button-with-text.apple-pay-button-white-with-line-with-text > .logo {
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
