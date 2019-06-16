import { KEY } from '../index'

export function afterRegistration({ Vue, config, store, isServer }) {
  let correctPaymentMethod = false
  const placeOrder = () => {
    if (correctPaymentMethod) {
      const paymentToken = store.state[KEY].paymentToken
      if (paymentToken) {
        Vue.prototype.$bus.$emit('checkout-do-placeOrder', {
          paymentToken
        })
      }
    }
  }

  // Update the methods
  let paymentMethodConfig = {
    'title': 'Apple Pay',
    'code': KEY,
    'cost': 0,
    'costInclTax': 0,
    'default': true,
    'offline': false,
    'is_server_method': false
  }

  store.dispatch('payment/addMethod', paymentMethodConfig)

  if (!isServer) {
    Vue.prototype.$bus.$on('checkout-before-placeOrder', placeOrder)
    Vue.prototype.$bus.$on('checkout-payment-method-changed', (paymentMethodCode) => {
      if (paymentMethodCode === KEY) {
        correctPaymentMethod = true
      } else {
        correctPaymentMethod = false
      }
    })
  }
}
