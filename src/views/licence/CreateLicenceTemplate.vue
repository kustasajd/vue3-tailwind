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
            Create Licence Template
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
                  :selectedValue="licenceTemplateDetail.licenceTypeId"
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
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "../../router";
import SelectBox from "../../components/common/SelectBox.vue";
import AlertForm from "../../components/modals/AlertForm.vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import NoPermission from "../../components/common/NoPermission.vue";
import { getPermission } from "../../helpers/index";

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
    return { getPermission }
  },
  created() {
    this.siteId = this.$route.params.siteId;
    this.hasPermission = this.getPermission(this.siteId)
    if (!this.hasPermission) {
      this.isLoading = false
    } else {
      this.$store.dispatch("licences/getLicenceType");
    }
  },
  watch: {
    "$store.state.licences.licenceTypes": function () {
      this.licenceTypes = this.$store.state.licences.licenceTypes.licenceTypes;
      this.checkLoading();
    },
    "$store.state.sites.licenceTemplate.licenceTemplate": function () {
      this.licenceTemplate = this.$store.state.sites.licenceTemplate.licenceTemplate
      if (this.licenceTemplate && this.licenceTemplate.siteLicenceTemplateId) {
        this.isLoading = false
        router.push(`/site/${this.siteId}/licence-template/${this.licenceTemplate.siteLicenceTemplateId}/edit`);
      }
    },
  },
  methods: {
    checkLoading: function () {
      if (
        this.$store.state.licences.licenceTypes.licenceTypes
      ) {
        this.linkItems = this.getLinkItems()
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: 'LicenceTemplates',
          name: 'LicenceTemplates',
          params: {
            siteId: this.siteId
          }
        },
      ]
    },
    changeLicenceTypeId: function (value) {
      this.licenceTemplateDetail.licenceTypeId = value
    },
    changeActiveStatus: function (value) {
      this.licenceTemplateDetail.active = value
    },
    handleSubmit(e) {
      const { name, invoicingDay, paymentTermsDaysFromInvoice, licenceTypeId, active,  } = this.licenceTemplateDetail;
      if (name && invoicingDay && paymentTermsDaysFromInvoice && licenceTypeId && active) {
        this.isLoading = true;
        this.$store.dispatch("sites/createLicenceTemplate", {
          siteId: this.siteId,
          active: active,
          licenceTypeId: licenceTypeId,
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
