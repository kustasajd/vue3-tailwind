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
      <!-- Licence Detail -->
      <form @submit.prevent="handleSubmit">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">
            Create Licence- {{ client.tradingName }}
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
            v-if="licence"
          >
            <div>
              <div class="mb-4">
                <div class="text-gray-900 font-bold text-lg mb-2">
                  Licence Template
                </div>
                <select-box
                  nameField="name"
                  valueField="siteLicenceTemplateId"
                  :options="licenceTemplates"
                  :selectedValue="siteLicenceTemplateId"
                  @onSelect="(value) => changeLicenceTemplateId(value)"
                ></select-box>
              </div>
              <div class="mb-4" v-if="siteLicenceTemplateId">
                <div class="text-gray-900 font-bold text-lg mb-2">
                  Status Type
                </div>
                <select-box
                  nameField="name"
                  valueField="licenceStatusTypeId"
                  :options="licenceStatusTypes"
                  :selectedValue="licenceStatusTypeId"
                  @onSelect="(value) => changeLicenceStatusTypeId(value)"
                ></select-box>
              </div>
              <div class="mb-4" v-if="siteLicenceTemplateId">
                <div class="text-gray-900 font-bold text-lg mb-2">
                  Licence Type
                </div>
                <select-box
                  nameField="name"
                  valueField="licenceTypeId"
                  :options="licenceTypes"
                  :selectedValue="licenceTypeId"
                  @onSelect="(value) => changeLicenceTypeId(value)"
                ></select-box>
              </div>
              <div class="mb-4" v-if="siteLicenceTemplateId">
                <label class="text-gray-900 font-bold text-lg mb-2" for="invoicingDay"
                  >Invoicing Day</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="number"
                  v-model="licence.invoicingDay"
                />
              </div>
              <div class="mb-4" v-if="siteLicenceTemplateId">
                <label class="text-gray-900 font-bold text-lg mb-2" for="licenceStart"
                  >Licence Start</label
                >
                <div class="mt-1 w-full">
                  <a-date-picker class="w-full" size="large" @change="onChangeLicenceStart" />
                </div>
              </div>
              <div class="mb-4" v-if="siteLicenceTemplateId">
                <label class="text-gray-900 font-bold text-lg mb-2" for="validUntil"
                  >Valid Until</label
                >
                <div class="mt-1 w-full">
                  <a-date-picker class="w-full" size="large" @change="onChangeValidUntil" />
                </div>
              </div>
              <div class="mb-4" v-if="siteLicenceTemplateId">
                <label class="text-gray-900 font-bold text-lg mb-2" for="paymentTermsDaysFromInvoice"
                  >Payment Terms (days)</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="number"
                  v-model="licence.paymentTermsDaysFromInvoice"
                />
              </div>
              <div class="mb-4" v-if="siteLicenceTemplateId">
                <label class="text-gray-900 font-bold text-lg mb-2" for="notes"
                  >Note</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  v-model="licence.notes"
                />
              </div>
              <div class="mb-4" v-if="siteLicenceTemplateId">
                <label class="text-gray-900 font-bold text-lg mb-2" for="furnitureNote"
                  >Furniture</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  v-model="licence.furnitureNote"
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
import { useMeta } from 'vue-meta'
import router from "../../router";
import SelectBox from "../../components/common/SelectBox.vue";
import AlertForm from "../../components/modals/AlertForm.vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";

export default defineComponent({
  components: {
    SelectBox,
    AlertForm,
    Breadcrumb,
    
  },
  setup() {
    const metaData = useMeta({
      title: 'AKARA'
    })
    return { metaData }
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    licence: {},
    client: {},
    clientId: null,
    siteId: null,
    licenceTemplates: [],
    licenceTypes: [],
    siteLicenceTemplateId: null,
    licenceTypeId: null,
    licenceStatusTypes: [],
    licenceStatusTypeId: null,
    licenceId: null,
    isModalVisible: false,
    alertContent: "",
  }),
  created() {
    this.siteId = JSON.parse(localStorage.getItem("user")).user.selectedSite.siteId;
    this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
    this.clientId = this.$route.params.clientId;
    this.$store.dispatch("sites/getLicenceTemplate", { id: this.siteId });
    this.$store.dispatch("licences/getLicenceType");
    this.$store.dispatch("clients/getById", {
      id: this.clientId,
    });
    this.$store.dispatch("licences/getLicenceStatusType");
  },
  watch: {
    "$store.state.clients.client": function () {
      this.client = this.$store.state.clients.client.client;
      if (this.client) {
        this.metaData.meta.title = `Add Licence | ${this.client.tradingName} | ${this.site.brandName} | AKARA`
        this.checkLoading();
      }
    },
    "$store.state.licences.licenceStatusTypes": function () {
      this.licenceStatusTypes = this.$store.state.licences.licenceStatusTypes.licenceStatusTypes;
      this.checkLoading();
    },
    "$store.state.sites.licenceTemplates": function () {
      this.licenceTemplates = this.$store.state.sites.licenceTemplates.licenceTemplates;
      this.checkLoading();
    },    
    "$store.state.licences.licenceTypes": function () {
      this.licenceTypes = this.$store.state.licences.licenceTypes.licenceTypes;
      this.checkLoading();
    },
    "$store.state.licences.licence.licence": function () {
      this.licence = this.$store.state.licences.licence.licence;
      if (this.licence && this.licence.licenceId) {
        router.push(`/licence/${this.licence.licenceId}`);
      }
    },
  },
  methods: {
    handleSubmit(e) {      
      const { notes, invoicingDay, paymentTermsDaysFromInvoice, furnitureNote } = this.licence;
      const { clientId, siteId, licenceTypeId, licenceStatusTypeId, validUntil, licenceStart, siteLicenceTemplateId } = this;
      if (!siteId || !licenceTypeId || !licenceStatusTypeId || !invoicingDay || !paymentTermsDaysFromInvoice) {
        this.openAlert("Insert required fields");
      } else {
        this.isLoading = true;
        this.$store.dispatch("licences/create", {
          clientId: clientId,
          notes: notes,
          furnitureNote: furnitureNote,
          licenceStart: licenceStart,
          validUntil: validUntil,
          invoicingDay: invoicingDay,
          paymentTermsDaysFromInvoice: paymentTermsDaysFromInvoice,
          siteId: siteId,
          licenceTypeId: licenceTypeId,
          licenceStatusTypeId: licenceStatusTypeId,
          siteLicenceTemplateId: siteLicenceTemplateId
        });
      }
    },
    checkLoading: function () {
      if (
        this.$store.state.clients.client.client &&
        this.$store.state.licences.licenceStatusTypes.licenceStatusTypes && 
        this.$store.state.sites.licenceTemplates.licenceTemplates && 
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
          title: 'Clients',
          name: 'Clients',
          params: { siteId: this.siteId }
        },
        {
          index: 2,
          title: this.client.tradingName,
          name: 'ClientDetail',
          params: {
            clientId: this.client.clientId,
          }
        },
      ]
    },
    changeLicenceTemplateId(value) {
      this.siteLicenceTemplateId = value
      const selected = (this.licenceTemplates.filter(item=> {return item.siteLicenceTemplateId===parseInt(value)}))[0]
      this.licenceTypeId = selected.licenceTypeId
      this.licence.invoicingDay = selected.invoicingDay
      this.licence.paymentTermsDaysFromInvoice = selected.paymentTermsDaysFromInvoice
    },
    changeLicenceTypeId(value) {
      this.licenceTypeId = value;
    },
    changeLicenceStatusTypeId(value) {
      this.licenceStatusTypeId = value;
    },
    onChangeLicenceStart(date, dateString) {
      this.licenceStart = dateString
    },
    onChangeValidUntil(date, dateString) {
      this.validUntil = dateString
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
