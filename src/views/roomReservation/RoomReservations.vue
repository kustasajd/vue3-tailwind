<template>
  <div class="h-full">
    <div
      class="h-full my-auto flex items-center justify-center"
      v-if="isLoading"
    >
      <img class="w-20 h-20" src="../../assets/icons/spinner.gif" alt="" />
    </div>
    <div v-if="!isLoading">
      <breadcrumb :linkItems="linkItems" />
      <div class="flex items-center justify-between">
        <h3 class="text-gray-700 text-3xl font-semibold">
          Room Reservations
        </h3>
        <div class="text-center">
          <router-link
            :to="{
              name: 'CreateRoomReservation',
            }"
            class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >Add New Reservation
          </router-link>
        </div>
      </div>
      <div class="flex items-center justify-between border-2 border-gray-600 rounded-md p-3 bg-gray-300 ">
        <span class="text-gray-700 text-xl font-semibold">Filters</span> 
        <div class="text-left w-40">
          <span class="text-gray-700 text-base font-semibold">Future/Past</span> 
          <select-box
            nameField="name"
            valueField="value"
            :options="timeFilterOptions"
            :selectedValue="selectedTime"
            @onSelect="(value) => changeTimeFilter(value)"
          ></select-box>
        </div>
        <div class="text-left w-40">
          <span class="text-gray-700 text-base font-semibold">Zone</span> 
          <select-box
            nameField="friendlyName"
            valueField="siteZoneId"
            :options="zones"
            :selectedValue="selectedZone"
            @onSelect="(value) => changeZoneFilter(value)"
          ></select-box>
        </div>
      </div>
      <div class="mt-2">
        <div class="mt-4">
          <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div
              class="inline-block min-w-full shadow rounded-lg overflow-hidden"
            >
              <table class="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Room
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Client name
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Cost
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Time start
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Time end
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Total time
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in this.filtered" :key="index">
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{item.siteZone.friendlyName}}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{item.client.tradingName}}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{site.currency.symbol}}{{parseFloat(item.chargeRegister.rateTotal).toFixed(2)}}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{getDate(item.timeStart)}}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{formatTime(item.timeStart)}}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{formatTime(item.timeEnd)}}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{getDuration(item.timeStart, item.timeEnd)}} hours
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <router-link
                        :to="{
                          name: 'UpdateRoomReservation',
                          params: { roomReservationId: item.roomReservationId },
                        }"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >Edit
                      </router-link>
                      <router-link
                        :to="{
                          name: 'RoomReservationDetail',
                          params: { roomReservationId: item.roomReservationId },
                        }"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >Detail
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-bind:class="isLoading === true ? 'hidden' : 'block'">
      <div class="mb-4 flex items-center">
        <a-radio-group :options='options' :onChange='this.onChangeZoom' :value='zoom' optionType="button" />
        <a-button-group>
          <a-button :onClick="onPrev">Prev</a-button>
          <a-button :onClick="onNext">Next</a-button>
        </a-button-group>
      </div>
      <DayPilotScheduler id="dp" :config="config" ref="scheduler"/>
    </div>
    
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import moment from 'moment'
import router from "../../router";
import {DayPilot, DayPilotScheduler} from 'daypilot-pro-vue'
import { removeDuplicates, getDate } from "../../helpers/index";
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import SelectBox from "../../components/common/SelectBox.vue";

export default defineComponent({
  components: {
    Breadcrumb,
    SelectBox,
    DayPilotScheduler
  },
  mounted() {
    this.scheduler = this.$refs.scheduler.control
  },
  setup() {
    return { removeDuplicates, getDate }
  },
  data() {
    let self = this
    return {
      isLoading: true,
      linkItems: [],
      site: {},
      roomReservations: [],
      filtered: [],
      timeFilterOptions: [
        { name: "All", value: "all" },
        { name: "Future", value: "future" },
        { name: "Past", value: "past" },
      ],
      selectedTime: "all",
      zones: [{ friendlyName: "All", siteZoneId: "all" }],
      selectedZone: "all",
      curState: 0,
      firstChangeDate: true,
      config: {
        timeHeaders: [
          { groupBy: "Month", format: "MMMM yyyy" },
          { groupBy: "Day", format: "d" },
        ],
        scale: "Day",
        days: DayPilot.Date.today().daysInMonth(),
        startDate: DayPilot.Date.today().firstDayOfMonth(),
        timeRangeSelectedHandling: "Enabled",
        // onTimeRangeSelected: async (args) => {
        //   const dp = args.control;
        //   const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
        //   dp.clearSelection();
        //   if (modal.canceled) { return; }
        //   dp.events.add({
        //     start: args.start,
        //     end: args.end,
        //     id: DayPilot.guid(),
        //     resource: args.resource,
        //     text: modal.result
        //   });
        // },
        eventMoveHandling: "Update",
        onEventMoved: async (args) => {          
          const dp = args.control;
          const modal = await DayPilot.Modal.confirm(
            "Are you sure you want to move this reservation?"
          );
          dp.clearSelection();
          if (modal.canceled) {  
            self.loadEvents();          
            return;
          }
          if (modal.result === "OK") {
            args.control.message("Event moved: " + args.e.text());
            self.updateTime(args.newStart.value, args.newEnd.value, args.e.data.id)
          }
        },
        eventResizeHandling: "Update",
        onEventResized: async(args) => {
          const dp = args.control;
          const modal = await DayPilot.Modal.confirm(
            "Are you sure you want to change the length of time for this meeting?"
          );
          dp.clearSelection();
          if (modal.canceled) {
            self.loadEvents();
            return;
          }
          if (modal.result === "OK") {
            args.control.message("Event resized: " + args.e.text());
            self.updateTime(args.newStart.value, args.newEnd.value, args.e.data.id)
          }
        },
        eventDoubleClickHandling: "Enabled",
        onEventDoubleClick: (args)=> {
          const roomReservationId = args.e.id()
          router.push(`/room-reservation/${roomReservationId}`);
        },
        // eventDeleteHandling: "Update",
        // onEventDeleted: (args) => {
        //   args.control.message("Event deleted: " + args.e.text());
        // },
        eventClickHandling: "Disabled",
        treeEnabled: true,
        zoomPosition: "left",
        zoom: 0,
        zoomLevels: [
          {
            name: "Day",
            properties: {
              scale: "CellDuration",
              cellDuration: 15,
              cellWidth: 40,
              timeHeaders: [
                { groupBy: "Day", format: "dddd MMMM d, yyyy" },
                { groupBy: "Hour" },
                { groupBy: "Cell" },
              ],
              startDate: new Date(),
              days: function () {
                return 1;
              },
            },
          },
          {
            name: "Week",
            properties: {
              scale: "Hour",
              cellWidth: 40,
              timeHeaders: [
                { groupBy: "Month" },
                { groupBy: "Day", format: "dddd d" },
                { groupBy: "Hour" },
              ],
              startDate: new DayPilot.Date(new Date()).firstDayOfWeek(),
              days: function () {
                return 7;
              },
            },
          },
          {
            name: "Month",
            properties: {
              scale: "CellDuration",
              cellDuration: 720,
              cellWidth: 40,
              timeHeaders: [
                { groupBy: "Month" },
                { groupBy: "Day", format: "ddd d" },
                { groupBy: "Cell", format: "tt" },
              ],
              startDate: new DayPilot.Date(new Date()).firstDayOfMonth(),
              days: function (args) {
                return args.date.daysInMonth();
              },
            },
          },
          
        ],
      },
      zoom: 0,
      options: [
        { label: "Day", value: 0 },
        { label: "Week", value: 1 },
        { label: "Month", value: 2 },
      ],
    };
  },  
  created() {
    this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
    this.$store.dispatch("roomReservations/getAll", { id: this.site.siteId });    
  },
  watch: {
    "$store.state.roomReservations.all": {
      deep: true,
      handler: function () {
        this.roomReservations = this.$store.state.roomReservations.all.items;
        if (this.roomReservations) {
          this.roomReservations.forEach(element => {
            this.zones.push(element.siteZone)
          });
          this.zones = this.removeDuplicates(this.zones, 'siteZoneId')
          this.filtered = this.roomReservations
          this.checkLoading()
        }
      },
    },
  },
  methods: {
    checkLoading: function () {
      if (this.$store.state.roomReservations.all.items) {
        this.linkItems = this.getLinkItems()
        this.loadResources();
        this.loadEvents();
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: "Room Reservations",
          name: "RoomReservations",
          params: null,
        },
      ];
    },
    updateTime (timeStart, timeEnd, roomReservationId) {
      this.$store.dispatch("roomReservations/updateTime", {
        roomReservationId: roomReservationId,
        timeStart: timeStart,
        timeEnd: timeEnd
      });
    },
    formatTime (date) {
      if (date) {
        return moment(date).format('HH:mm')
      } else {
        return '-'
      }
    },
    getDuration (start, end) {
      const startTime = new Date(start)
      const endTime = new Date(end)
      let diffMins = moment(endTime, 'HH').diff(moment(startTime, 'HH'), "minutes");
      return (diffMins/60).toFixed(1)
    },
    changeTimeFilter (value) {
      this.selectedTime = value
      this.filter()
    },
    changeZoneFilter (value) {
      this.selectedZone = value
      this.filter()
    },
    filter () {
      if (this.selectedZone === 'all' && this.selectedTime === 'all') 
        this.filtered = this.roomReservations
      else if (this.selectedZone === 'all' && this.selectedTime !=='all') {
        if (this.selectedTime === 'past') {
          this.filtered = this.roomReservations.filter(item => { 
            return moment(new Date(item.timeStart), 'HH').diff(moment(new Date(), 'HH'), "minutes") < 0
          })
        } else if(this.selectedTime === 'future') {
          this.filtered = this.roomReservations.filter(item => { 
            return moment(new Date(item.timeStart), 'HH').diff(moment(new Date(), 'HH'), "minutes") > 0
          })
        }
      } else if (this.selectedZone !== 'all' && this.selectedTime === 'all') {
        this.filtered = this.roomReservations.filter(item => {
          return item.siteZone.siteZoneId === parseInt(this.selectedZone)
        })
      } else {
        this.filtered = this.roomReservations.filter(item => {
          return item.siteZone.siteZoneId === parseInt(this.selectedZone)
        })
        if (this.selectedTime === 'past') {
          this.filtered = this.filtered.filter(item => { 
            return moment(new Date(item.timeStart), 'HH').diff(moment(new Date(), 'HH'), "minutes") < 0
          })
        } else if(this.selectedTime === 'future') {
          this.filtered = this.filtered.filter(item => { 
            return moment(new Date(item.timeStart), 'HH').diff(moment(new Date(), 'HH'), "minutes") > 0
          })
        }
      }
    },
    loadEvents() {
      let events = []
      this.roomReservations.forEach(element => {
        events.push({
          id: element.roomReservationId,
          start: new DayPilot.Date(moment(element.timeStart).format('YYYY-MM-DD HH:mm:ss')).toString(),
          end: new DayPilot.Date(moment(element.timeEnd).format('YYYY-MM-DD HH:mm:ss')).toString(),
          text: `${element.client.tradingName}`,
          resource: element.siteZone.siteZoneId,
          backColor: "#058",
          barColor: '#00FA9A',
          height: 60
        })
      });
      this.config.events = events;
    },
    loadResources() {
      let resources = []
      for (let i=1;i<this.zones.length;i++) {
        resources.push({
          name: `${this.zones[i].friendlyName}`,
          id: this.zones[i].siteZoneId
        })
      }
      this.config.resources = resources;
    },
    onChangeZoom(e) {
      this.zoom = e.target.value
      this.config.zoom = this.zoom
      this.curState = 0
    },
    onPrev() {
      this.curState++
      const startdate = this.config.zoomLevels[this.zoom].properties.startDate
      if (this.zoom === 2) {
        let newdate = this.getNewDate(startdate, this.curState-1)
        this.config.zoomLevels[this.zoom].properties.startDate = new DayPilot.Date(new Date(newdate)).firstDayOfMonth();
        this.config.zoomLevels[this.zoom].properties.days = new DayPilot.Date(new Date(newdate)).daysInMonth();
      } else if(this.zoom === 1) {
        let newdate = this.getNewDate(startdate, this.curState)
        this.config.zoomLevels[this.zoom].properties.startDate = new DayPilot.Date(new Date(newdate)).firstDayOfWeek();
      } else if(this.zoom === 0) {
        let newdate
        if (this.firstChangeDate === true) {
          newdate = this.getNewDate(startdate, 0)
          this.firstChangeDate = false
        } else {
          newdate = this.getNewDate(startdate, 1)
        }
        this.config.zoomLevels[this.zoom].properties.startDate = new Date(newdate);
      }
    },
    onNext() {
      this.curState--
      const startdate = this.config.zoomLevels[this.zoom].properties.startDate
      if (this.zoom === 2) {
        let newdate = this.getNewDate(startdate, this.curState-1)
        this.config.zoomLevels[this.zoom].properties.startDate = new DayPilot.Date(new Date(newdate)).firstDayOfMonth();
        this.config.zoomLevels[this.zoom].properties.days = new DayPilot.Date(new Date(newdate)).daysInMonth();
      } else if(this.zoom === 1) {
        let newdate = this.getNewDate(startdate, this.curState)
        this.config.zoomLevels[this.zoom].properties.startDate = new DayPilot.Date(new Date(newdate)).firstDayOfWeek();
      } else if(this.zoom === 0) {
        let newdate
        if (this.firstChangeDate === true)  {
          newdate = this.getNewDate(startdate, -2)
          this.firstChangeDate = false
        } else {
          newdate = this.getNewDate(startdate, -1)
        }
        this.config.zoomLevels[this.zoom].properties.startDate = new Date(newdate);
      }
    },
    getNewDate(startdate, index) {
      switch(this.zoom) {
        case 0:
          return moment(startdate).subtract(index, 'days').format('DD MMM YYYY');
        case 1:
          return moment(startdate).subtract(index*7, 'days').format('DD MMM YYYY');
        case 2:
          return moment(startdate).subtract(index, 'months').format('MMM YYYY');
        case 3:
          return moment(startdate).subtract(index, 'years').format('YYYY');
      }
    },
  },
});
</script>
<style lang="scss">
.scheduler_default_corner {
  div {
    display: none !important;
  }
}
.scheduler_default_event_inner {
  color: white !important;
}
</style>
