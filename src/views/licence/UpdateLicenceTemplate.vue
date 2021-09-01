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
    <no-permission :isLoading="isLoading" :hasPermission="hasPermission" />
    <div v-if="!isLoading && hasPermission">
      <breadcrumb :linkItems="linkItems" />
      <!-- Licence Template Detail -->
      <form @submit.prevent="handleSubmit">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">
            {{ licenceTemplateDetail.site.brandName }} -
            {{ licenceTemplateDetail.name }} - Edit
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
                <label class="text-gray-900 font-bold text-lg mb-2" for="name"
                  >Name</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  v-model="licenceTemplateDetail.name"
                />
              </div>
              <div class="mb-4">
                <div class="text-gray-900 font-bold text-lg mb-2">
                  Licence Type
                </div>
                <select-box
                  nameField="name"
                  valueField="licenceTypeId"
                  :options="licenceTypes"
                  :selectedValue="licenceTemplateDetail.licenceType.licenceTypeId"
                  @onSelect="(value) => changeLicenceTypeId(value)"
                ></select-box>
              </div>
              <div class="mb-4">
                <div class="text-gray-900 font-bold text-lg mb-2">
                  Active/InActive
                </div>
                <select-box
                  nameField="name"
                  valueField="active"
                  :options="activeStatus"
                  :selectedValue="licenceTemplateDetail.active"
                  @onSelect="(value) => changeActiveStatus(value)"
                ></select-box>
              </div>
              <div class="mb-4">
                <label class="text-gray-900 font-bold text-lg mb-2" for="invoicingDay"
                  >Invoicing Day</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="number"
                  v-model="licenceTemplateDetail.invoicingDay"
                />
              </div>
              <div class="mb-4">
                <label class="text-gray-900 font-bold text-lg mb-2" for="paymentTermsDaysFromInvoice"
                  >Payment Terms (days)</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="number"
                  v-model="licenceTemplateDetail.paymentTermsDaysFromInvoice"
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      <!-- Site Licence Documents  -->
      <div class="mt-8">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">
            Template Documents
          </h3>
          <div class="text-center">
            <router-link
              :to="{
                name: 'CreateSiteLicenceDocument',
                params: { siteId: siteId, siteLicenceTemplateId: siteLicenceTemplateId },
              }"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
              >Create
            </router-link>
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
                      <router-link
                        v-if="item.isDocuSign === false"
                        :to="{
                          name: 'UpdateSiteLicenceDocument',
                          params: { siteId: siteId, siteLicenceTemplateId: siteLicenceTemplateId, siteLicenceDocumentId: item.siteLicenceDocumentId },
                        }"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >Edit
                      </router-link>
                      <a v-if="item.isDocuSign === true" :href="`https://appdemo.docusign.com/templates/details/${item.docuSignTemplateRef}`">
                        Edit
                      </a>
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
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">
            Template Products
          </h3>
          <div class="text-center">
            <router-link
              :to="{
                name: 'CreateSiteLicenceProduct',
                params: { siteId: siteId, siteLicenceTemplateId: siteLicenceTemplateId },
              }"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
              >Create
            </router-link>
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
                     PaidIn Advance
                    </th>
                    <th
                      class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                     Product Type
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
                        {{ licenceTemplateDetail.site.currency.symbol }}{{ parseFloat(item.siteProductPricing.baseRate).toFixed(2) }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ licenceTemplateDetail.site.currency.symbol }}{{ parseFloat(item.overridePrice).toFixed(2) }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.paidInAdvance }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <p class="text-gray-900 whitespace-no-wrap">
                        {{ item.licenceProductType.type }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    >
                      <router-link
                        :to="{
                          name: 'UpdateSiteLicenceProduct',
                          params: { siteId: siteId, siteLicenceTemplateId: siteLicenceTemplateId, siteLicenceProductId: item.siteLicenceProductId },
                        }"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >Edit
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useMeta } from 'vue-meta'
import { getPermission, removeDuplicates } from "../../helpers/index"
import router from "../../router";
import SelectBox from "../../components/common/SelectBox.vue";
import AlertForm from "../../components/modals/AlertForm.vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import NoPermission from "../../components/common/NoPermission.vue";

export default defineComponent({
  components: {
    SelectBox,
    AlertForm,
    Breadcrumb,
    NoPermission
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    isModalVisible: false,
    alertContent: "",
    siteId: null,
    licenceTemplates: [],
    licenceTypes: [],
    siteLicenceTemplateId: null,
    licenceTemplateDetail: {},
    activeStatus: [
      {name: 'Active', active: true},
      {name: 'InActive', active: false}
    ],
    hasPermission: false
  }),
  setup() {
    const metaData = useMeta({
      title: 'AKARA'
    })
    return { getPermission, removeDuplicates, metaData }
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
      this.$store.dispatch("sites/getLicenceTemplate", { id: this.siteId });
    }
  },
  watch: {
    "$store.state.sites.licenceTemplates": function () {
      this.licenceTemplates = this.$store.state.sites.licenceTemplates.licenceTemplates;
      if (this.licenceTemplates) {
        this.licenceTemplates.forEach((element) => {
          if (element.licenceType.active === true) {
            this.licenceTypes.push(element.licenceType);
          }
        });
        this.licenceTypes = this.removeDuplicates(this.licenceTypes, 'licenceTypeId')
        this.checkLoading();
      }
    },
    "$store.state.sites.licenceTemplateDetail": function () {
      this.licenceTemplateDetail = this.$store.state.sites.licenceTemplateDetail.licenceTemplateDetail;      
      this.checkLoading();
    },
    "$store.state.sites.licenceTemplate.licenceTemplate": function () {
      if (this.$store.state.sites.licenceTemplate.licenceTemplate) {
        this.isLoading = false
        router.push(`/site/${this.siteId}/licence-template/${this.siteLicenceTemplateId}`);
      }
    },
  },
  methods: {
    checkLoading: function () {
      if (
        this.$store.state.sites.licenceTemplateDetail.licenceTemplateDetail &&
        this.$store.state.sites.licenceTemplates.licenceTemplates
      ) {
        this.linkItems = this.getLinkItems()
        this.metaData.meta.title = `Update ${this.licenceTemplateDetail.name} | ${this.licenceTemplateDetail.site.brandName} | AKARA`
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
        {
          index: 3,
          title: 'Edit',
          name: 'UpdateLicenceTemplate',
          params: {
            siteId: this.licenceTemplateDetail.site.siteId,
            siteLicenceTemplateId: this.licenceTemplateDetail.siteLicenceTemplateId,
          },
        },
      ]
    },
    changeLicenceTypeId: function (value) {
      this.licenceTemplateDetail.licenceType.licenceTypeId = value
    },
    changeActiveStatus: function (value) {
      this.licenceTemplateDetail.active = value
    },
    handleSubmit(e) {
      const { name, invoicingDay, paymentTermsDaysFromInvoice } = this.licenceTemplateDetail;
      if (name && invoicingDay && paymentTermsDaysFromInvoice) {
        this.isLoading = true;
        this.$store.dispatch("sites/updateLicenceTemplate", {
          siteLicenceTemplateId: this.licenceTemplateDetail.siteLicenceTemplateId,
          active: this.licenceTemplateDetail.active,
          licenceTypeId: this.licenceTemplateDetail.licenceType.licenceTypeId,
          siteId: this.siteId,
          name: name,
          invoicingDay: invoicingDay,
          paymentTermsDaysFromInvoice: paymentTermsDaysFromInvoice
        });
      } else {
        this.openAlert("Insert required fields");
      }
    },
    onClose() {
      this.isModalVisible = false;
      this.alertContent = "";
    },
    openAlert(value) {
      this.alertContent = value;
      this.isModalVisible = true;
      return
    },
  },
});
</script>
