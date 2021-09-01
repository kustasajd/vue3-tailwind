<template>
  <div class="h-full">
    <div
      class="h-full my-auto flex items-center justify-center"
      v-if="isLoading"
    >
      <img class="w-20 h-20" src="../../assets/icons/spinner.gif" alt="" />
    </div>
    <div class="mt-8" v-if="!isLoading">
      <div id="element-to-print">
        <h3 class="text-gray-700 text-3xl font-semibold -mt-12">Site Property Report<br>{{ formatHeaderDate(selectedDate) }}</h3>
        <div class="flex items-center justify-between">
          <div class="text-center">
            <a-month-picker class="w-full" size="large" @change="onChangeDate" :defaultValue="formatDate(selectedDate)" picker="month" />
          </div>
        </div>
        <!-- Zones -->
        <div class="mt-8">
          <h3 class="text-gray-700 text-3xl font-medium">Zones</h3>
          <div class="mt-4 mb-3">
            <div
              class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4"
            >
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Total Number of zones</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ zones.length }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Total number of zones with active licences</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ zonesWithActiveLicenceNum }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- WorkStations -->
        <div class="mt-8">
          <h3 class="text-gray-700 text-3xl font-medium">Workstations</h3>
          <div class="mt-4 mb-3">
            <div
              class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4"
            >
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Total number of workstations</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ totalWorkstationsNum }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Total number of workstations for zones with active licences</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ workstationWithActiveLicenceNum }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Licences -->
        <div class="mt-8 pb-8">
          <h3 class="text-gray-700 text-3xl font-medium">Licences</h3>
          <div class="mt-4 mb-3">
            <div
              class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4"
            >              
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">New licences starting</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ startingLicenceNum }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Licences that have given notice to terminate</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ terminatedLicenceNum }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Active licences</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  {{ licences.length }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>      
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import moment from "moment";
import SelectBox from "../../components/common/SelectBox.vue";
import { getDate, dynamicSort, removeDuplicates } from "../../helpers/index";

export default defineComponent({
  components: {
    SelectBox
  },
  data: () => ({
    isLoading: true,
    siteId: {},
    selectedDate: moment().format("YYYY-MM-DD"),
    licences: [],
    startingLicenceNum: 0,
    terminatedLicenceNum: 0,
    zones: [],
    zonesWithActiveLicenceNum: 0,
    totalWorkstationsNum: 0,
    workstationWithActiveLicenceNum: 0,
  }),
  setup() {
    return {
      getDate,
      dynamicSort,
      removeDuplicates
    };
  },
  created() {
    this.siteId = JSON.parse(localStorage.getItem("user")).user.selectedSite.siteId;
    this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
    this.$store.dispatch("reports/getLicences", {
      id: this.siteId,
    });
    this.$store.dispatch("reports/getZones", { id: this.siteId });
  },
  watch: {
    "$store.state.reports.licences": function () {
      this.licences = this.$store.state.reports.licences.licences;      
      if (this.licences) {
        this.getLicenceData();     
        this.checkLoading();
      }
    },
    "$store.state.reports.zones": function () {
      this.zones = this.$store.state.reports.zones.zones;
      if (this.zones) {
        this.zones.forEach(zone => {
          zone.licenceZonesWithAcitveLicence = zone.licenceZones.filter(licenceZone => {
            return licenceZone.licence.active === true
          });
          zone.licenceZonesWithInAcitveLicence = zone.licenceZones.filter(licenceZone => {
            return licenceZone.licence.active === false
          });
        });
        this.getZoneData()
        this.checkLoading();
      }
    },
    
  },
  methods: {
    checkLoading: function () {
      if (
        this.$store.state.reports.licences.licences &&
        this.$store.state.reports.zones.zones
      ) {
        this.isLoading = false;
      }
    },
    formatDate: function(date) {
      return moment(date).format('YYYY-MM-DD')
    },
    formatHeaderDate: function(date) {
      return moment(date).format('MMMM YYYY')
    },
    onChangeDate(date, dateString) {
      this.selectedDate = dateString
      this.getLicenceData()
      this.getZoneData()
    },
    getLicenceData: function () {
      this.startingLicenceNum = 0
      this.terminatedLicenceNum = 0
      this.licences.forEach((licence) => {
        if (licence.licenceStart && moment(licence.validUntil).format("YYYY-MM") === moment(this.selectedDate).format("YYYY-MM")) {
          this.startingLicenceNum++
        }
        if (licence.terminationDate && moment(licence.terminationDate).format("YYYY-MM") === moment(this.selectedDate).format("YYYY-MM")) {
          if(licence.licenceStatusTypeId === 12) {
            this.terminatedLicenceNum++
          }
        }
      });
      
    },   
    getZoneData: function () {
      //get zone data
      this.zonesWithActiveLicenceNum = 0
      this.workstationWithActiveLicenceNum = 0
      this.totalWorkstationsNum = 0
      this.zones.forEach(zone => {
        if (zone.licenceZonesWithAcitveLicence.length > 0) {
          this.zonesWithActiveLicenceNum ++
          // get workstations data
          this.workstationWithActiveLicenceNum += zone.workstations
        }
        // get workstations data
        this.totalWorkstationsNum += zone.workstations
      });
    },
  },
});
</script>
