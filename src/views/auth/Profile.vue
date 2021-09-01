<template>
  <div class="h-full">
    <div
      class="h-full my-auto flex items-center justify-center"
      v-if="isLoading"
    >
      <img class="w-20 h-20" src="../../assets/icons/spinner.gif" alt="" />
    </div>
    <div v-if="!isLoading">
      <div class="flex items-center justify-between">
        <h3 class="text-gray-700 text-3xl font-semibold">Profile</h3>
        <div class="text-center">
          <button
            type="button"
            @click="showModal = true"
            class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
          >
            Upload Profie Photo
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
            <div class="text-gray-900 font-bold text-xl mb-2">Full Name</div>
            <p class="text-gray-700 text-base mb-4">{{ user.fullName }}</p>
            <div class="text-gray-900 font-bold text-xl mb-2">Email</div>
            <p class="text-gray-700 text-base">{{ user.email }}</p>
          </div>
        </div>
      </div>
      <div
        :class="`modal ${
          !showModal && 'opacity-0 pointer-events-none'
        } z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`"
      >
        <div
          class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
        ></div>

        <div
          class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto"
        >
          <div
            class="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50"
          >
            <svg
              class="fill-current text-white"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
            >
              <path
                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
              />
            </svg>
            <span class="text-sm">(Esc)</span>
          </div>

          <!-- Add margin if you want to see some of the overlay behind the modal-->
          <div class="modal-content py-4 text-left px-6">
            <!--Title-->
            <div class="flex justify-between items-center pb-3">
              <p class="text-2xl font-bold">Upload Profie Photo</p>
              <div
                class="modal-close cursor-pointer z-50"
                @click="showModal = false"
              >
                <svg
                  class="fill-current text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                >
                  <path
                    d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
                  />
                </svg>
              </div>
            </div>

            <!--Body-->
            <div class="flex flex-col items-center justify-center">
              <input
                ref="input"
                type="file"
                name="image"
                accept="image/png, image/jpeg"
                @change="setImage"
              />
              <section class="cropper-area w-72">
                <div class="img-cropper">
                  <vue-cropper
                    ref="cropper"
                    :aspect-ratio="16 / 16"
                    :src="imgSrc"
                    preview=".preview"
                  />
                </div>
                <div class="actions">
                  <a
                    class="my-4"
                    href="#"
                    role="button"
                    @click.prevent="showFileChooser"
                  >
                    Upload Image
                  </a>
                  <a href="#" role="button" @click.prevent="rotate(90)">
                    Rotate +90deg
                  </a>
                </div>
              </section>
            </div>
            <!--Footer-->
            <div class="flex justify-end pt-2">
              <button
                @click="showModal = false"
                class="px-6 py-3 bg-transparent p-3 rounded-lg text-indigo-500 hover:bg-gray-100 hover:text-indigo-400 mr-2"
              >
                Close
              </button>
              <button
                @click="uploadPhoto()"
                class="px-6 py-3 bg-indigo-600 rounded-md text-white font-medium tracking-wide hover:bg-indigo-500"
              >
                Upload and Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

interface User {
  fullName: string;
  email: string;
  profilePic: string;
  profileImg: string,
  lastLogin: any;
}

export default defineComponent({
  components: {
    VueCropper,
  },
  setup() {
    let loggedIn: any = JSON.parse(localStorage.getItem("user"));
    const user = ref<User>(loggedIn.user);
    const showModal = ref(false);
    return {
      token: loggedIn.token,
      user,
      showModal,
      imgSrc: user.value.profileImg ? user.value.profileImg : "../../src/assets/images/profile.png",
      cropImg: "",
    };
  },
  data: () => ({
    isLoading: false
  }),
  watch: {
    "$store.state.users.user": function () {
      this.user = this.$store.state.users.user.user;
      if (this.user) {
        localStorage.setItem("user", JSON.stringify({
            token: this.token,
            user: this.user,
          })
        );
        this.isLoading = false
      }
    },
  },
  methods: {
    uploadPhoto: function () {
      this.isLoading = true
      this.showModal = false;
      this.user.profileImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
      this.$store.dispatch("users/update", this.user);
    },
    showFileChooser: function () {
      this.$refs.input.click();
    },
    setImage: function (e): void {
      const file = e.target.files[0];

      if (file.type.indexOf("image/") === -1) {
        alert("Please select an image file");
        return;
      }

      if (typeof FileReader === "function") {
        const reader = new FileReader();

        reader.onload = (event): void => {
          this.imgSrc = event.target.result;
          // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result);
        };

        reader.readAsDataURL(file);
      } else {
        alert("Sorry, FileReader API not supported");
      }
    },
    rotate: function (deg) {
      this.$refs.cropper.rotate(deg);
    },
  },
});
</script>

<style>
.modal {
  transition: opacity 0.25s ease;
}
input[type="file"] {
  display: none;
}
.cropper-container {
  width: 18rem;
}
.actions {
  margin-top: 1rem;
}

.actions a {
  display: inline-block;
  padding: 5px 15px;
  background: black;
  color: white;
  text-decoration: none;
  border-radius: 3px;
  margin-right: 1rem;
  margin-bottom: 1rem;
}
</style>
