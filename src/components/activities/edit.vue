<template>
    <v-card>
        <v-card-title class="py-4" >
            <v-icon style="background: #e7e8e9; padding: 10px!important; border-radius: 50%;" class="mr-4"> mdi-calendar</v-icon>
            <span>Agendar Consulta</span> 
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
            <v-container>
                <v-row>
                    <v-col class="py-6" cols="12" sm="6" md="6">
                        <v-row class="ma-0 px-2">
                            <v-autocomplete v-model="appointment.user_id" :items="usersList" :loading="isLoadingUsers" :search-input.sync="searchUsers" hide-no-data item-value="id" item-text="name" label="Paciente" placeholder="Escribe para buscar" attach></v-autocomplete>
                        </v-row>  
                        <v-row class="ma-0">
                            <v-col class="py-0" cols="12" sm="6" md="6">
                                <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="appointment.date" label="Fecha" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker color="primary" v-model="appointment.date" @input="datePicker = false"></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col class="py-0" cols="12" sm="6" md="6">
                                <v-autocomplete clearable v-model="appointment.time" prepend-icon="mdi-clock-outline" :items="hours" label="Hora">               
                                </v-autocomplete>
                            </v-col>  
                        </v-row>  
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="6">
                        <v-container fluid>
                            <v-textarea v-model="appointment.description" label="Descripcion"></v-textarea>
                        </v-container>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">
                Cancelar
            </v-btn>
            <v-btn color="blue darken-1" v-if="valid==false" :loading="gris" :disabled="gris" text @click="save">
                Guardar
            </v-btn>
            <v-btn color="blue darken-1" v-if="valid==true" disabled text @click="save">
                Guardar
            </v-btn>
        </v-card-actions>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-card>
</template>

<script>
import axios from "axios";
    export default {
        props:{
            appointment:Object
        },
        data: () => ({
            snackbar: {
                show: false,
                message: null,
                color: null
            },
            gris:false,
            datePicker:'',
            rules: {
                required: value => !!value || 'Campo requerido',
            },
            entries:{
                users: []
            },
            isLoadingUsers: false,
            searchUsers: null,
        }),
        watch: {
            searchUsers(val){
                //if (this.companyLists.length > 0) return
                if (this.isLoadingUsers) return
                this.isLoadingUsers = true

                axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/users?filter[name]='+val)
                .then(res => {
                    this.entries.users = res.data.data
                    console.log(this.entries.users)
                }).finally(() => (this.isLoadingUsers = false))
            },
        },
        computed: {
            valid(){
                if(
                    (this.appointment.date!=''&&this.appointment.date!=undefined&&this.appointment.date!=null)&&
                    (this.appointment.time!=''&&this.appointment.time!=undefined&&this.appointment.time!=null)&&
                    (this.appointment.user_id!=''&&this.appointment.user_id!=undefined&&this.appointment.user_id!=null)
                ){
                    return false
                }else{
                    return true
                }
            },
            hours(){
                var arr = [], i, j;
                for(i=0; i<24; i++) {
                    for(j=0; j<4; j++) {
                        arr.push(this.cero(i) + ":" + (j===0 ? "00" : 15*j) + ":00");
                    }
                }
                return arr
            },
            usersList(){
                return this.entries.users.map(id => {
                    return{
                        id:id.id,
                        name:id.name,
                    }
                })
            },
            currentUser:{
                get(){
                    return this.$store.state.currentUser.user
                }
            }   
        },
        created(){
            this.entries.users = [this.appointment.user]
        },
        methods: {
            cero(i){
                if(i<10){
                    return '0' + i
                }else{
                    return i
                }
            },
            close () {
                this.appointment = Object.assign({}, this.defaultItem)
                this.gris = false
                this.$nextTick(() => {
                    this.$emit("closeCreateDialogCalendar", false);
                })
            },
            save(){
                this.gris = true
                this.appointment.trainer_id = this.currentUser.id
                this.appointment.date_time = this.appointment.date + ' ' + this.appointment.time
                this.$nextTick(() => {
                    axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/appointments/"+this.appointment.id,Object.assign(this.appointment)).then(response=>{
                        this.close()
                    }).catch(error => {
                        this.snackbar = {
                            message: error.response.data.message,
                            color: 'error',
                            show: true
                        }
                        this.gris = false
                    })
                })
            },
        },
}
</script>
<style lang="css" scoped>
.v-text-field >>> label{
    font-size: 14px!important;
}
</style>
<style>
.v-input__icon--prepend-inner i::before {
    font-size: 18px!important;
    color:#1976D2;
}
.v-text-field input, .v-label {
    font-size: 14px;
}
.v-picker__title.primary{
    display:none;
}
</style>