<template>
  <v-app>
    <!-- sidebar -->
    <v-navigation-drawer light style="border-right:2px #f4f5fa solid; font-family:Oswald;" v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app> <!--style="box-shadow: 0px 13px 5px 0px rgb(112 112 115 / 30%)!important;z-index: 9;"-->
      <!-- sidebar-menu -->
          
          <v-list class="d-flex flex-column ma-0" height="100%">
            <img width="120px"  class="mx-auto mt-4" src="/logo.png">
            <v-list-item class="mt-auto px-0">
              <v-spacer>
              <!-- dashboard -->
              <v-tooltip right open-delay="1000">
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item to="/" link v-bind="attrs" v-on="on">
                    <v-list-item-action class="mr-3">
                      <v-icon>mdi-view-dashboard</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Dashboard</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <span>Pantalla de inicio</span>
              </v-tooltip>

              <!-- dashboard -->
              <v-tooltip right open-delay="1000">
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item to="/calendar" link v-bind="attrs" v-on="on">
                    <v-list-item-action class="mr-3">
                      <v-icon>mdi-calendar-blank</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Calendario</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <span>Pantalla de inicio</span>
              </v-tooltip>

              <!-- pacientes -->
              <v-tooltip right open-delay="1000">
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item to="/clients" link v-bind="attrs" v-on="on">
                    <v-list-item-action class="mr-3">
                      <v-icon>mdi-account-group</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Pacientes</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <span>Lista de Pacientes</span>
              </v-tooltip>

              <!-- menús -->
              <v-tooltip right open-delay="1000">
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item to="/menus" link v-bind="attrs" v-on="on">
                    <v-list-item-action class="mr-3">
                      <v-icon>mdi-food-drumstick</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Menús</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <span>Lista de menus alimenticios para dietas</span>
              </v-tooltip>

              <!-- videos -->
              <v-tooltip right open-delay="1000">
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item to="/videos" link v-bind="attrs" v-on="on">
                    <v-list-item-action class="mr-3">
                      <v-icon>mdi-youtube</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Videos</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <span>Lista de videos para rutinas de entrenamiento</span>
              </v-tooltip>




              <v-tooltip right open-delay="1000">
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item to="/training" link v-bind="attrs" v-on="on">
                    <v-list-item-action class="mr-3">
                      <v-icon>mdi-arm-flex-outline</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Plan de Entrenamiento</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <span>Lista de videos para rutinas de entrenamiento</span>
              </v-tooltip>

              

              
              </v-spacer>
            
            </v-list-item >
          </v-list>
          

      <template v-slot:append>
        <div style="color:#9ca3a5; font-size: 12px;" class="pa-2">
          TORCRM | v1.0.0 <v-icon> mdi-settings</v-icon>
        </div>
      </template>
    </v-navigation-drawer>
    <!-- content -->
    <v-main class="pa-0" style="background:#eeeeee;">
      <v-container class="pa-0" fluid>
        <keep-alive>
          <router-view @closeDrawer="closeDrawer"></router-view>
        </keep-alive>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      drawer:true,
    }),
    computed:{
      currentUser:{
        get(){
          return this.$store.state.currentUser.user;
        }
      }
    },
    created(){
      this.$store.dispatch('plan/getPlans')
      this.$store.dispatch('category/getCategories')
      this.$store.dispatch('currentUser/getUser')
    },
    methods:{
      closeDrawer: function(){
        
      }
    }
  }
</script>


<style>
.theme--light.v-list-item--active:hover::before, .theme--light.v-list-item--active::before {
    opacity: 1!important;
    border-right: 3px #e12826 solid;
    background: transparent;
}
.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled), 
.theme--light.v-icon {
    color: black!important;
    font-weight: 600!important;
}
.v-list .v-list-item--active, .v-list-item--active .theme--light.v-icon, .v-application a  {
    color: #e12826!important;
    font-weight: 600!important;
}
</style>
