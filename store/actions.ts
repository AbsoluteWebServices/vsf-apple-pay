import { ApplePayState } from '../types/ApplePayState'
import { ActionTree } from 'vuex'
import config from 'config'

export const actions: ActionTree<ApplePayState, any> = {
  requestPaymentSession ({}, validationURL): Promise<Response> {
    let url = config.applePay.endpoint.paymentSession

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ validationURL })
      }).then(resp => {
        resolve(resp.json())
      }).catch(err => {
        reject(err)
      })
    })
  }
}
