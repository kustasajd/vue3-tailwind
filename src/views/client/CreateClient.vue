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
      <!-- Client Detail -->
      <form @submit.prevent="handleSubmit">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">
            Add New Client
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
                <label
                  class="text-gray-900 font-bold text-lg mb-2"
                  for="tradingName"
                  >Trading Name</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  v-model="client.tradingName"
                />
              </div>
              <div class="mb-4">
                <label
                  class="text-gray-900 font-bold text-lg mb-2"
                  for="legalName"
                  >Legal Name</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  v-model="client.legalName"
                />
              </div>
              <div class="mb-4">
                <label
                  class="text-gray-900 font-bold text-lg mb-2"
                  for="primaryContact"
                  >Primary Contact</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  v-model="client.primaryContact"
                />
              </div>
              <div class="mb-4">
                <label class="text-gray-900 font-bold text-lg mb-2" for="email"
                  >Email</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  v-model="client.email"
                />
              </div>
              <div class="mb-4">
                <label class="text-gray-900 font-bold text-lg mb-2" for="phone"
                  >Phone</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="number"
                  v-model="client.phone"
                />
              </div>
              <div class="mb-4">
                <label class="text-gray-900 font-bold text-lg mb-2" for="mobile"
                  >Mobile</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="number"
                  v-model="client.mobile"
                />
              </div>
              <div class="mb-4">
                <label class="text-gray-900 font-bold text-lg mb-2" for="abn"
                  >ABN</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  v-model="client.abn"
                />
              </div>
              <div class="mb-4">
                <label
                  class="text-gray-900 font-bold text-lg mb-2"
                  for="website"
                  >Website</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  v-model="client.website"
                />
              </div>
              <div class="mb-4">
                <label
                  class="text-gray-900 font-bold text-lg mb-2"
                  for="openingBalance"
                  >Opening Balance</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="number"
                  step="0.01"
                  v-model="client.openingBalance"
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
import AlertForm from "../../components/modals/AlertForm.vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";

export default defineComponent({
  components: {
    AlertForm,
    Breadcrumb,
  },
  data: () => ({
    isLoading: false,
    user: {},
    linkItems: [],
    siteId: null,
    client: {
      openingBalance: 0
    },
    isModalVisible: false,
    alertContent: "",
  }),
  created() {
    this.siteId = JSON.parse(
      localStorage.getItem("user")
    ).user.selectedSite.siteId;
    this.linkItems = this.getLinkItems();
  },
  watch: {
    "$store.state.clients.client": function () {
      this.client = this.$store.state.clients.client.client;
      if (this.client && this.client.clientId) {
        router.push(`/client/${this.client.clientId}`);
      }
    },
  },
  methods: {
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: "Clients",
          name: "Clients",
          params: { siteId: this.siteId },
        },
      ];
    },
    handleSubmit(e) {
      this.client.siteId = this.siteId;
      const {
        email,
        tradingName
      } = this.client;
      if (!email || !tradingName) {
        this.openAlert("Insert required fields");
      } else if (!this.email_validatioin(email)) {
        this.openAlert("Invalid Email!");
      } else {
        this.isLoading = true;
        this.$store.dispatch("clients/create", this.client);
      }
    },
    email_validatioin(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
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
