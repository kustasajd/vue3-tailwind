<template>
  <div class="text-gray-700">
    <div class="text-right -my-5 -mx-5 italic text-gray-600" v-if="lastLogin && lastLoginTime" >
      Last login {{ lastLogin }}
    </div>
    <div class="block overflow-hidden text-center">
      <img class="w-auto m-auto" src="/logo-akara.png" />
    </div>


    <div class="text-l font-medium italic" style="margin-top:100px;">
      (DEMO DATA ONLY)
    </div>
    <div class="flex flex-wrap -mx-3 mb-20">

      <div class="w-1/2 xl:w-1/4 px-3">
        <div class="w-full bg-white border text-blue-400 rounded-lg flex items-center p-6 mb-6 xl:mb-0">
          <span class="material-icons" style="font-size: 70px">history_edu</span>

          <div class="text-gray-700">
            <p class="font-semibold text-3xl" style="margin: 0.2em;">82</p>
            <p style="margin-left: 0.5em;">Active Licences</p>
          </div>

        </div>
      </div>

      <div class="w-1/2 xl:w-1/4 px-3">
        <div class="w-full bg-white border text-orange-600 rounded-lg flex items-center p-6 mb-6 xl:mb-0">
          <span class="material-icons" style="font-size: 60px">receipt</span>

          <div class="text-gray-700">
            <p class="font-semibold text-3xl text-orange-600" style="margin: 0.2em;">12</p>
            <p class=" text-orange-600" style="margin-left: 0.5em;">Overdue Invoices</p>
          </div>
        </div>
      </div>

      <div class="w-1/2 xl:w-1/4 px-3">
        <div class="w-full bg-white border text-blue-400 rounded-lg flex items-center p-6">
          <span class="material-icons" style="font-size: 60px">notifications_active</span>

          <div class="text-gray-700">
            <p class="font-semibold text-3xl" style="margin: 0.2em;">31</p>
            <p style="margin-left: 0.5em;">Notifications</p>
          </div>
        </div>
      </div>

      <div class="w-1/2 xl:w-1/4 px-3">
        <div class="w-full bg-white border text-blue-400 rounded-lg flex items-center p-6">
          <span class="material-icons" style="font-size: 60px">paid</span>

          <div class="text-gray-700">
            <p class="font-semibold text-3xl" style="margin: 0.2em;">34%</p>
            <p style="margin-left: 0.5em;">Revenue Increase</p>
          </div>

        </div>
      </div>

    </div>


  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import moment from "moment";

export default defineComponent({
  data: () => ({}),
  created() {
    // Get login time
    this.lastLoginTime = JSON.parse(localStorage.getItem("lastLogin"));
    if (this.lastLoginTime) {
      let date = moment(this.lastLoginTime).format("YYYY-MM-DD");
      let now = moment().format("YYYY-MM-DD");
      const time = moment(this.lastLoginTime).format("h:mm a");
      switch (moment(now).diff(moment(date)) / 24 / 60 / 60 / 1000) {
        case 0:
          this.lastLogin = "today at " + time;
          break;
        case 1:
          this.lastLogin = "yesterday at " + time;
          break;
        default:
          this.lastLogin = date + " at " + time;
      }
    }
  },
});
</script>
