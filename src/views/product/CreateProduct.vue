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
    <!-- Product Detail -->
    <form @submit.prevent="handleSubmit" v-if="!isLoading">
      <breadcrumb :linkItems="linkItems" />
      <div class="flex items-center justify-between">
        <h3 class="text-gray-700 text-3xl font-semibold">Create Product</h3>
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
          v-if="product"
        >
          <div>
            <div class="mb-4">
              <label
                class="text-gray-900 font-bold text-lg mb-2"
                for="name"
                >Name</label
              >
              <input
                class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                type="text"
                v-model="product.name"
              />
            </div>
            <div class="mb-4">
              <label
                class="text-gray-900 font-bold text-lg mb-2"
                for="description"
                >Description</label
              >
              <input
                class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                type="text"
                v-model="product.description"
              />
            </div>
            <div class="mb-4">
              <label
                class="text-gray-900 font-bold text-lg mb-2"
                for="icon"
                >Icon</label
              >
              <input
                class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                type="text"
                v-model="product.icon"
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
import router from '../../router'
import AlertForm from "../../components/modals/AlertForm.vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";

export default defineComponent({
  components: {
    AlertForm,
    Breadcrumb
  },
  data: () => ({
    linkItems: [],
    isModalVisible: false,
    alertContent: "",
    product: {},
    productId: null
  }),
  created() {
    this.linkItems = this.getLinkItems()
  },
  watch: {
    "$store.state.products.product.product": function () {
      this.product = this.$store.state.products.product.product;
      if (this.product && this.product.productId) {
        router.push(`/product/${this.product.productId}`)
      }
    },
  },
  methods: {
    handleSubmit(e) {
      const { name } = this.product;
      if (name) {
        this.isLoading = true;
        this.$store.dispatch("products/create", this.product);
      } else {
        this.openAlert("Insert required fields");
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: 'Products',
          name: 'Products',
          params: null
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
