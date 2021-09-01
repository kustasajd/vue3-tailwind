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
            Update {{roomReservation.siteZone.friendlyName}}
          </h3>
          <div class="text-center">
            <button
              type="submit"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >
              Update
            </button>
          </div>
        </div>

        <div class="mt-4 mb-3">
          <div
            class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
          >
            <div>
              <div class="mb-4">
                <label
                  class="text-gray-900 font-bold text-lg mb-2"
                  for="client"
                  >Client</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  disabled
                  v-model="roomReservation.client.tradingName"
                />
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
                <div class="text-gray-900 font-bold text-lg mb-2">Rate</div>
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
                  <a-time-picker class="w-full" size="large" @change="onChangeStartTime" format = 'HH:mm' :minuteStep='15' :defaultValue="roomReservation.timeStart"/>
                </div>
              </div>
              <div class="mb-4">
                <label class="text-gray-900 font-bold text-lg mb-2" for="timeStart"
                  >End Time</label
                >
                <div class="mt-1 w-full">
                  <a-time-picker class="w-full" size="large" @change="onChangeEndTime" format = 'HH:mm' :minuteStep='15' :disabledHours="disabledHours" :defaultValue="roomReservation.timeEnd"/>
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
import { useMeta } from 'vue-meta'
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
    const metaData = useMeta({
      title: 'AKARA'
    })
    return {
      dynamicSort,
      getDate,
      toast,
      metaData
    };
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    siteId: null,
    roomReservation: {},
    isModalVisible: false,
    alertContent: "",
    submitted: false,
    zones: [],
    siteZoneRates: [],
  }),
  created() {
    this.siteId = JSON.parse(localStorage.getItem("user")).user.selectedSite.siteId;
    this.roomReservationId = this.$route.params.roomReservationId;
    this.$store.dispatch("roomReservations/getById", { id: this.roomReservationId });
    this.$store.dispatch("roomReservations/getZones", { id: this.siteId });
  },
  watch: {
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
      if (this.submitted === true && this.roomReservation && this.roomReservation.roomReservationId) {
        router.push(`/room-reservation/${this.roomReservation.roomReservationId}`);
      } else if (this.submitted === false && this.roomReservation) {        
        this.checkLoading()
      }
    },
  },
  methods: {
    checkLoading: function () {
      if (this.$store.state.roomReservations.roomReservation.roomReservation && this.$store.state.roomReservations.zones.zones) {
        this.linkItems = this.getLinkItems()
        this.metaData.meta.title = `Update ${this.roomReservation.siteZone.friendlyName} | ${this.roomReservation.siteZone.site.brandName} | AKARA`
        this.initData()
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
        {
          index: 2,
          title: `${this.roomReservation.siteZone.friendlyName}`,
          name: "RoomReservationDetail",
          params: {
            roomReservationId: this.roomReservation.roomReservationId
          },
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
        roomReservationId, chargeRegisterId, clientId, siteZoneId, timeStart, timeEnd, productChargeTypeId, currencyId, calculatedCost, quantity, productId, taxRateId
      } = this.roomReservation;
      if (!clientId || !siteZoneId || !timeStart || !timeEnd || !productId ) {
        this.openAlert("Insert required fields");
      } else {
        this.isLoading = true;
        this.submitted = true;
        this.$store.dispatch("roomReservations/update", {
          roomReservationId: roomReservationId,
          chargeRegisterId: chargeRegisterId,
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
    initData() {
      this.changeSiteZoneId(this.roomReservation.siteZoneId)
      this.roomReservation.productId = this.roomReservation.chargeRegister.productId
      this.roomReservation.quantity = this.roomReservation.chargeRegister.quantity
      this.roomReservation.timestamp = this.roomReservation.timeStart
      this.roomReservation.productChargeTypeId = this.roomReservation.chargeRegister.productChargeTypeId
      let diffMins = moment(new Date(this.roomReservation.timeEnd), 'HH').diff(moment(new Date(this.roomReservation.timeStart), 'HH'), "minutes");
      for(let element of this.siteZoneRates) {
        this.roomReservation.rackRate = element.rackRate
        this.roomReservation.calculatedCost = this.calcCost(diffMins)
        if (this.roomReservation.chargeRegister.productChargeTypeId === element.productChargeTypeId && (this.roomReservation.calculatedCost).toFixed(2) === (this.roomReservation.chargeRegister.rateTotal).toFixed(2)) {
          this.changeSiteZoneRateId(element.siteZoneRateId)
          break
        }
      };
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
        let diffMins = moment(new Date(this.roomReservation.timeEnd), 'HH').diff(moment(new Date(this.roomReservation.timeStart), 'HH'), "minutes");
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
