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
      <form @submit.prevent="handleSubmit">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">{{client.tradingName}} - Add User</h3>
          <div class="text-center">
            <button
              type="submit"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >
              Add New User
            </button>
          </div>
        </div>
        <!-- User Detail -->
        <div class="mt-4 mb-3">
          <div
            class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
            v-if="user"
          >
            <div>
              <div class="mb-4">
                <label
                  class="text-gray-900 font-bold text-lg mb-2"
                  for="fullName"
                  >Full Name</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  v-model="user.fullName"
                />
              </div>
              <div class="mb-4">
                <label class="text-gray-900 font-bold text-lg mb-2" for="email"
                  >Email</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  v-model="user.email"
                />
              </div>
              <div class="mb-4">
                <div class="text-gray-900 font-bold text-lg mb-2">
                  Client User Type
                </div>
                <select-box
                  nameField="name"
                  valueField="clientUserTypeId"
                  :options="clientUserTypes"
                  :selectedValue="clientUserTypeId"
                  @onSelect="(value) => changeClientUserTypeId(value)"
                ></select-box>
              </div>
              <div class="mb-4">
                <label class="text-gray-900 font-bold text-lg mb-2" for="notes"
                  >Note</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  v-model="user.notes"
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
    Breadcrumb
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
    user: {},
    userId: null,
    siteId: null,
    clientUserTypes: [],
    clientUserTypeId: null,
    clientId: null,
    isModalVisible: false,
    alertContent: "",
  }),
  created() {
    this.siteId = JSON.parse(localStorage.getItem("user")).user.selectedSite.siteId;
    this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite
    this.clientId = this.$route.params.clientId;
    this.$store.dispatch("clients/getById", {
      id: this.clientId,
    });
    this.$store.dispatch("users/getAllClientUserTypes");
  },
  watch: {
    "$store.state.clients.client": function () {
      this.client = this.$store.state.clients.client.client;
      this.checkLoading();
    },
    "$store.state.users.clientUserTypes": function () {
      this.clientUserTypes = this.$store.state.users.clientUserTypes.clientUserTypes;
      this.checkLoading();
    },
    "$store.state.clients.clientUser.clientUser": function () {
      this.clientUser = this.$store.state.clients.clientUser.clientUser;
      if (this.clientUser && this.clientUser.clientUserId) {
        router.push(`/client/${this.clientId}/edit`);
      }
    },
  },
  methods: {
    handleSubmit(e) {
      const { fullName, email, notes } = this.user;
      const { clientUserTypeId, clientId } = this;
      if (
        !fullName ||
        !email ||
        !clientUserTypeId
      ) {
        this.openAlert("Insert required fields");
      } else if (!this.email_validatioin(email)) {
        this.openAlert("Invalid Email!");
      } else {
        this.isLoading = true;
        this.$store.dispatch("clients/createClientUser", {
          fullName: fullName,
          email: email,
          clientUserTypeId: clientUserTypeId,
          clientId: clientId,
          notes: notes
        });
      }
    },
    checkLoading: function () {
      if (
        this.$store.state.clients.client.client &&
        this.$store.state.users.clientUserTypes.clientUserTypes
      ) {
        this.linkItems = this.getLinkItems()
        this.metaData.meta.title = `Add User | ${this.client.tradingName} | ${this.site.brandName} | AKARA`
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
            clientId: this.clientId,
          }
        },
      ]
    },
    email_validatioin(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    changeClientUserTypeId(value) {
      this.clientUserTypeId = value;
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
