<template>
  <v-app>
    <v-main>
      <app v-if="token!=null"></app>
      <login v-else></login>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios"
import App from "../src/views/App"
import Login from "../src/views/Login"
export default {
  name: 'App',
  components:{ 
    'app':App, 
    'login':Login,
  },
  data: () => ({
    token:localStorage.getItem("session_token"),
  }),
  mounted(){
    axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/current").catch(error => {
      localStorage.removeItem("session_token");
      this.token = null
    });
  },
  created(){
    window.addEventListener("beforeunload", this.leaving);
  },
  methods:{
    beforeRouteLeave (to, from , next) {
      const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
      if (answer) {
        next()
      } else {
        next(false)
      }
    }
  }
};
</script>
