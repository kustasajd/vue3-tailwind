<template>
  <div class="h-full">
    <div
      class="h-full my-auto flex items-center justify-center"
      v-if="isLoading"
    >
      <img class="w-20 h-20" src="../../assets/icons/spinner.gif" alt="" />
    </div>
    <div v-if="!isLoading">
      <!-- Licences -->
      <div class="">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">Licences</h3>
        </div>
        <div class="flex items-center justify-between border-2 border-gray-600 rounded-md p-3 bg-gray-300 ">
          <span class="text-gray-700 text-xl font-semibold">Filters</span> 
          <div class="text-left w-40">
            <span class="text-gray-700 text-base font-semibold">Licence StatusType</span> 
            <select-box
              nameField="name"
              valueField="licenceStatusTypeId"
              :options="licenceStatusTypes"
              :selectedValue="licenceStatusTypeId"
              @onSelect="(value) => change(value)"
            ></select-box>
          </div>
          <div class="text-left w-40">
            <span class="text-gray-700 text-base font-semibold">Licence Type</span> 
              <select-box
              nameField="name"
              valueField="licenceTypeId"
              :options="licenceTypes"
              :selectedValue="licenceTypeId"
              @onSelect="(value) => changeLicenceTypeFilter(value)"
            ></select-box>
          </div>
          <div class="text-left">
            <span class="text-gray-700 text-base font-semibold">Sort</span> 
            <select-box
              nameField="name"
              valueField="value"
              :options="sortList"
              :selectedValue="sortProperty"
              @onSelect="(value) => changeSortProperty(value)"
            ></select-box>
          </div>
        </div>
        <div class="mt-6">
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
                      ID &amp; Client
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      expiry date
                    </th>                        
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      term
                    </th>                        
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Invoicing Day
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Payment Terms
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Zones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(licence, index) in filtered" :key="index">
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm" :class="[licence.isRed === true ? isRed : '']"
                    >
                      <router-link
                        :to="{
                          name: 'LicenceDetail',
                          params: { licenceId: licence.licenceId },
                        }"
                        class="whitespace-no-wrap font-semibold text-blue-700 hover:text-gray-700 text-base"
                        >#{{ licence.licenceId }} - {{ licence.client.tradingName }}
                      </router-link>
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ licence.licenceType.name }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm" :style="{'background': licence.licenceStatusType.color}"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ licence.licenceStatusType.name }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm" :class="[licence.isRed === true ? isRed : '']"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ (licence.validUntil) ? getDate(licence.validUntil) : '-' }}
                      <br />
                        <span class="italic">({{ getDaysDiff(licence.validUntil) }})</span>
                      </p>
                    </td>                         
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm" :class="[licence.isRed === true ? isRed : '']"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ licence.term ? licence.term+' months' : '-' }}
                      </p>
                    </td>                         
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm" :class="[licence.isRed === true ? isRed : '']"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ licence.invoicingDay }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm" :class="[licence.isRed === true ? isRed : '']"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ licence.paymentTermsDaysFromInvoice }} days
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm" :class="[licence.isRed === true ? isRed : '']"
                    >
                      <span class="text-gray-900 whitespace-no-wrap">
                        <div v-for="(licenceZone, i) in licence.licenceZones" :key="i">
                          {{licenceZone.siteZone.zoneType.name}} - {{licenceZone.siteZone.friendlyName}}
                        </div>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
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
import { getDate, dynamicSort, dynamicSortDec, getDaysDiffFromNow } from "../../helpers/index";

export default defineComponent({
  components: {
    SelectBox
  },
  data: () => ({
    isLoading: true,
    user: {},
    linkItems: [],
    licences: [],
    licenceStatusTypes: [],
    licenceTypes: [],
    licenceStatusTypeId: 'all',
    licenceTypeId: 'all',
    filtered: [],
    sortList: [
      { name: 'Licence ID', value: 'licenceId' },
      { name: 'Client ASC', value: 'client' },
      { name: 'Expiry Date DESC', value: 'expiryDesc' },
      { name: 'Expiry Date ASC', value: 'expiryAsc' }
    ],
    sortProperty: 'licenceId'
  }),
  setup() {
    const isRed = ref(
      "bg-yellow-500 text-white-600"
    );
    return {
      getDate,
      dynamicSort,
      dynamicSortDec,
      getDaysDiffFromNow,
      isRed,
    };
  },
  created() {
    this.siteId = JSON.parse(localStorage.getItem("user")).user.selectedSite.siteId;
    this.clientId = this.$route.params.clientId;
    this.$store.dispatch("licences/getLicenceBySite", {
      id: this.siteId,
    });
    this.$store.dispatch("licences/getLicenceStatusType");
    this.$store.dispatch("licences/getLicenceType");   
  },
  watch: {
    "$store.state.licences.licences": function () {
      this.licences = this.$store.state.licences.licences.licences;
      if (this.licences) {
        this.licences.forEach(licence => {
          if (licence.validUntil) {
            let now = moment().format("YYYY-MM-DD");
            let validUntil = moment(licence.validUntil).format("YYYY-MM-DD");
            let diff = moment(validUntil).diff(moment(now), 'months')
            if (diff >= 3) {
              licence.isRed = false
            } else {
              licence.isRed = true
            }
          } else {
            licence.isRed = false
          }
          if (licence.validUntil && licence.licenceStart) {
            let licenceStart = moment(licence.licenceStart).format("YYYY-MM-DD");
            let validUntil = moment(licence.validUntil).format("YYYY-MM-DD");
            licence.term = moment(validUntil).diff(moment(licenceStart), 'months') + 1
          }
          licence.tradingName = licence.client.tradingName
          licence.daysDiff = this.getDaysDiffFromNow(licence.validUntil)
        });
        this.filtered = this.licences
        this.checkLoading();
      }
    },
    "$store.state.licences.licenceStatusTypes": function () {
      this.licenceStatusTypes = this.$store.state.licences.licenceStatusTypes.licenceStatusTypes;
      if (this.licenceStatusTypes) {
        this.licenceStatusTypes = [{
          licenceStatusTypeId: 'all',
          name: 'All'
        }].concat(this.licenceStatusTypes)
        this.checkLoading();
      }
    },
    "$store.state.licences.licenceTypes": function () {
      this.licenceTypes = this.$store.state.licences.licenceTypes.licenceTypes;
      if (this.licenceTypes) {
        this.licenceTypes = [{
          licenceTypeId: "all",
          name: "All"
        }].concat(this.licenceTypes)
        this.checkLoading();
      }
    },
  },
  methods: {
    checkLoading: function () {
      if (
        this.$store.state.licences.licences.licences &&
        this.$store.state.licences.licenceStatusTypes.licenceStatusTypes && 
        this.$store.state.licences.licenceTypes.licenceTypes
      ) {
        this.linkItems = this.getLinkItems();
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: "Licences",
          name: "Licences",
          params: null,
        },
      ];
    },
    change: function (value) {
      this.licenceStatusTypeId = value
      this.filter()
      this.changeSortProperty(this.sortProperty)
    },
    changeLicenceTypeFilter: function (value) {
      this.licenceTypeId = value
      this.filter()
      this.changeSortProperty(this.sortProperty)
    },
    filter: function () {
      const {licenceStatusTypeId, licenceTypeId} = this
      this.filtered = []
      if (licenceStatusTypeId !== 'all' && licenceTypeId !== 'all') {
        this.filtered = this.licences.filter(item=> {return parseInt(item.licenceStatusTypeId) === parseInt(licenceStatusTypeId) && parseInt(item.licenceTypeId) === parseInt(licenceTypeId)})
      } else if (licenceTypeId !== 'all' && licenceStatusTypeId === 'all') {
        this.filtered = this.licences.filter(item=> {return parseInt(item.licenceTypeId) === parseInt(licenceTypeId)})
      } else if (licenceStatusTypeId !== 'all' && licenceTypeId === 'all') {
        this.filtered = this.licences.filter(item=> {return parseInt(item.licenceStatusTypeId) === parseInt(licenceStatusTypeId)})
      } else if (licenceStatusTypeId === 'all' && licenceTypeId === 'all') {
        this.filtered = this.licences
      }
    },
    changeSortProperty: function (value) {
      this.sortProperty = value
      switch(value) {
        case 'licenceId':
          this.filtered = this.filtered.sort(this.dynamicSort("licenceId"));
          break;
        case 'client':
          this.filtered = this.filtered.sort(this.dynamicSort("tradingName"));
          break;
        case 'expiryDesc':
          this.filtered = this.filtered.sort(this.dynamicSort("daysDiff"));
          break;
        case 'expiryAsc':
          this.filtered = this.filtered.sort(this.dynamicSortDec("daysDiff"));
          break;
      }
    },
    getDaysDiff: function(validUntil) {
      if (validUntil) {
        const start = moment(new Date()).format("YYYY-MM-DD");
        const end = moment(validUntil).format("YYYY-MM-DD");
        if (moment(end).diff(moment(start), 'days') >0 ) {
          return moment(end).diff(moment(start), 'days')+' days'
        } else {
          return -moment(end).diff(moment(start), 'days')+' days ago'
        }
      } else {
        return '-'
      }
    },
  },
});
</script>
