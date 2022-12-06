import axios from "axios";
const state = {
    plans:[]
};
const getters = {};

const actions = {
  getPlans( {commit} ){
    axios
    .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/training_plans")
    .then(response => {
        commit('setPlans', response.data);
    });
  }
};

const mutations = {
  setPlans(state, data){
    state.plans = data;
  }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}