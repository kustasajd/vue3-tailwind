<template>
  <div class="h-full">
    <alert-form
      :isModalVisible="isModalVisible"
      :alertContent="alertContent"
      @onClose="() => onClose()"
    ></alert-form>
    <div
      class="h-full my-auto flex items-center justify-center"
      v-if="isLoading"
    >
      <img class="w-20 h-20" src="../../assets/icons/spinner.gif" alt="" />
    </div>
    <div v-if="!isLoading">
      <breadcrumb :linkItems="linkItems" />
      <!-- Room Reservation Detail -->
      <form @submit.prevent="handleSubmit">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">
            Add New Reservation
          </h3>
          <div class="text-center">
            <button
              type="submit"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >
              Create
            </button>
          </div>
        </div>

        <div class="mt-4 mb-3">
          <div
            class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
          >
            <div>
              <div class="mb-4">
                <div class="text-gray-900 font-bold text-lg mb-2">Client</div>
                <div class="text-center">
                  <select-box
                    nameField="tradingName"
                    valueField="clientId"
                    :options="clients"
                    :selectedValue="roomReservation.clientId"
                    @onSelect="(value) => changeClientId(value)"
                  ></select-box>
                </div>
              </div>
              <div class="mb-4">
                <div class="text-gray-900 font-bold text-lg mb-2">Zone</div>
                <select-box
                  nameField="zoneTypeName"
                  valueField="siteZoneId"
                  :options="zones"
                  :selectedValue="roomReservation.siteZoneId"
                  @onSelect="(value) => changeSiteZoneId(value)"
                ></select-box>
              </div>
              <div class="mb-4">
                <div class="text-gray-900 font-bold text-lg mb-2">Zone Rate</div>
                <select-box
                  nameField="name"
                  valueField="siteZoneRateId"
                  :options="siteZoneRates"
                  :selectedValue="roomReservation.siteZoneRateId"
                  @onSelect="(value) => changeSiteZoneRateId(value)"
                ></select-box>
              </div>
              <div class="mb-4">
                <label class="text-gray-900 font-bold text-lg mb-2" for="timestamp"
                  >Date</label
                >
                <div class="mt-1 w-full">
                  <a-date-picker class="w-full" size="large" @change="onChangeAddedTime" :defaultValue="getDate(roomReservation.timestamp)"/>
                </div>
              </div>
              <div class="mb-4">
                <label class="text-gray-900 font-bold text-lg mb-2" for="timeStart"
                  >Start Time</label
                >
                <div class="mt-1 w-full">
                  <a-time-picker class="w-full" size="large" @change="onChangeStartTime" format = 'HH:mm' :minuteStep='15'/>
                </div>
              </div>
              <div class="mb-4">
                <label class="text-gray-900 font-bold text-lg mb-2" for="timeStart"
                  >End Time</label
                >
                <div class="mt-1 w-full">
                  <a-time-picker class="w-full" size="large" @change="onChangeEndTime" format = 'HH:mm' :minuteStep='15' :disabledHours="disabledHours"/>
                </div>
              </div>
              <div class="mb-4">
                <label
                  class="text-gray-900 font-bold text-lg mb-2"
                  for="calculatedCost"
                  >Calculated Cost </label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="number"
                  step="0.01"
                  v-model="roomReservation.calculatedCost"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import moment from 'moment'
import { useToast } from "vue-toastification";
import { dynamicSort, getDate } from "../../helpers/index";
import router from "../../router";
import AlertForm from "../../components/modals/AlertForm.vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import SelectBox from "../../components/common/SelectBox.vue";

export default defineComponent({
  components: {
    AlertForm,
    Breadcrumb,
    SelectBox
  },
  setup() {
    const toast = useToast();
    return {
      dynamicSort,
      getDate,
      toast
    };
  },
  data: () => ({
    isLoading: true,
    user: {},
    linkItems: [],
    siteId: null,
    roomReservation: {
      timestamp: new Date()
    },
    isModalVisible: false,
    alertContent: "",
    clients: [],
    zones: [],
    siteZoneRates: [],
  }),
  created() {
    this.siteId = JSON.parse(localStorage.getItem("user")).user.selectedSite.siteId;
    this.$store.dispatch("clients/getAll", { id: this.siteId });
    this.$store.dispatch("roomReservations/getZones", { id: this.siteId });
  },
  watch: {
    "$store.state.clients.all": function () {
      this.clients = this.$store.state.clients.all.items;
      if (this.clients) {
        this.clients = this.clients.sort(this.dynamicSort("tradingName"));
        this.checkLoading();
      }
    },
    "$store.state.roomReservations.zones": function () {
      this.zones = this.$store.state.roomReservations.zones.zones;
      if (this.zones) {
        this.zones = this.zones.filter(zone => { return zone.zoneTypeId === 4 || zone.zoneTypeId === 5 })
        this.zones.forEach((zone) => {
          zone.zoneTypeName =
            zone.friendlyName + ' - ' + zone.zoneType.name;
        });
        this.zones = this.zones.sort(this.dynamicSort("zoneTypeName"));
        this.checkLoading();
      }
    },
    "$store.state.roomReservations.roomReservation": function () {
      this.roomReservation = this.$store.state.roomReservations.roomReservation.roomReservation;
      if (this.roomReservation && this.roomReservation.roomReservationId) {
        router.push(`/room-reservation/${this.roomReservation.roomReservationId}`);
      }
    },
  },
  methods: {
    checkLoading: function () {
      if (this.$store.state.clients.all.items && this.$store.state.roomReservations.zones.zones) {
        this.linkItems = this.getLinkItems()
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
    handleSubmit(e) {
      const date = moment(this.roomReservation.timestamp).format("YYYY-MM-DD")
      const startTime = date + ' ' + moment(this.roomReservation.timeStart).format("HH:mm")
      const endTime =  date + ' ' + moment(this.roomReservation.timeEnd).format("HH:mm")
      this.roomReservation.timeStart = new Date(startTime)
      this.roomReservation.timeEnd = new Date(endTime)
      const {
        clientId, siteZoneId, timeStart, timeEnd, productChargeTypeId, currencyId, calculatedCost, quantity, productId, taxRateId
      } = this.roomReservation;
      if (!clientId || !siteZoneId || !timeStart || !timeEnd || !productId ) {
        this.openAlert("Insert required fields");
      } else {
        this.isLoading = true;
        this.$store.dispatch("roomReservations/create", {
          clientId: clientId,
          siteZoneId: siteZoneId,
          timeStart: timeStart,
          timeEnd: timeEnd,
          productChargeTypeId: productChargeTypeId,
          siteId: this.siteId,
          currencyId: currencyId,
          quantity: quantity,
          rateTotal: calculatedCost,
          productId: productId,
          taxRateId: taxRateId || 0
        });
      }
    },
    changeClientId: function (value) {
      this.roomReservation.clientId = value;
    },
    changeSiteZoneId(value) {
      const siteZone = (this.zones.find(zone => { return zone.siteZoneId === parseInt(value) }))
      if (siteZone.zoneTypeId === 4) this.roomReservation.productId = 9
      else if (siteZone.zoneTypeId === 5) this.roomReservation.productId = 6
      this.siteZoneRates = siteZone.siteZoneRates || []
      this.siteZoneRates.forEach(siteZoneRate => {
        siteZoneRate.name = `${siteZone.site.currency.symbol}${siteZoneRate.rackRate} ${siteZoneRate.productChargeType.type}`
      });
      this.roomReservation.siteZoneId = value;
      this.roomReservation.currencyId = siteZone.site.currency.currencyId
    },
    changeSiteZoneRateId(value) {
      this.roomReservation.siteZoneRateId = value
      this.roomReservation.productChargeTypeId = (this.siteZoneRates.find(item => item.siteZoneRateId === parseInt(value))).productChargeType.productChargeTypeId
      this.roomReservation.rackRate = (this.siteZoneRates.find(item => item.siteZoneRateId === parseInt(value))).rackRate
      this.roomReservation.taxRateId = (this.siteZoneRates.find(item => item.siteZoneRateId === parseInt(value))).taxRateId
      if (this.roomReservation.timeStart && this.roomReservation.timeEnd) {
        let diffMins = moment(this.roomReservation.timeEnd, 'HH').diff(moment(this.roomReservation.timeStart, 'HH'), "minutes");
        this.roomReservation.calculatedCost = this.calcCost(diffMins)
      }
    },
    onChangeAddedTime(date, dateString) {
      this.roomReservation.timestamp = date._d
    },
    onChangeStartTime(date, dateString) {
      this.roomReservation.timeStart = date._d
    },
    onChangeEndTime(date, dateString) {
      let diffMins = moment(date._d, 'HH').diff(moment(this.roomReservation.timeStart, 'HH'), "minutes");
      this.roomReservation.quantity = diffMins/60
      
      this.roomReservation.timeEnd = date._d
      this.roomReservation.calculatedCost = this.calcCost(diffMins)
        
    },
    calcCost(diffMins) {
      switch (this.roomReservation.productChargeTypeId) {
        case 2:
          return this.roomReservation.rackRate/8/30*diffMins/60
        case 3:
          return this.roomReservation.rackRate/8/7*diffMins/60
        case 4:
          return this.roomReservation.rackRate/8*diffMins/60
        case 5:
          return this.roomReservation.rackRate/4*diffMins/60
        case 6:
          return this.roomReservation.rackRate/1*diffMins/60
        default:
          return this.roomReservation.rackRate
      }
    },
    disabledHours() {
      const start = this.roomReservation.timeStart
      let hours = [];
      for (let i = 0; i < moment(start, 'HH').hour(); i++) {
        hours.push(i);
      }
      return hours;
    },
    onClose() {
      this.isModalVisible = false;
      this.alertContent = "";
    },
    openAlert(value) {
      this.alertContent = value;
      this.isModalVisible = true;
      return;
    },
  },
});
</script>
