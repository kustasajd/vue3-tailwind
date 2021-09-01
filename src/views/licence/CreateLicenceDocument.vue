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
      <!-- Licence Document Detail -->
      <form @submit.prevent="handleSubmit">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">
            Licence#{{ licenceId }} - Add Document
          </h3>
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
            v-if="licenceDocument"
          >
            <div>
              <div class="mb-4">
                <label class="text-gray-900 font-bold text-lg mb-2" for="name"
                  >Name</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  v-model="licenceDocument.name"
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
                  v-model="licenceDocument.description"
                />
              </div>
              <div class="mb-4">
                <label class="text-gray-900 font-bold text-lg" for="docUrl"
                  >Upload Pdf</label
                >
                <input
                  ref="input"
                  name="file"
                  multiple
                  @change="handleFileChange($event)"
                  type="file"
                  accept="application/pdf"
                />
                <div class="flex items-center justify-between actions">
                  <a
                    class="my-4"
                    href="#"
                    role="button"
                    @click.prevent="showFileChooser"
                  >
                    Select Pdf
                  </a>
                </div>
              </div>
              <canvas class="mb-8 border border-2 rounded-lg" id="the-canvas"></canvas>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "../../router";
import { getBase64, readPdfFile } from '../../helpers/index'
import SelectBox from "../../components/common/SelectBox.vue";
import AlertForm from "../../components/modals/AlertForm.vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";

export default defineComponent({
  components: {
    SelectBox,
    AlertForm,
    Breadcrumb
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    isModalVisible: false,
    alertContent: "",
    siteId: null,
    site: {},
    licenceId: null,
    licenceDocument: {
      name: null,
      description: null,
      docUrl: null,
    },
    formSubmit: false,
    filesSelected: null,
    blob: {
      title: null,
      content: null,
    },
  }),
  created() {
    this.site = JSON.parse(localStorage.getItem("user")).user.selectedSite;
    this.siteId = this.site.siteId;
    this.licenceId = this.$route.params.licenceId;
    this.linkItems = this.getLinkItems();
    this.isLoading = false
  },
  watch: {
    "$store.state.licences.licenceDocument": function () {
      this.licenceDocument = this.$store.state.licences.licenceDocument.licenceDocument;
      if (
        this.licenceDocument &&
        this.licenceDocument.licenceDocumentId &&
        this.formSubmit === true
      ) {
        router.push(`/licence/${this.licenceDocument.licenceId}/edit`);
      }
    },
  },
  methods: {
    handleSubmit(e) {
      const { name, description, docUrl } = this.licenceDocument;
      if (!name) {
        this.openAlert("Insert required fields");
      } else if (
        this.filesSelected &&
        this.filesSelected.type !== "application/pdf"
      ) {
        this.openAlert("Please select correct pdf file.");
      } else {
        this.isLoading = true;
        this.formSubmit = true
        const data = {
          licenceId: this.licenceId,
          name: name,
          description: description,
          docUrl: docUrl,
        };
        this.$store.dispatch("licences/createLicenceDocument", data);
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: "Licence#" + this.licenceId,
          name: "LicenceDetail",
          params: {
            licenceId: this.licenceId,
          },
        },
      ];
    },
    showFileChooser: function () {
      this.$refs.input.click();
    },
    handleFileChange(evt) {
      this.filesSelected = evt.target.files[0];
      if (this.filesSelected.type !== "application/pdf") {
        this.openAlert("Please select correct pdf file.");
      }
      this.blob.title = this.filesSelected.name;
      getBase64(this.filesSelected)
        .then((buffer) => {
          this.blob.content = buffer;
          this.licenceDocument.docUrl = this.blob
        })
        .catch(() => {});
      readPdfFile(this.filesSelected)
        .then((pages:Array<object>) => {
          this.canvasPages = pages;
          this.totalPages = pages.length;
          this.renderPage(pages[0]);
        })
        .catch(() => {});
    },
    renderPage: function (page) {
      let scale = 1;
      let viewport = page.getViewport({ scale: scale });

      let canvas: HTMLCanvasElement = document.getElementById(
        "the-canvas"
      ) as HTMLCanvasElement;
      let context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      let renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      page.render(renderContext);
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
