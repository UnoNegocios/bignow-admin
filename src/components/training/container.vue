<template>
<v-container>
    <v-row class="ma-0 px-6">
        <v-autocomplete :items="clientsList" :loading="isLoadingClients" :search-input.sync="searchClients" hide-no-data item-value="id" item-text="name" label="Paciente" placeholder="Escribe para buscar" attach></v-autocomplete>
    </v-row>
    <v-row class="ma-0">

        <v-col cols="3" class="pa-0 pt-1">
            <v-select v-model="routine.bloques" outlined dense label="Bloques" :items="bloques" style="transform:scale(.8);"></v-select>
            <v-expansion-panels multiple class="pa-3" v-model="panel">
                <v-expansion-panel class="my-1 pa-0" v-for="(day, index) in routine.days" v-bind:key="index">
                    <v-expansion-panel-header class="pl-0">
                        <v-row class="ma-0 mb-1 px-6">
                            <strong>{{day.title}}</strong>
                            <v-spacer/>
                            <v-icon @click="removeDay(index)" small color="#e12826">mdi-close</v-icon>
                        </v-row>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="pa-0">
                        <div style="background:white; border-radius:4px;" class="px-0 pb-2">
                            <v-select v-model="day.muscular_groups" multiple chips outlined dense label="Grupos Musculares" :items="categories" item-text="name" item-value="name" style="transform:scale(.8);"></v-select>
                            <v-text-field v-model="day.duration" outlined dense label="Duración" style="transform:scale(.8);"></v-text-field>

                            <draggable :list="day.exercises_ids" class="list-group" draggable=".item" group="a">
                                <v-divider class="my-4"/>
                                <div v-for="(exercise, index) in day.exercises_ids" :key="index">
                                    <v-card style="background:#eeee;" class="list-group-item item mx-5 my-2 py-1 elevation-0">
                                        <v-card-title class="py-0" style="font-size:12px;">{{exercise.title}}</v-card-title>
                                        <v-text-field v-model="exercise.reps" outlined dense label="Repeticiones" style="transform:scale(.8);"></v-text-field>
                                    </v-card>
                                    <v-divider class="my-4" v-if="multiplos(index+1)"/>
                                </div>

                            </draggable>
                        </div>                    
                </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>





            <v-row class="ma-0">
                <v-spacer/>
                <v-btn @click="addDay" color="black" dark fab class="elevation-0 my-auto" x-small><v-icon>mdi-plus</v-icon></v-btn>
                <v-spacer/>
            </v-row>
        </v-col>

        <v-col cols="9" class="pa-0 pt-3 pr-3" >

            <v-card class="elevation-0 py-4 mt-1">
                <v-chip-group class="mb-4 mx-6">
                    <v-chip small v-if="!filters.categories.length" color="#e12826" dark>Todo</v-chip>
                    <v-chip small @click="filter(category.id)" :dark="isOnFilter(category.id)" :outlined="!isOnFilter(category.id)" :color="chipColor(category.id)" v-for="(category, index) in categories" :key="index">{{category.name}}</v-chip>
                </v-chip-group>
                <v-row class="ma-0">
                    <v-text-field v-model="filters.search" outlined dense label="Buscar..." style="transform:scale(.9); width:250px;"></v-text-field>
                    <v-select v-model="filters.dificult" multiple chips outlined dense style="transform:scale(.9); width:100px;" label="Dificultad"></v-select>
                </v-row>

                <v-row v-if="loading" class="ma-0 py-6 pl-7 pr-5">
                    <v-progress-linear  color="#e12826" indeterminate rounded height="6"></v-progress-linear>
                </v-row>

                

                <div class="ma-4" v-else>
                    <draggable style="height:100%!important;" :list="exercises" class="list-group" draggable=".item" group="a">
                        <v-card style="width:23%; display:inline-block; margin:1%;" class="list-group-item item" v-for="(exercice, index) in exercises" :key="index">
                            <mux-player
                                v-if="exercice.playback_id!=null"
                                stream-type="on-demand"
                                :playback-id="exercice.playback_id"
                                metadata-video-title="Placeholder (optional)"
                                metadata-viewer-user-id="Placeholder (optional)"
                                primary-color="#FFFFFF"
                                secondary-color="#000000">
                            </mux-player>
                            <v-img v-else src="/video404.jpeg" height="105px" ></v-img>
                            <v-card-title style="font-weight:500; font-size:14px; line-height:18px;" class="pt-0 pb-2 my-2">
                                {{exercice.title}}
                            </v-card-title>
                            <v-card-subtitle style="font-weight:500; font-size:12px;" class="pb-1">
                                <strong>Nivel: </strong>{{exercice.difficulty}}
                            </v-card-subtitle>
                        </v-card>
                    </draggable>
                </div>

            </v-card>

            
        </v-col>

        <v-btn @click="save()" bottom color="#e12826" dark fab fixed right>
            <v-icon color="white">  mdi-content-save-outline </v-icon>
        </v-btn> 

        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-row>  
</v-container>
</template>

<script>
import axios from 'axios'
import draggable from 'vuedraggable'
import VueHorizontal from 'vue-horizontal';
export default {
    components: {
        draggable,
        VueHorizontal
    },
    data() {
        return {
            bloques:[2,3,4],
            panel:[],
            snackbar: {
                show: false,
                message: null,
                color: null
            },
            routine:{
                user_id:'',
                bloques:'',
                days:[{
                    title:'Día 1',
                    muscular_groups:'',
                    duration:'',
                }]
            },
            filters:{
                search:'',
                dificult:'',
                categories:[]
            },
            loading:true,
            exercises:[],
            isLoadingClients: false,
            searchClients: null,
            entries:{
                clients: []
            },
        };
    },
    watch:{
        filters:{
            handler(){
                this.getDataFromApi()
            },deep:true
        },
        searchClients(val){
            //if (this.clientsList.length > 0) return
            if (this.isLoadingClients) return
            this.isLoadingClients= true
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/users?filter[name]="+val)
            .then(res => {
                if(this.entries.clients.length>0){
                    this.entries.clients.concat(res.data.data)
                }else{
                    this.entries.clients = res.data.data
                }
            }).finally(() => (this.isLoadingClients = false))
        },
    },
    created(){
        this.getDataFromApi()
        this.$emit("closeDrawer", false);
    },
    computed:{
        clientsList(){
            return this.entries.clients.map(id => {
                return{
                    id:id.id,
                    name:id.name
                }
            })
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user
            }
        },
        categories(){
            return this.$store.state.category.categories
        }
    },
    methods: {
        save(){
            this.routine.user_id = this.currentUser.id
            console.log(this.routine)
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/workout_routines", this.routine).then(res => {
                location.reload()
            })
        },
        multiplos(numero){
            if(numero>0 && (( numero % this.routine.bloques ) == 0)) {
                return true
            }else{
                return false
            }
        },
        filter(category_id){
            var index = this.filters.categories.indexOf(category_id)
            if(index<0){
                this.filters.categories.push(category_id)
            }else{
                this.filters.categories.splice(index, 1)
            }
        },
        getDataFromApi () {
            this.loading = true
            this.apiCall().then(data => {
                this.exercises = data
                this.loading = false
            })
        },
        apiCall () {
            return new Promise((resolve, reject) => {
                var link = ''
                console.log(this.filters)
                if(this.filters.search!=''){
                    link = link + 'filter[title]=' + this.filters.search + '&'
                }
                if(this.filters.search!=''){
                    link = link + 'filter[difficulty]=' + this.filters.dificult + '&'
                }
                if(this.filters.search!=''){
                    link = link + 'filter[categories.id]=' + this.filters.categories + '&'
                }
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/videos?" + link + "&itemsPerPage=" + 20).then(response => {
                    resolve(
                        response.data.data,
                    )
                })
            })
        },
        chipColor(category_id){
            if(this.isOnFilter(category_id)){
                return '#e12826'
            }else{
                return 'grey'
            }
        },
        isOnFilter(category_id){
            if(this.filters.categories.indexOf(category_id)>=0){
                return true
            }else{
                return false
            }
        },
        addDay: function() {
            this.panel = [this.routine.days.length]
            this.routine.days.push({
                title:'Día ' + (this.routine.days.length+1),
                muscular_groups:'',
                duration:'',
                exercises_ids:[],
            })
        },
        removeDay(index) {
            this.routine.days.splice(index, 1);
        },
    }
};
</script>
<style>
    .scroll{
        overflow-y:scroll!important;
        max-height:50vh!important;
        -overflow-scrolling:touch!important;
        -webkit-overflow-scrolling:touch!important;
    }
    .v-text-field__details {
        display: none;
    }
    .v-expansion-panel-content__wrap {
        padding: 0px!important;
    }
    .v-expansion-panel::before {
        box-shadow: none!important;
    }
</style>