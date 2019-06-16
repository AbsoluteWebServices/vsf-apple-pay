import { Module } from 'vuex'
import { ApplePayState } from '../types/ApplePayState'
import { mutations } from './mutations'
import { getters } from './getters'
import { actions } from './actions'
import { state } from './state'

export const module: Module<ApplePayState, any> = {
    namespaced: true,
    mutations,
    actions,
    getters,
    state
}
