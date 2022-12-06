<template>
    <v-container>
        <div>
            <v-row class="ma-0 px-6">
                <v-card-title>{{categoryName}}</v-card-title>
                <v-divider class="mx-12 my-12"></v-divider>
            </v-row>
            <v-row class="ma-0">
                <v-row v-if="loading" class="ma-0 py-6 pl-7 pr-5">
                    <v-progress-linear color="#e12826" indeterminate rounded height="6"></v-progress-linear>
                </v-row>
                <v-col v-else cols="3" v-for="(video, index) in videos" :key="index">
                    <v-card class="elevation-0">
                        <mux-player
                                v-if="video.permalink!=null"
                                stream-type="on-demand"
                                playback-id="P00VAEPLdXgy00Sj7eurG33tlRIKpU3ACiPsALFYFVHhY"
                                metadata-video-title="Placeholder (optional)"
                                metadata-viewer-user-id="Placeholder (optional)"
                                primary-color="#FFFFFF"
                                secondary-color="#000000">
                            </mux-player>
                            <v-img v-else src="/video404.jpeg" height="105px" ></v-img>
                        <v-card-subtitle style="font-weight:500;">
                            {{video.title}}
                        </v-card-subtitle>
                    </v-card>
                </v-col>
            </v-row>
        </div>
        
    </v-container>
</template>

<script>
import axios from "axios"
export default {
    data(){
        return{
            videos:[],
            loading:true
        }
    },
    computed:{
        categoryName(){
            return this.$store.state.category.categories.filter(category=>category.id == this.$route.params.id).map(category=>category.name)[0]
        }
    },
    created(){
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/videos?itemsPerPage=999&filter[categories.id]=" +  this.$route.params.id).then(response => {
            this.videos = response.data.data
            this.loading = false
        })
    }
}
</script>