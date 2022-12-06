<template>
    <v-card class="pa-3">
        <v-card-title>
            Nuevo Paciente
        </v-card-title>
        <v-row class="ma-0">
            <v-col cols="6">
                <v-text-field label="Nombre" v-model="user.name" outlined></v-text-field>
                <v-text-field label="Email" v-model="user.email" outlined></v-text-field>
                <v-text-field label="Dirección" v-model="user.address" outlined></v-text-field>
                <v-text-field label="Teléfono" v-model="user.phone" outlined></v-text-field>
            </v-col>
            <v-col cols="6">
                <v-select label="Genero" v-model="user.gender" outlined :items="genders"></v-select>
                <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                    <template v-slot:activator="{ on }">
                        <v-text-field :rules="[v => !!v || 'Campo requerido']" outlined clearable required v-model="user.birthdate" label="Cumpleaños" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                    </template>
                    <v-date-picker color="primary" v-model="user.birthdate" @input="datePicker = false"></v-date-picker>
                </v-menu>
                <v-select label="Plan" :items="plans" item-text="name" item-value="id" v-model="user.training_plan_id" outlined></v-select>
                <v-text-field label="Contraseña" @click:append="show1 = !show1" :type="show1 ? 'text' : 'password'" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" v-model="user.password" outlined></v-text-field>
            </v-col>
        </v-row>
        <v-card-actions>
            <v-spacer/>
            <v-btn rounded class="elevation-0 ml-2" color="grey" @click="close()">Cancelar</v-btn>
            <v-btn rounded class="elevation-0 ml-2" color="black" @click="save()" :disabled="valid" :loading="gris" dark>Guardar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import axios from "axios"
export default {
    data: () => ({
        gris:false,
        datePicker:false,
        genders:['Masculino', 'Femenino'],
        show1: false,
        user:{
            name:'',
            email:'',
            password:'',
            address:'',
            phone:'',
            gender:'',
            birthdate:'',
            training_plan_id:'',
            trainer_id:''
        },
    }),
    computed:{
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
        valid(){
            if(
                (this.user.name!=''&&this.user.name!=undefined&&this.user.name!=null)&&
                (this.user.email!=''&&this.user.email!=undefined&&this.user.email!=null)&&
                (this.user.password!=''&&this.user.password!=undefined&&this.user.password!=null)
            ){
                return false
            }else{
                return true
            }
        },
        plans(){
            return this.$store.state.plan.plans
        }
    },
    methods:{
        close(){
            this.gris = false
            this.user = Object.assign({}, this.defaultItem)
            this.$nextTick(() => {
                this.$emit("closeCreateDialog", false);
            })
        },
        save(){
            this.user.trainer_id = this.currentUser.id
            this.gris = true
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/users",Object.assign(this.user)).then(response=>{
                this.close()
            })
        }
    }
}
</script>

<style>

</style>