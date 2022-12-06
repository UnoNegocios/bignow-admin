<template>
  <v-row class="fill-height pb-12 pt-2 mx-1">
    <v-col>
      <v-sheet height="64">
        <!-- header -->
        <v-toolbar
          flat>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            HOY
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Día</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Semana</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Mes</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn icon class="ml-2">
            <v-icon @click="openFilter">mdi-filter</v-icon>
          </v-btn>
        </v-toolbar>
      </v-sheet>

      <v-sheet height="600">
        <!-- calendario -->
        <v-calendar
          v-if="render"
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
          :event-text-color="getTextEventColor"
        ></v-calendar>
        <!-- Detalle del evento -->
        <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x >
          <v-card flat width="400px">
            <v-toolbar style="margin-bottom:-10px;" class="elevation-0">
              <v-icon :color="selectedEvent.color" class="pr-2"> mdi-account</v-icon>
              <v-toolbar-title color="#3c4043">{{selectedEvent.name}}</v-toolbar-title><!-- #32241c -->
              <v-spacer></v-spacer>
              <v-menu bottom left>
                <template v-slot:activator="{ on, attrs }">
                <v-btn v-show="permissions('editActivities')" icon v-bind="attrs" v-on="on">
                  <v-icon color="#3c4043" small>mdi-dots-vertical</v-icon>
                </v-btn>
                </template>
                <v-list style="font-size:13px;">
                  <v-list-item @click="editItem(selectedEvent.editedItem)">
                    <v-icon small class="mr-2">
                      mdi-pencil
                    </v-icon>
                    Editar
                  </v-list-item>
                  <v-list-item @click="deleteItem(selectedEvent)">
                    <v-icon small class="mr-2">
                      mdi-delete
                    </v-icon>
                    Eliminar
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-btn icon @click="selectedOpen=false">
                <v-icon color="#3c4043" small> mdi-close</v-icon><!-- #32241c -->
              </v-btn>
            </v-toolbar>
            <div class="pt-2 mx-4 mb-0" color="primary">
              <v-icon color="primary" class="mr-2 mb-1">mdi-calendar</v-icon><span style="font-size:15px; color: #1976d1; font-weight: 500;">{{fecha(selectedEvent.start)}}</span>
            </div>
            <div class="pb-1 mx-4 mb-0" color="primary">
              <v-icon color="primary" class="mr-2 mb-1">mdi-clock-outline</v-icon><span style="font-size:15px; color: #1976d1; font-weight: 500;">{{formatAMPM(selectedEvent.start)}}</span>
            </div>
            <v-card-text class="px-6 pt-0" style="color:#3c4043;">
              <div class="py-1"></div>
              <v-divider class="my-4"></v-divider>
              <strong>Detalle: </strong>{{selectedEvent.description}}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="status(selectedEvent.id, selectedEvent.user)" elevation="0" v-if="!selectedEvent.is_completed" style="text-transform:capitalize; letter-spacing:0;" class="px-5 mb-2 mr-2" color="primary">Terminar</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
    <!-- Crear actividad -->
    <v-dialog v-model="createDialog" max-width="700px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn bottom color="#e74919" dark fab fixed right v-bind="attrs" v-on="on">
            <v-icon color="white">  mdi-plus </v-icon>
        </v-btn> 
      </template>
      <create v-bind:user="newActivityUser" @closeCreateDialogCalendar="closeCreateDialogCalendar"/>
    </v-dialog>
    <!-- Editar actividad -->
    <v-dialog v-model="editDialog" max-width="700px">
      <edit v-bind:appointment="appointment" @closeDialogEditCalendar="closeDialogEditCalendar"/>
    </v-dialog>
    <!-- Dialogo confirmación -->
    <div class="text-center">
      <v-bottom-sheet  v-model="sheet" inset>
        <v-sheet class="text-center" height="150px">
          <div class="pt-6">
          ¿Seguro que deseas borrar esta actividad?
          </div>
          <v-btn class="mt-4" text color="error" @click="deleteCalendar()">
          Eliminar
          </v-btn>
          <v-btn class="mt-4" text color="grey" @click="cancel()">
          Cancelar
          </v-btn>
        </v-sheet>
      </v-bottom-sheet>
    </div>
    <!-- Dialogo nueva actividad -->
    <div class="text-center">
      <v-bottom-sheet  v-model="sheet2" inset>
        <v-sheet class="text-center" height="150px">
          <div class="pt-6">
          ¿Quieres agendar otra actividad con este paciente?
          </div>
          <v-btn class="mt-4" text color="error" @click="newActivity()">
          Si
          </v-btn>
          <v-btn class="mt-4" text color="grey" @click="sheet2=false">
          No
          </v-btn>
        </v-sheet>
      </v-bottom-sheet>
    </div>
    <!-- Filtros -->
    <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
        <filterActivities @filtersActivities="filtersActivities"/>
    </v-navigation-drawer>
  </v-row>
</template>
<script>
  import axios from "axios"
  import Filter from "../activities/filter"
  import Create from "../activities/create"
  import Edit from "../activities/edit"
  export default {
    components: {
      'filterActivities':Filter,
      'create':Create,
      'edit':Edit,
    }, 
    data: () => ({
      render:true,
      filters: false,
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Mes',
        week: 'Semana',
        day: 'Día',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      deleteId:'',
      sheet: false,
      appointment:'',
      editDialog: false,
      sheet: false,
      sheet2: false,
      editDialog: false,
      createDialog: false,
      newActivityUser:'',
      start:'',
      end:''
    }),
    watch:{
      currentUser:{
        handler(){
          var start = this.start
          var end = this.end
          this.updateRange({ start, end })
        },deep:true,
      }
    },
    mounted () {
      this.$refs.calendar.checkChange()
    },
    methods: {
      noNewActivity(){
        this.sheet2 = false
        this.newActivityUser = ''
      },
      newActivity(){
        this.sheet2 = false
        this.createDialog=true
      },
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        if(event.is_completed){
          return 'white'
        }else{
          return '#e12826'
        }
      },
      getTextEventColor(event) {
        if(event.is_completed){
          return 'black'
        }else{
          return 'white'
        }
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
        }
        if (this.selectedOpen) {
          this.selectedOpen = false
          requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
          open()
        }
        nativeEvent.stopPropagation()
      },
      updateRange ({ start, end }) {
        this.start = start.date
        this.end = end.date
        if(this.start!=undefined&&this.end!=undefined){
          var link = process.env.VUE_APP_BACKEND_ROUTE + "api/v1/appointments?filter[date_between]=" + this.start + ',' + this.end
          if(localStorage.getItem('filtersActivities')!=null){
            axios.get(link + JSON.parse(localStorage.getItem('filtersActivities'))).then(response => {
              this.events = this.mapCalendar(response.data.data)
            }).catch(error => {
                this.events = []
            })
          }else{
            axios.get(link).then(response => {
              this.events = this.mapCalendar(response.data.data)
            }).catch(error => {
                this.events = []
            })
          }
        }
      },
      mapCalendar(item){
        return item.map(id=>{
          return{
            id: id.id,
            name: id.user.name,
            user:id.user,
            start: new Date(id.date_time),
            end: new Date(id.date_time),
            timed: true,
            description: id.description,
            is_completed: id.is_completed,
            editedItem:this.mapEditedItem([id])
          }
        })
      },
      mapEditedItem(item){
        return item.map(id=>{
          return{
            id:id.id,
            date:id.date,
            time:id.time,
            date_time:id.date_time,
            user_id: this.existId(id.user.id),
            trainer_id: this.existId(id.trainer),
            event_id: this.existId(id.event),
            description:id.description,
            user:id.user
          }
        })[0]
      },
      existId(value){
        if(value!=undefined){
          return value.id
        }
      },
      filtersActivities: function(params) {
        if(this.start!=undefined&&this.end!=undefined){
          var link = process.env.VUE_APP_BACKEND_ROUTE + "api/v1/appointments?filter[date_between]=" + this.start + ',' + this.end
            if(JSON.parse(localStorage.getItem('filtersActivities'))!=null){
              link = link + JSON.parse(localStorage.getItem('filtersActivities'))
            }
            axios.get(link).then(response => {
            this.events = this.mapCalendar(response.data.data)
          }).catch(error => {
              this.events = []
          })
        }
      },
      updateActivities(){
        if(this.start!=undefined&&this.end!=undefined){
          var link = process.env.VUE_APP_BACKEND_ROUTE + "api/v1/appointments?filter[date_between]=" + this.start + ',' + this.end
          if(localStorage.getItem('filtersActivities')!=null){
            axios.get(link + JSON.parse(localStorage.getItem('filtersActivities'))).then(response => {
              this.events = this.mapCalendar(response.data.data)
            }).catch(error => {
                this.events = []
            })
          }else{
            axios.get(link).then(response => {
              this.events = this.mapCalendar(response.data.data)
            }).catch(error => {
                this.events = []
            })
          }
        }
      },
      openFilter(){
        if(this.filters == false){
          this.$emit("closeDrawer", false);
          this.filters = true
        }else{
          this.$emit("closeDrawer", true);
          this.filters = false
        }
      },
      deleteItem (item) {
        this.deleteId = item.id
        this.sheet = true
      },
      editItem(item){
        this.appointment = item
        console.log(this.appointment)
        this.editDialog = true
      },
      formatAMPM(date) {
        var hours = new Date(date).getHours();
        var minutes = new Date(date).getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
      },
      fecha(date){
        var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
        var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
        return diasSemana[new Date(date).getDay()] + ", " + new Date(date).getDate() + " de " + meses[new Date(date).getMonth()] + " de " + new Date(date).getFullYear()
      },
      closeDialogEditCalendar: function(params) {
        this.editDialog = false;
        this.updateActivities()
      },
      closeCreateDialogCalendar: function(params) {
        this.createDialog = false;
        this.updateActivities()
      },
      status(activity_id, user){
        var editedItem={
          id:activity_id,
          is_completed:true,
          last_updated_by_user_id:this.currentUser.id
        }
        this.$nextTick(() => {
          axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/appointments/" + activity_id,Object.assign(editedItem)).then(response=>{
            this.updateActivities()
            this.sheet2 = true
            this.newActivityUser = user
          }).catch(error => {
              this.snackbar = {
                  message: error.response.data.message,
                  color: 'error',
                  show: true
              }
          })
        })
      },
      permissions(permission){
        if(this.currentUser.id==1){
          return true
        }else if(this.currentUser.permissions!=undefined){
          if(this.currentUser.permissions.includes(permission)){
            return true
          }else{
            return false
          }
        }else{
          return false
        }
      },
      deleteCalendar(){
        axios.delete(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/appointments/"+this.deleteId).then(response => {
            this.deleteId = ''
            this.sheet = false
            this.updateActivities()
        }).catch(error => {
            this.snackbar = {
                message: error.response.data.message,
                color: 'error',
                show: true
            }
        });
        },
    },
    computed:{
      currentUser:{
        get(){
          return this.$store.state.currentUser.user;
        }
      },
    }
  }
</script>