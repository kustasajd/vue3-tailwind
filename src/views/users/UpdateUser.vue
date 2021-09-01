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
          <h3 class="text-gray-700 text-3xl font-semibold">
            {{ user.fullName }}
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
                  user.profileImg
                    ? user.profileImg
                    : '../../src/assets/images/profile.png'
                "
                alt="Your avatar"
              />
            </div>
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
    return { metaData }
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    isModalVisible: false,
    alertContent: "",
    userId: null,
    user: {},
    siteId: null
  }),
  created() {
    this.userId = this.$route.params.userId;
    this.siteId = JSON.parse(localStorage.getItem("user")).user.selectedSite.siteId;
    this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
    this.$store.dispatch("users/getById", { id: this.userId });
  },
  watch: {
    "$store.state.users.user": function () {
      this.user = this.$store.state.users.user.user;
      this.checkLoading();
    },
  },
  methods: {
    checkLoading: function () {
      if (this.$store.state.users.user.user) {
        this.linkItems = this.getLinkItems()
        this.metaData.meta.title = `Update ${this.user.fullName} | ${this.site.brandName} | AKARA`
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
        {
          index: 2,
          title: this.user.fullName,
          name: 'UserDetail',
          params: {
            userId: this.user.userId,
          }
        },
      ]
    },
    handleSubmit(e) {
      this.isLoading = true;
      const { email, fullName } = this.user;
      if (email && fullName) {
        this.$store.dispatch("users/update", this.user);
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
