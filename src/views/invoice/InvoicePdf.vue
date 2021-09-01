<template>
  <div class="flex h-screen font-roboto">
    <div></div>
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header />

      <main class="flex-1 overflow-x-hidden overflow-y-auto">
        <div class="container h-full mx-auto">
          <div class="h-full">
            <div
              class="h-full flex items-center justify-center"
              v-if="isLoading"
            >
              <img class="w-20 h-20" src="../../assets/icons/spinner.gif" alt="" />
            </div>
            <div v-if="!isLoading">
              <InvoicePdf 
                :invoiceId="invoiceId"
                :invoice="invoice"
                :siteLogo="user.user.selectedSite.logoUrl"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>  
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "../../components/Header.vue";
import InvoicePdf from "../../components/invoice/InvoicePdf.vue"

export default defineComponent({
  components: {
    Header,
    InvoicePdf
  },
  data: () => ({
    isLoading: true,
    invoiceId: null,
    invoice: {},
  }),
  created() {
    this.invoiceId = this.$route.params.invoiceId;
    this.siteId = JSON.parse(localStorage.getItem("user")).user.selectedSite.siteId;
    this.user = JSON.parse(localStorage.getItem("user"))
    this.$store.dispatch("invoices/getDetailById", { id: this.invoiceId });
  },
  watch: {
    "$store.state.invoices.invoice": function () {
      this.invoice = this.$store.state.invoices.invoice.invoice;
      this.checkLoading();
    },
  },
  methods: {
    checkLoading: function () {
      if (
        this.$store.state.invoices.invoice.invoice
      ) {
        this.isLoading = false;
      }
    },
  },
});
</script>