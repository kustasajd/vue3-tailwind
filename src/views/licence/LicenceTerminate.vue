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
    <!-- Detail -->
    <form @submit.prevent="handleSubmit" v-if="!isLoading">
      <breadcrumb :linkItems="linkItems" />
      <div class="flex items-center justify-between">
        <h3 class="text-gray-700 text-3xl font-semibold">Terminate Licence</h3>
        <div class="text-center">
          <button
            type="submit"
            class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
          >
            Confirm Termination
          </button>
        </div>
      </div>

      <div class="mt-4 mb-3">
        <div
          class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex"
          v-if="terminateDetail"
        >
          <div>
            <div class="mb-4">
              <label class="text-gray-900 font-bold text-lg mb-2" for="terminationDate "
                >Termination date</label
              >
              <div class="mt-1 w-full">
                <a-date-picker class="w-full" size="large" 
                  @change="onChangeAddedTime" 
                  :defaultValue="getDate(terminateDetail.terminationDate )"
                  :disabledDate="disabledDate"
                />
              </div>
            </div>
            <div class="mb-4">
              <label
                class="text-gray-900 font-bold text-lg mb-2"
                for="notes"
                >Description</label
              >
              <input
                class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                type="text"
                v-model="terminateDetail.notes"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import moment from 'moment'
import router from '../../router'
import { getDate } from "../../helpers/index";
import AlertForm from "../../components/modals/AlertForm.vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";

export default defineComponent({
  components: {
    AlertForm,
    Breadcrumb
  },
  setup() {
    return {
      getDate
    };
  },
  data: () => ({
    linkItems: [],
    isModalVisible: false,
    alertContent: "",
    terminateDetail: {},
    licenceId: null
  }),
  created() {
    this.licenceId = this.$route.params.licenceId;
    this.terminateDetail.terminationDate = this.getDate(new Date())
    this.terminateDetail.licenceId = this.licenceId
    this.linkItems = this.getLinkItems()
  },
  watch: {
    "$store.state.licences.licence": function () {
      this.licence = this.$store.state.licences.licence.licence;
      if (this.licence && this.licence.licenceId) {
        router.push(`/licence/${this.licenceId}`)
      }
    },
  },
  methods: {
    handleSubmit(e) {
      const { terminationDate } = this.terminateDetail;
      if (terminationDate) {
        this.isLoading = true;
        this.$store.dispatch("licences/terminate", this.terminateDetail);
      } else {
        this.openAlert("Insert required fields");
      }
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day');
    },
    onChangeAddedTime(date, dateString) {
      this.terminateDetail.terminationDate = dateString
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: 'Licence #' + this.licenceId,
          name: "LicenceDetail",
          params: {
            licenceId: this.licenceId,
          },
        },
      ]
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
