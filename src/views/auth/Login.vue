<template>
  <div class="flex flex-col justify-center items-center h-screen bg-gray-200 px-6">
    <div class="overflow-hidden flex text-center mb-10 -mt-16 "  v-if="!isLoading">
      <img class="w-auto m-auto" src="/logo-akara.png" />
    </div>
    <div
      class="h-full my-auto flex items-center justify-center"
      v-if="isLoading"
    >
      <img class="w-20 h-20" src="../../assets/icons/spinner.gif" alt="" />
    </div>
    <div class="p-6 max-w-sm w-full bg-white shadow-md rounded-md" v-if="!isLoading">
      <div class="flex justify-center items-center">
        <span class="text-gray-700 font-semibold text-2xl">Login</span>
      </div>

      <form class="mt-4" @submit.prevent="handleSubmit">
        <label class="block">
          <span class="text-gray-700 text-sm">Email</span>
          <input
            type="email"
            class="form-input mt-1 block w-full rounded-md focus:border-indigo-600"
            v-model="email"
          />
          <div v-show="submitted && !email">Email is required</div>
        </label>

        <label class="block mt-3">
          <span class="text-gray-700 text-sm">Password</span>
          <input
            type="password"
            class="form-input mt-1 block w-full rounded-md focus:border-indigo-600"
            v-model="password"
          />
          <div v-show="submitted && !password" class="invalid-feedback">
            Password is required
          </div>
        </label>

        <div class="flex justify-end items-center mt-4 hidden">
          <div>
            <a class="block text-sm fontme hover:underline" href="#"
              >Forgot your password?</a
            >
          </div>
        </div>

        <div class="mt-6 text-center">
          <button
            type="submit"
            class="py-2 px-4 text-center bg-gray-900 rounded-md w-48 text-white text-sm hover:bg-gray-800"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      email: "",
      password: "",
      submitted: false,
      isLoading: false
    };
  },
  created() {
    // reset login status
    this.$store.dispatch("account/logout");
  },
  watch: {
    "$store.state.account.user": function () {
      this.user = this.$store.state.account.user
      if (this.user === null) {
        this.isLoading = false
        this.password = null
      }
    },
  },
  methods: {
    handleSubmit(e) {
      this.submitted = true;
      this.isLoading = true
      const { email, password } = this;
      if (email && password) {
        this.$store.dispatch("account/login", { email, password });
      }
    },
  },
});
</script>
