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
      <div class="flex items-center justify-between">
        <h3 class="text-gray-700 text-3xl font-semibold">
          {{ permission.name }}
        </h3>
      </div>
      <div class="mt-8">
        <div class="flex items-center justify-between">
          <div class="mr-3">
            <select-box
              nameField="name"
              valueField="userRoleTypeId"
              :options="allUserRoleTypes"
              :selectedValue="userRoleTypeId"
              @onSelect="(value) => changeUserRoleTypeId(value)"
            ></select-box>
          </div>
          <button
            type="button"
            @click="addPermission()"
            class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
          >
            Add
          </button>
        </div>
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
                    No
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Role
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
                  v-for="(item, index) in permission.userRolePermissions"
                  :key="index"
                >
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <p class="text-gray-900 whitespace-no-wrap">
                      {{ index + 1 }}
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <p class="text-gray-900 whitespace-no-wrap">
                      {{ item.userRoleType.name }}
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <button
                      class="text-indigo-600 hover:text-indigo-900 mr-4"
                      type="button"
                      @click="deleteUserRolePermission(item.userRolePermissionId, index)"
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
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import SelectBox from "../../components/common/SelectBox.vue";
import AlertForm from "../../components/modals/AlertForm.vue";

export default defineComponent({
  components: {
    Breadcrumb,
    SelectBox,
    AlertForm,
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    isModalVisible: false,
    alertContent: "",
    permission: {},
    allUserRoleTypes: [],
    userRoleTypeId: null,
    user: null
  }),
  setup() {
    const metaData = useMeta({
      title: 'AKARA'
    })
    return {metaData}
  },
  created() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.permissionId = this.$route.params.permissionId;
    this.$store.dispatch("permissions/getById", { id: this.permissionId });
    this.$store.dispatch("users/getAllUserRoleTypes");
  },
  watch: {
    "$store.state.permissions.permission": {
      deep: true,
      handler: function () {
        this.permission = this.$store.state.permissions.permission.permission;
        if (this.permission && this.isUpdated === false) {
          this.user.user.permissions.push(this.$store.state.permissions.userRolePermission.userRolePermission)
          localStorage.setItem('user', JSON.stringify(this.user))
        }
        this.checkLoading();
      },
    },
    "$store.state.users.allUserRoleTypes": function () {
      this.allUserRoleTypes = this.$store.state.users.allUserRoleTypes.allUserRoleTypes;
      this.checkLoading();
    },
  },
  methods: {
    checkLoading: function () {
      if (
        this.$store.state.permissions.permission.permission &&
        this.$store.state.users.allUserRoleTypes.allUserRoleTypes
      ) {
        this.linkItems = this.getLinkItems();
        this.metaData.meta.title = this.permission.name
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: "Permissions",
          name: "Permissions",
          params: null,
        },
      ];
    },
    changeUserRoleTypeId: function (value) {
      this.userRoleTypeId = value;
    },
    addPermission: function () {
      if (!this.userRoleTypeId) {
        this.openAlert("Insert required fields");
      } else {
        this.isUpdated = false;
        let userRolePermission = {
          permissionId: this.permissionId,
          userRoleTypeId: this.userRoleTypeId
        }
        this.$store.dispatch("permissions/addUserRolePermission", userRolePermission);
        this.userRoleTypeId = null;
      }
    },
    deleteUserRolePermission: function (id, index) {
      this.$store.dispatch("permissions/deleteUserRolePermission", {
        id: id,
      });
      this.user.user.permissions.forEach((item, i) => {
        if (parseInt(item.userRolePermissionId) === parseInt(id)) {
          this.user.user.permissions.splice(i, 1)
          localStorage.setItem('user', JSON.stringify(this.user))
        }
      });
      this.permission.userRolePermissions.splice(index, 1)
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