<template>
  <div class="h-full">
    <div
      class="h-full my-auto flex items-center justify-center"
      v-if="isLoading"
    >
      <img class="w-20 h-20" src="../../assets/icons/spinner.gif" alt="" />
    </div>
    <div v-if="!isLoading">
      <breadcrumb :linkItems="linkItems" />
      <!-- Room Reservation Detail -->
      <form @submit.prevent="handleSubmit">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">
            {{roomReservation.siteZone.friendlyName}}
          </h3>
          <div class="text-center">
          <router-link
            :to="{
              name: 'UpdateRoomReservation',
              params: {
                roomReservationId: roomReservationId
              }
            }"
            class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >Edit
          </router-link>
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
                  for="client"
                  >Client</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  disabled
                  v-model="roomReservation.client.tradingName"
                />
              </div>
              <div class="mb-4">
                <label
                  class="text-gray-900 font-bold text-lg mb-2"
                  for="zone"
                  >Zone</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  disabled
                  v-model="roomReservation.siteZone.friendlyName"
                />
              </div>
              <div class="mb-4">
                <label
                  class="text-gray-900 font-bold text-lg mb-2"
                  for="zone"
                  >Product</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  disabled
                  v-model="roomReservation.chargeRegister.product.name"
                />
              </div>
              <div class="mb-4">
                <label
                  class="text-gray-900 font-bold text-lg mb-2"
                  for="productChargeType"
                  >Charge Type</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  disabled
                  v-model="roomReservation.chargeRegister.productChargeType.type"
                />
              </div>
              <div class="mb-4">
                <label
                  class="text-gray-900 font-bold text-lg mb-2"
                  for="rateTotal"
                  >Rate Total{{site.currency.symbol}}</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  disabled
                  v-model="roomReservation.chargeRegister.rateTotal"
                />
              </div>              
              <div class="mb-4">
                <label class="text-gray-900 font-bold text-lg mb-2" for="addedTime"
                  >Date</label
                >
                <div class="mt-1 w-full">
                  <a-time-picker class="w-full" size="large" format = 'YYYY-MM-DD' :defaultValue="roomReservation.addedTime" disabled/>
                </div>
              </div>
              <div class="mb-4">
                <label class="text-gray-900 font-bold text-lg mb-2" for="timeStart"
                  >Start Time</label
                >
                <div class="mt-1 w-full">
                  <a-time-picker class="w-full" size="large" format = 'HH:mm' :defaultValue="roomReservation.timeStart" disabled/>
                </div>
              </div>
              <div class="mb-4">
                <label class="text-gray-900 font-bold text-lg mb-2" for="timeEnd"
                  >End Time</label
                >
                <div class="mt-1 w-full">
                  <a-time-picker class="w-full" size="large" format = 'HH:mm' :defaultValue="roomReservation.timeEnd" disabled/>
                </div>
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
import Breadcrumb from "../../components/common/Breadcrumb.vue";

export default defineComponent({
  components: {
    Breadcrumb,
  },
  setup() {
    const metaData = useMeta({
      title: 'AKARA'
    })
    return {
      metaData
    };
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    site: {},
    roomReservation: {},
  }),
  created() {
    this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
    this.roomReservationId = this.$route.params.roomReservationId;
    this.$store.dispatch("roomReservations/getById", { id: this.roomReservationId });
  },
  watch: {
    "$store.state.roomReservations.roomReservation": function () {
      this.roomReservation = this.$store.state.roomReservations.roomReservation.roomReservation;
      this.checkLoading()
    },
  },
  methods: {
    checkLoading: function () {
      if (this.$store.state.roomReservations.roomReservation.roomReservation) {
        this.linkItems = this.getLinkItems()
        this.metaData.meta.title = `${this.roomReservation.siteZone.friendlyName} | ${this.roomReservation.siteZone.site.brandName} | AKARA`
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: "Room Reservations",
          name: "RoomReservations",
          params: null,
        },
        {
          index: 2,
          title: `${this.roomReservation.siteZone.friendlyName}`,
          name: "RoomReservationDetail",
          params: {
            roomReservationId: this.roomReservation.roomReservationId
          },
        },
      ];
    },
  },
});
</script>
