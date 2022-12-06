<template>
    <v-container>
        <div v-for="(category, index) in categories" :key="index">
            <v-row class="ma-0 px-6">
                <v-card-title>{{category.name}}</v-card-title>
                <v-divider class="mx-12 my-12"></v-divider>
                <v-btn text class="mt-7" color="#e12826" :to="'/videos/' + category.id">VER MÁS</v-btn>
            </v-row>
            <v-row class="ma-0">
                <v-row v-if="videos_by_categories[index].videos == undefined" class="ma-0 py-6 pl-7 pr-5">
                    <v-progress-linear  color="#e12826" indeterminate rounded height="6">{{apiCall(category.id)}}</v-progress-linear>
                </v-row>
                <v-col v-else cols="3" v-for="(video, index) in getVideos(category.id)" :key="index">
                    <v-card class="elevation-0">
                        <mux-player
                            v-if="video.playback_id!=null"
                            stream-type="on-demand"
                            :playback-id="video.playback_id"
                            metadata-video-title="Placeholder (optional)"
                            metadata-viewer-user-id="Placeholder (optional)"
                            primary-color="#FFFFFF"
                            secondary-color="#000000">
                        </mux-player>
                        <v-img v-else src="/video404.jpeg" height="105px" ></v-img>
                        <v-card-title style="font-weight:500;" class="pt-1">
                            {{video.title}}
                        </v-card-title>
                        <v-card-subtitle style="font-weight:500; font-size:12px;">
                            <strong>Nivel: </strong>{{video.difficulty}}
                        </v-card-subtitle>
                    </v-card>
                </v-col>
            </v-row>
        </div>

        <v-dialog v-model="createDialog" width="800">
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" bottom color="#e12826" dark fab fixed right>
                    <v-icon color="white">  mdi-plus </v-icon>
                </v-btn> 
            </template>
            <v-card>
                <create @closeCreateDialog="closeCreateDialog"/>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
import Create from "./create.vue"
import axios from "axios"
export default {
    components:{
        create:Create
    },
    data(){
        return{
            createDialog:false,
            videos_by_categories:[{category_id:'', videos:undefined}]
        }
    },
    computed:{
        categories(){
            var categories = this.$store.state.category.categories
            this.videos_by_categories = categories.map(id=>{return{
                category_id: id.id,
                category_name: id.name,
                videos: undefined
            }})
            return categories
        }
    },
    methods:{
        getVideos(category_id){
            return this.videos_by_categories.filter(category=>category.category_id == category_id).map(category=>category.videos)[0]
        },
        apiCall (category_id) {
            return new Promise((resolve, reject) => {
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/videos?itemsPerPage=4&filter[categories.id]=" + category_id).then(response => {
                    this.videos_by_categories.filter(category=>category.category_id == category_id)[0].videos = response.data.data
                })
            })
        },
        closeCreateDialog: function(categories) {
            this.createDialog = false;
            for(var i=0; i<categories.length; i++){
                this.videos_by_categories.filter(category=>category.id == categories[i])[0] = ''
                this.apiCall(categories[i])
            }
        },
    }
}
</script>

<style>

</style>