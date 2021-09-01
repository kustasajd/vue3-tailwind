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
      <!-- Product Detail -->
      <form @submit.prevent="handleSubmit">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold flex items-center">
            <span class="material-icons mr-3" v-if="product.icon">{{product.icon}}</span>
            {{ product.name }}
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useMeta } from 'vue-meta'
import AlertForm from "../../components/modals/AlertForm.vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import router from "../../router";

export default defineComponent({
  components: {
    AlertForm,
    Breadcrumb
  },
  setup () {
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
    product: {},
    productId: null,
    formSubmit: false
  }),
  created() {
    this.productId = this.$route.params.productId
    this.$store.dispatch("products/getById", {
      id: this.productId,
    });
  },
  watch: {
    "$store.state.products.product": function () {
      this.product = this.$store.state.products.product.product;
      this.checkLoading();
    },
    "$store.state.products.product.product": function () {
      if (this.$store.state.products.product.product && this.formSubmit === true) {
        router.push(
          `/product/${this.productId}`
        );
      }
    },
  },
  methods: {
    checkLoading: function () {
      if (this.$store.state.products.product.product) {
        this.linkItems = this.getLinkItems()
        this.metaData.meta.title = `Update ${this.product.name} | AKARA`
        this.isLoading = false;
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
        {
          index: 2,
          title: this.product.name,
          name: 'ProductDetail',
          params: {
            productId: this.product.productId,
          }
        },
      ]
    },
    handleSubmit(e) {
      this.isLoading = true;
      this.formSubmit = true
      const { name } = this.product;
      if (name) {
        this.$store.dispatch("products/update", this.product);
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
