<template>
  <div class="h-full">
    <div
      class="h-full my-auto flex items-center justify-center"
      v-if="isLoading"
    >
      <img class="w-20 h-20" src="../../assets/icons/spinner.gif" alt="" />
    </div>
    <no-permission :isLoading="isLoading" :hasPermission="hasPermission" />
    <div v-if="!isLoading && hasPermission">
      <breadcrumb :linkItems="linkItems" />
      <!-- Licence Template Detail -->
      <div>
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">
            {{ licenceTemplateDetail.site.brandName }}<br />
            {{ licenceTemplateDetail.name }}
          </h3>
          <div class="text-center">
            <router-link
              :to="{
                name: 'UpdateLicenceTemplate',
                params: {
                  siteId: siteId,
                  siteLicenceTemplateId: siteLicenceTemplateId,
                },
              }"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
              >Edit
            </router-link>
          </div>
        </div>
        <div class="mt-4 mb-3">
          <div
            class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
          >
            <div>
              <div class="text-gray-900 font-bold text-lg mb-2">Name</div>
              <p class="text-gray-700 text-base mb-4">
                {{ licenceTemplateDetail.name }}
              </p>
              <div class="text-gray-900 font-bold text-lg mb-2">
                Licence Type
              </div>
              <p class="text-gray-700 text-base mb-4">
                {{ licenceTemplateDetail.licenceType.name }}
              </p>
              <div class="text-gray-900 font-bold text-lg mb-2">
                Description
              </div>
              <p class="text-gray-700 text-base mb-4">
                {{ licenceTemplateDetail.licenceType.description ? licenceTemplateDetail.licenceType.description : '-' }}
              </p>
              <div class="text-gray-900 font-bold text-lg mb-2">Invoicing Day</div>
              <p class="text-gray-700 text-base mb-4">
                {{ licenceTemplateDetail.invoicingDay }}
              </p>
              <div class="text-gray-900 font-bold text-lg mb-2">Payment Terms</div>
              <p class="text-gray-700 text-base mb-4">
                {{ licenceTemplateDetail.paymentTermsDaysFromInvoice }} days
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Site Licence Documents  -->
      <div class="mt-8">
        <h3 class="text-gray-700 text-3xl font-medium">
          Template Documents
        </h3>
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
                      Name
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      DocuSign
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(
                      item, index
                    ) in licenceTemplateDetail.siteLicenceDocuments"
                    :key="index"
                  >
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.name }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.description }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.isDocuSign }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <button
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        type="button"
                        @click="onPreview(item.siteLicenceDocumentId)"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Site Licence Products  -->
      <div class="mt-8">
        <h3 class="text-gray-700 text-3xl font-medium">
          Template Products
        </h3>
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
                      Product Name
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Option Name
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Site Price
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Override Price
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Paid In Advance
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Product Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(
                      item, index
                    ) in licenceTemplateDetail.siteLicenceProducts"
                    :key="index"
                  >
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap flex items-center">
                        <span class="material-icons mr-3" v-if="item.siteProductPricing.siteProduct.product.icon">{{item.siteProductPricing.siteProduct.product.icon}}</span>
                        {{ item.siteProductPricing.siteProduct.product.name }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{item.siteProductPricing.optionName}}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ licenceTemplateDetail.site.currency.symbol
                        }}{{ parseFloat(item.siteProductPricing.baseRate).toFixed(2) }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ licenceTemplateDetail.site.currency.symbol
                        }}{{ parseFloat(item.overridePrice).toFixed(2) }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.paidInAdvance ? 'Yes' : 'No' }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.licenceProductType.type }}
                      </p>
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
import { defineComponent } from "vue";
import { useMeta } from 'vue-meta'
import { useToast } from "vue-toastification";
import { getPermission, getPagesFromURL } from "../../helpers/index"
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import NoPermission from "../../components/common/NoPermission.vue";

export default defineComponent({
  components: {
    Breadcrumb,
    NoPermission
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    siteId: null,
    siteLicenceTemplateId: null,
    licenceTemplateDetail: {},
    hasPermission: false
  }),
  setup() {
    const toast = useToast();
    const metaData = useMeta({
      title: 'AKARA'
    })
    return { getPermission, getPagesFromURL, toast, metaData }
  },
  created() {
    this.siteId = this.$route.params.siteId;
    this.hasPermission = this.getPermission(this.siteId)
    this.siteLicenceTemplateId = this.$route.params.siteLicenceTemplateId;
    if (!this.hasPermission) {
      this.isLoading = false
    } else {
      this.$store.dispatch("sites/licenceTemplateDetail", {
        siteId: this.siteId,
        siteLicenceTemplateId: this.siteLicenceTemplateId,
      });
    }
    
  },
  watch: {
    "$store.state.sites.licenceTemplateDetail": function () {
      this.licenceTemplateDetail = this.$store.state.sites.licenceTemplateDetail.licenceTemplateDetail;
      this.checkLoading();
    },
    "$store.state.sites.licenceDocumentDetail": function () {
      this.licenceDocumentDetail = this.$store.state.sites.licenceDocumentDetail.licenceDocumentDetail;
      if (this.licenceDocumentDetail && this.licenceDocumentDetail.docUrl) {
        let win = window.open();
        win.document.write(
          '<iframe src="' +
            this.licenceDocumentDetail.docUrl +
            '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
        );
      } else if (this.licenceDocumentDetail && !this.licenceDocumentDetail.docUrl) {
        this.toast.info("There is no document for preview!");
      }
    },
  },
  methods: {
    checkLoading: function () {
      if (this.$store.state.sites.licenceTemplateDetail.licenceTemplateDetail) {
        this.linkItems = this.getLinkItems()
        this.metaData.meta.title = `${this.licenceTemplateDetail.name} | ${this.licenceTemplateDetail.site.brandName} | AKARA`
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: 'Licence Templates',
          name: 'LicenceTemplates',
          params: {
            siteId: this.siteId
          }
        },
        {
          index: 2,
          title: this.licenceTemplateDetail.name,
          name: 'LicenceTemplateDetail',
          params: {
            siteId: this.licenceTemplateDetail.site.siteId,
            siteLicenceTemplateId: this.licenceTemplateDetail.siteLicenceTemplateId,
          },
        },
      ]
    },
    onPreview: function (siteLicenceDocumentId) {
      this.$store.dispatch("sites/licenceDocumentDetail", siteLicenceDocumentId);
    }
  },
});
</script>
