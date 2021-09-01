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
        <h3 class="text-gray-700 text-3xl font-semibold -mt-12">Revenue Summary<br>{{ formatHeaderDate(selectedDate) }}</h3>
        <div class="flex items-center justify-between">
          <div class="text-center">
            <a-month-picker class="w-full" size="large" @change="onChangeDate" :defaultValue="formatDate(selectedDate)" picker="month" />
          </div>
        </div>
        <!-- Charge register section -->
        <div class="mt-8 pb-4">
          <h3 class="text-gray-700 text-3xl font-medium">Revenue Breakdown section</h3>
          <div class="mt-4 mb-3">
            <div
              class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4"
            >
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Total Zone charges</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  Total: {{site.currency.symbol}}{{ (totalZoneCharges).toFixed(2) }}
                </p>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  Tax: {{site.currency.symbol}}{{ (zoneChargesTax).toFixed(2) }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Total Product charges</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  Total: {{site.currency.symbol}}{{ (totalProductCharges).toFixed(2) }}
                </p>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  Tax: {{site.currency.symbol}}{{ (productChargesTax).toFixed(2) }}
                </p>
              </div>
              <div>
                <div class="text-gray-900 font-bold text-lg mb-2">Total Charge Register items</div>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  Total: {{site.currency.symbol}}{{ (totalChargeRegister).toFixed(2) }}
                </p>
                <p class="text-gray-700 text-base mb-4 font-normal">
                  Tax: {{site.currency.symbol}}{{ (chargeRegisterTax).toFixed(2) }}
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
import html2pdf from "html2pdf.js";
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
    charges: [],
    currentMonthCharges: [],
    totalZoneCharges: 0,
    zoneChargesTax: 0,
    totalProductCharges: 0,
    productChargesTax: 0,
    totalChargeRegister: 0,
    chargeRegisterTax: 0
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
    this.$store.dispatch("charges/filter", {
      siteId: this.siteId,
      isInvoice: null,
      clientId: null,
      productId: null,
    });
  },
  watch: {
    "$store.state.charges.charges": function () {
      this.charges = this.$store.state.charges.charges.charges;
      if (this.charges) {
        this.getProductData()
        this.checkLoading();
      }
    },
  },
  methods: {
    checkLoading: function () {
      if (
        this.$store.state.charges.charges.charges
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
      this.getProductData()
    },
    getProductData: function () {
      this.currentMonthCharges = []
      this.products = []
      this.charges.forEach((charge) => {
        const now = this.selectedDate;
        const end = moment(charge.timestamp).format("YYYY-MM-DD");
        if (now.slice(0, 7) === end.slice(0, 7)) {
          this.currentMonthCharges.push(charge)
        }
      });
      this.currentMonthCharges.forEach(charge => {
        if (charge.siteZoneId === null && charge.licenceProductId === null) {
          this.totalChargeRegister += charge.rateTotal
          this.chargeRegisterTax += charge.rateTotal * (charge.taxRate.taxPercentage/100)
        } else if (charge.siteZoneId === null) {
          this.totalZoneCharges += charge.rateTotal
          this.zoneChargesTax += charge.rateTotal * (charge.taxRate.taxPercentage/100)
        } else if (charge.licenceProductId === null) {
          this.totalProductCharges += charge.rateTotal
          this.productChargesTax += charge.rateTotal * (charge.taxRate.taxPercentage/100)
        }
      });
    },    
  },
});
</script>
