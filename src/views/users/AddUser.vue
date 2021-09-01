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
          <h3 class="text-gray-700 text-3xl font-semibold">Add User</h3>
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
                <label
                  class="text-gray-900 font-bold text-lg mb-2"
                  for="password"
                  >Password</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="password"
                  v-model="user.password"
                />
              </div>
              <div class="mb-4">
                <label
                  class="text-gray-900 font-bold text-lg mb-2"
                  for="confirm"
                  >Confirm</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="password"
                  v-model="user.confirm"
                />
              </div>
              <div class="mb-4">
                <div class="text-gray-900 font-bold text-lg mb-2">
                  User Role Type
                </div>
                <select-box
                  nameField="name"
                  valueField="userRoleTypeId"
                  :options="allUserRoleTypes"
                  :selectedValue="userRoleTypeId"
                  @onSelect="(value) => changeUserRoleTypeId(value)"
                ></select-box>
              </div>
              <div class="mb-4">
                <div class="text-gray-900 font-bold text-lg mb-2">Client</div>
                <select-box
                  nameField="tradingName"
                  valueField="clientId"
                  :options="clients"
                  :selectedValue="clientId"
                  @onSelect="(value) => changeClientId(value)"
                ></select-box>
              </div>
              <div class="mb-4" v-if="clientId">
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

export default defineComponent({
  components: {
    SelectBox,
    AlertForm,
    Breadcrumb
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    user: {},
    userId: null,
    siteId: null,
    clientUserTypes: [],
    clientUserTypeId: null,
    clients: [],
    clientId: null,
    allUserRoleTypes: [],
    userRoleTypeId: null,
    isModalVisible: false,
    alertContent: "",
  }),
  created() {
    this.siteId = JSON.parse(localStorage.getItem("user")).user.selectedSite.siteId;
    this.$store.dispatch("clients/getAll", { id: this.siteId });
    this.$store.dispatch("users/getAllClientUserTypes");
    this.$store.dispatch("users/getAllUserRoleTypes");
  },
  watch: {
    "$store.state.clients.all": function () {
      this.clients = this.$store.state.clients.all.items;
      this.checkLoading();
    },
    "$store.state.users.clientUserTypes": function () {
      this.clientUserTypes = this.$store.state.users.clientUserTypes.clientUserTypes;
      this.checkLoading();
    },
    "$store.state.users.user.user": function () {
      this.userId = this.$store.state.users.user.user.userId;
      if (this.userId) {
        router.push(`/user/${this.userId}`);
      }
    },
    "$store.state.users.allUserRoleTypes": function () {
      this.allUserRoleTypes = this.$store.state.users.allUserRoleTypes.allUserRoleTypes;
      this.checkLoading();
    },
  },
  methods: {
    handleSubmit(e) {
      const { fullName, email, password, confirm, profilePic } = this.user;
      const { siteId, clientUserTypeId, clientId, userRoleTypeId } = this;
      if (
        !fullName ||
        !email ||
        !password ||
        !confirm ||
        !siteId ||
        !userRoleTypeId
      ) {
        this.openAlert("Insert required fields");
      } else if (password !== confirm) {
        this.openAlert("Password miss matching!");
      } else if (!this.email_validatioin(email)) {
        this.openAlert("Invalid Email!");
      } else {
        this.isLoading = true;
        this.$store.dispatch("users/create", {
          fullName: fullName,
          email: email,
          password: password,
          profilePic: profilePic,
          siteId: siteId,
          clientUserTypeId: clientUserTypeId,
          clientId: clientId,
          userRoleTypeId: userRoleTypeId,
        });
      }
    },
    checkLoading: function () {
      if (
        this.$store.state.clients.all.items &&
        this.$store.state.users.clientUserTypes.clientUserTypes && 
        this.$store.state.users.allUserRoleTypes.allUserRoleTypes
      ) {
        this.linkItems = this.getLinkItems()
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: 'Users',
          name: 'Users',
          params: { siteId: this.siteId }
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
    changeClientId(value) {
      this.clientId = value;
    },
    changeUserRoleTypeId(value) {
      this.userRoleTypeId = value;
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
