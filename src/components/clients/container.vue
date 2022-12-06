<template>
  <v-card class="elevation-0 pa-12">
    <v-card-title>
        Pacientes
        <v-spacer></v-spacer>
        <v-btn rounded color="black" dark class="elevation-0 ml-2" @click="activeSearch=!activeSearch">Buscar</v-btn>

        <v-dialog v-model="createDialog" width="700px">
            <template v-slot:activator="{ on, attrs }">
                <v-btn rounded color="black" dark class="elevation-0 ml-2" v-bind="attrs" v-on="on">Agregar</v-btn>
            </template>
            <create @closeCreateDialog="closeCreateDialog"/>
        </v-dialog>
        
    </v-card-title>
    <v-text-field
        @keydown.enter="getDataFromApi()"
        v-model="search"
        append-icon="mdi-magnify"
        label="Buscar"
        single-line
        hide-details
        v-if="activeSearch"
        class="mb-6 mx-4"
    ></v-text-field>
    <v-data-table
        :items="clients" 
        :headers="header"
        :footer-props="{'items-per-page-options':[15, 30, 50, totalClients]}"
        :options.sync="options"
        :server-items-length="totalClients"
        :loading="loading"
    >
    <template v-slot:[`item.profile_photo_url`]="{ item }">
        <v-avatar size="40"><img :src="item.profile_photo_url"/></v-avatar>
    </template>
    <template v-slot:[`item.reciever_phone`]="{ item }">
        <span @click="sendIvitation(item)">{{item.reciever_phone}}</span>
    </template>
    </v-data-table>
    <v-snackbar :color="snackbar.color" v-model="snackbar.show">
        {{ snackbar.message }}
    </v-snackbar>
  </v-card>
</template>

<script>
import Create from './create.vue'
import axios from "axios"
  export default {
    components:{
      'create': Create  
    },
    data () {
      return {
        createDialog:false,
        totalClients: 0,
        clients: [],
        loading: true,
        options: {},
        activeSearch: false,
        search: '',
        header: [
            {text:'', value:'profile_photo_url'},
            {text:'Nombre', value:'name'},
            {text:'Email', value:'email'},
            {text:'Plan', value:'training_plan'},
            //{text:'Proxima Cita', value:'next_appointment'},
            {text:'Citas', value:'appointments'},
        ],
        snackbar: {
            show: false,
            message: null,
            color: null
        },
      }
    },
    computed:{
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        }
    },
    watch: {
        options: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
    },
    methods:{
        getDataFromApi () {
            this.loading = true
            this.apiCall().then(data => {
                this.clients = data.clients
                this.totalClients = data.total
                this.loading = false
            })
        },
        apiCall () {
            return new Promise((resolve, reject) => {
                const { sortBy, sortDesc, page, itemsPerPage } = this.options
                var clients = []
                var total = 0
                var link = ''
                if(sortBy.length === 1){
                    if(sortDesc[0]){
                        link = link + "sort=-" + sortBy[0] + '&'
                    }else{
                        link = link + "sort=" + sortBy[0] + '&'
                    }
                }
                if(this.search!=''){
                    link = link + 'filter[name]=' + this.search + '&'
                }
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/users?" + link + "page=" + page + "&itemsPerPage=" + itemsPerPage).then(response => {
                    console.log(response)
                    clients = this.mapClients(response.data.data)
                    total = total = response.data.meta.total
                    resolve({
                        clients,
                        total,
                    })
                })
            })
        },
        mapClients(items){
            return items
        },
        closeCreateDialog: function(params){
            this.getDataFromApi()
            this.createDialog = params
        }
    }
}
</script>

<style scoped>
.flex-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>