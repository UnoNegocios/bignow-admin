import Vue from 'vue'
import Vuex from 'vuex'

import currentUser from "./modules/currentUser"
import plan from "./modules/plan"

import category from "./modules/category"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    currentUser,
    plan,
    category
  }
})
