<template>
    <v-card class="px-6 py-4">
        <v-row class="ma-0">
            <v-card-title>Subir Video</v-card-title>

        </v-row>
        <v-row class="ma-0 pa-0">
            <v-col cols="6">
                <v-text-field dense outlined v-model="video.title" label="Titulo"></v-text-field>
                <v-textarea dense outlined v-model="video.description" label="Descripción"></v-textarea>
                <v-autocomplete v-model="video.category_ids" :items="categories" item-text="name" item-value="id" multiple small-chips dense outlined label="Categoría(s)"></v-autocomplete>
                <v-select dense outlined label="Dificultad" :items="difficulties" v-model="video.difficulty"/>
            </v-col>
            <v-col cols="6">
                <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" :useCustomSlot="true" v-on:vdropzone-success="uploadSuccess" v-on:vdropzone-error="uploadError" v-on:vdropzone-removed-file="fileRemoved"/>
            </v-col>
        </v-row>
        <v-card-actions>
            <v-spacer/>
            <v-btn text color="grey">Cancelar</v-btn>
            <v-btn text color="primary" @click="save()" :disabled="disableButton||preSave">Guardar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import axios from "axios"
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
export default {
    components: {
        vueDropzone: vue2Dropzone
    }, 
    data(){
        return{
            difficulties:['Principiante', 'Intermedio', 'Avanzado'],
            preSave:false,
            dropzoneOptions: {
                headers:{"Authorization":'Bearer ' + localStorage.getItem("session_token")},
                url: process.env.VUE_APP_BACKEND_ROUTE + "api/v1/video/upload",
                addRemoveLinks: true,
                maxFiles: 1,
                dictDefaultMessage: 'Haz clic aquí o arrastra la(s) imagen(es) a subir.',
                dictFallbackMessage: "Tu navegador no puede subir archivos arrastarndolos a la pantalla.",
                dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
                dictInvalidFileType: "No puede cargar archivos de este tipo.",
                dictCancelUpload: "Cancelar carga",
                dictCancelUploadConfirmation: "Estás seguro de que deseas cancelar esta carga?",
                dictRemoveFile: "Eliminar",
                dictMaxFilesExceeded: "No puedes subir más archivos.",
            },
            video:{
                category_ids:[],
                description:'',
                difficulty:'',
                title:'',
                file_path:''
            },
            colorFile:'black',
            videoUrl:''
        }
    },
    computed:{
        disableButton(){
            if(this.video.category_ids.length<1||this.video.description==''||this.video.difficulty==''||this.video.title==''||this.video.file_path==''){
                return true
            }else{
                return false
            }
        },
        categories(){
            return this.$store.state.category.categories
        }
    },
    methods:{
        save(){
            console.log(this.video)
            this.preSave = true
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/videos", this.video).then(resp=>{
                this.close(this.video.category_ids)
            })
        },
        close(categories){
            this.video = Object.assign({}, this.defaultItem)
            this.$emit("closeCreateDialog", categories);
        },
        uploadSuccess(file, response) {
            console.log(response)
            this.videoUrl = response.file_path
            this.video.file_path = response.file_path
            console.log(this.video)
        },
        uploadError(file, message) {
            this.snackbar = {
                message: 'No se puedo cargar la imagen',
                color: 'error',
                show: true
            }
            this.colorFile = 'error'
        },
        fileRemoved() {
            this.videoUrl = ''
            this.video.file_path = ''
        },
    }
}
</script>

<style>
.dropzone .dz-preview {
    width: calc(100% - 16px - 16px)!important;
}
</style>