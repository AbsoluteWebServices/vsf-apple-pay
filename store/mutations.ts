import { ApplePayState } from '../types/ApplePayState'
import { MutationTree } from 'vuex'
import * as types from './mutation-types'

export const mutations: MutationTree<ApplePayState> = {
  [types.SET_PAYMENT_TOKEN] (state, paymentToken) {
    state.paymentToken = paymentToken
  }
}
