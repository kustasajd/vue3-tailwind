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
            {{ client.tradingName }}
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
            <div
              class="block h-24 w-24 rounded-full overflow-hidden shadow focus:outline-none mr-10"
            >
              <img
                class="h-full w-full object-contain"
                :src="
                  client.profilePic
                    ? client.profilePic
                    : 'https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=296&q=80'
                "
                alt="Your avatar"
              />
            </div>
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
      <!-- Group Types -->
      <div class="mt-8">
        <h4 class="text-gray-900 font-bold text-lg mb-2">Group Types</h4>
        <div class="mt-4" v-if="this.showGroupTypes">
          <div
            class="flex flex-wrap rounded-md bg-white py-4 px-4 overflow-x-auto"
          >
            <label
              class="inline-flex items-center mb-2 mr-3"
              v-for="(item, index) in this.allClientGroupTypes"
              :key="index"
            >
              <input
                type="checkbox"
                class="form-checkbox h-5 w-5"
                v-model="item.isSelected"
                @change="
                  handleCheckboxChange(item.clientGroupTypeId, item.isSelected)
                "
              /><span class="ml-2 text-gray-700">{{ item.name }}</span>
            </label>
          </div>
        </div>
      </div>
      <!-- Users -->
      <div class="mt-8">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">
            Staff Members
          </h3>
          <div class="text-center">
            <router-link
              :to="{
                name: 'CreateClientUser',
                params: { clientId: clientId },
              }"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
              >Add
            </router-link>
          </div>
        </div>
        <div
          class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto"
          v-if="clientUsers && clientUsers.length > 0"
        >
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
                    User Type
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    date Added
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    added by
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    notes
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(u, index) in clientUsers" :key="index">
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <p class="text-gray-900 whitespace-no-wrap">
                      {{ u.user.fullName }}
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <p class="text-gray-900 whitespace-no-wrap">
                      {{ u.clientUserType.name }}
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <p class="text-gray-900 whitespace-no-wrap">
                      {{ getDate(u.dateAdded) }}
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <p class="text-gray-900 whitespace-no-wrap">
                      {{ u.addedByUser.fullName }}
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <p class="text-gray-900 whitespace-no-wrap">
                      {{ u.notes }}
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <button
                      class="text-indigo-600 hover:text-indigo-900 mr-4"
                      type="button"
                      @click="deleteClientUser(u.user.userId)"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useMeta } from 'vue-meta'
import router from "../../router";
import { getDate } from "../../helpers/index";
import AlertForm from "../../components/modals/AlertForm.vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";

export default defineComponent({
  components: {
    AlertForm,
    Breadcrumb
  },
  setup() {
    const metaData = useMeta({
      title: 'AKARA'
    })
    return { metaData, getDate }
  },
  data: () => ({
    isLoading: true,
    user: {},
    linkItems: [],
    clientId: null,
    client: {},
    clientGroups: [],
    allClientGroupTypes: [],
    showGroupTypes: false,
    userEmail: "",
    clientUsers: [],
    isModalVisible: false,
    alertContent: "",
    submitted: false
  }),
  created() {
    this.clientId = this.$route.params.clientId;
    this.user = JSON.parse(localStorage.getItem("user")).user;
    this.$store.dispatch("clients/getGroupById", {
      id: this.clientId,
    });
    this.$store.dispatch("clients/getById", {
      id: this.clientId,
    });
    this.$store.dispatch("clients/getAllClientGroupTypes");
    this.$store.dispatch("clients/getUserById", {
      id: this.clientId,
    });
  },
  watch: {
    "$store.state.clients.client": function () {
      this.client = this.$store.state.clients.client.client;
      if (this.submitted === true && this.client) {
        router.push(`/client/${this.client.clientId}`);
      } else if (this.submitted === false && this.client) {
        this.checkLoading();
      }
    },
    "$store.state.clients.clientGroups": function () {
      this.clientGroups = this.$store.state.clients.clientGroups.clientGroups;
      if (this.allClientGroupTypes && this.clientGroups) {
        this.getGroupTypes();
      }
      this.checkLoading();
    },
    "$store.state.clients.allClientGroupTypes": function () {
      this.allClientGroupTypes = this.$store.state.clients.allClientGroupTypes.allClientGroupTypes;
      if (this.clientGroups && this.allClientGroupTypes) {
        this.getGroupTypes();
      }
      this.checkLoading();
    },
    "$store.state.clients.clientUsers": function () {
      this.clientUsers = this.$store.state.clients.clientUsers.clientUsers;
      this.checkLoading();
    },
  },
  methods: {
    checkLoading: function () {
      if (
        this.$store.state.clients.client.client &&
        this.$store.state.clients.clientGroups.clientGroups &&
        this.$store.state.clients.allClientGroupTypes.allClientGroupTypes &&
        this.$store.state.clients.clientUsers.clientUsers
      ) {
        this.linkItems = this.getLinkItems()
        this.metaData.meta.title = `${this.client.tradingName} | ${this.user.selectedSite.brandName} | AKARA`
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: 'Clients',
          name: 'Clients',
          params: { siteId: this.user.selectedSite.siteId }
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
    handleSubmit(e) {
      const {
        email,
        tradingName,
      } = this.client;
      if (email && tradingName) {
        this.isLoading = true;
        this.submitted = true
        this.$store.dispatch("clients/update", this.client);
      } else {
        this.openAlert("Insert required fields");
      }
    },

    getGroupTypes() {
      this.allClientGroupTypes.forEach((type) => {
        for (let i = 0; i < this.clientGroups.length; i++) {
          if (
            this.clientGroups[i].clientGroupTypeId === type.clientGroupTypeId
          ) {
            type.isSelected = true;
          }
        }
      });
      this.showGroupTypes = true;
    },

    handleCheckboxChange(id, isChecked) {
      if (isChecked === true) {
        this.$store.dispatch("clients/createClientGroup", {
          clientGroupTypeId: id,
          clientId: this.clientId,
        });
      } else {
        this.$store.dispatch("clients/deleteClientGroup", {
          clientGroupTypeId: id,
          clientId: this.clientId,
        });
      }
    },

    deleteClientUser(id) {
      this.$store.dispatch("clients/deleteClientUser", {
        userId: id,
        clientId: this.clientId,
      });
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
