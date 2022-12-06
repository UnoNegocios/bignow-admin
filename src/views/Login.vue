<template>
  <v-container class="ma-0 pa-0" style="max-width: 100vw;">
    <v-row class="ma-0">
      <v-col cols="5" style="height:100vh;" class="pa-0 background50">
        <img src="logo-white.png" style="max-height: 80vh; margin-top: 10vh; position: absolute; left: 22vw;"/>
      </v-col>
      <v-col cols="7" class="pl-12 bg-white">
        <v-container class="fill-height ml-4" fluid>
          <div class="mx-auto">
            <v-card class="pa-6" width="500" style="background:#272727; font-family:Oswald;" dark>
              <v-card-title>Iniciar Sesión</v-card-title>
              <v-card-text class="px-0 pb-0">
                    <v-form>
                      <v-text-field 
                      :rules="[rules.required, rules.email]"
                      @keydown.enter="login" 
                      label="Correo Electrónico" 
                      name="login" 
                      type="email" 
                      v-model="user.email" 
                      outlined></v-text-field>
                      <v-text-field 
                      :rules="[rules.required]"
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show1 ? 'text' : 'password'"
                      name="password"
                      label="Contraseña"
                      @click:append="show1 = !show1"
                      @keydown.enter="login" 
                      v-model="user.password" 
                      outlined></v-text-field>
                    </v-form>
                  </v-card-text>
                  
                  <v-card-actions class="pa-0">
                    <v-spacer></v-spacer>
                    <v-btn block rounded dark color="#e12826" type="submit" @click="login" class="btn btn-primary px-4 "><strong>Acceder</strong></v-btn>
                  </v-card-actions>
            </v-card>
          </div>
        </v-container>
      </v-col>
    </v-row>
    
  </v-container>
</template>

<script>
export default {
  data:()=>({
    alerta: false,
    show: false,
    show1: false,
    password: 'Password',
    rules: {
        required: value => !!value || 'Contraseña requerida.',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'E-mail inavlido.'
        }
    },
    user:{
        email: "",
        password: "",
    }
  }),
  methods:{
    login(){
      this.$store.dispatch('currentUser/loginUser', this.user );
      this.alerta = localStorage.getItem("nosepudo")
    }, 
  }
}
</script>

<style>
.background50{
    height: 100vh;
    background: black;
    background-image: url(/background.jpg);
    background-size: cover;
}
.bg-white {
    height: 100vh;
    background: #1e1e1e ;
    background-size: initial;
    background-position: bottom right;
}
</style>