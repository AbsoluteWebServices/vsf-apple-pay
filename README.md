# Vue Storefront Apple Pay Payment Extension

The Apple Pay Payment module for [vue-storefront](https://github.com/DivanteLtd/vue-storefront).

## Installation

By hand (preferer):

```shell
git clone git@github.com:AbsoluteWebServices/vsf-apple-pay.git ./vue-storefront/src/modules/
```

Registration the ApplePay module. Go to `./vue-storefront/src/modules/index.ts`

```js
...
import { ApplePay } from './vsf-apple-pay';

export const registerModules: VueStorefrontModule[] = [
  ...
  ApplePay
]
```

Add following settings to your config file.

```json
  "applePay": {
    "environment": "Sandbox",
    "merchantId": "merchant.com.example.mystore",
    "merchantName": "Example merchant name",
    "supportedNetworks": ["visa", "masterCard", "amex", "discover"],
    "merchantCapabilities": ["supports3DS", "supportsCredit", "supportsDebit", "supportsEMV"],
    "endpoint": {
      "paymentSession": "http://localhost:8080/api/ext/apple-pay/paymentSession"
    }
  },
```

Add Apple Pay button to checkout page. It is recommended to replace "Place order" button with Apple Pay button when Apple Pay selected as payment method. 

```
...
import ApplePayButton from 'src/modules/vsf-apple-pay/components/ApplePayButton'

export default {
  ...
  components: {
    ...
    ApplePayButton
  },
  ...
  computed: {
    ...
    paymentMethod () {
      return this.$store.state.checkout.paymentDetails.paymentMethod
    }
  }
  ...
}
```

```html
<apple-pay-button
  v-if="paymentMethod == 'applePay'"
  @payment-authorized="placeOrder"
/>
```

## API extension

Install additional extension for `vue-storefront-api`:

```shell
cp -f ./vue-storefront/src/modules/vsf-apple-pay/API/apple-pay ./vue-storefront-api/src/api/extensions/
```

Add the config to your api config.

```json
"extensions":{
   "apple-pay": {
     "merchantId": "merchant.com.example.mystore",
     "merchantName": "Example merchant name"
  }
```

Create a [merchant identity certificate](https://help.apple.com/developer-account/#/dev1731126fb?sub=dev17ad0bdc0) and place it to `./vue-storefront-api/config/certificates/apple-pay-merchant-identity-certificate.cer`
