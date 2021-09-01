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
    <no-permission :isLoading="isLoading" :hasPermission="hasPermission" />
    <div v-if="!isLoading && hasPermission" class="pb-8">
      <breadcrumb :linkItems="linkItems" />
      <!-- Licence Document Detail -->
      <form @submit.prevent="handleSubmit">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">
            {{ licenceTemplateDetail.site.brandName }} -
            {{ licenceTemplateDetail.name }} - Update Licence Document
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
            v-if="!this.$store.state.sites.licenceDocumentDetail.error"
          >
            <div>
              <div class="mb-4">
                <label class="text-gray-900 font-bold text-lg mb-2" for="name"
                  >Name</label
                >
                <input
                  class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                  type="text"
                  v-model="licenceDocumentDetail.name"
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
                  v-model="licenceDocumentDetail.description"
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
              <a class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800" v-if="licenceDocumentDetail.docUrl" download="Document" :href="licenceDocumentDetail.docUrl">Download</a>
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
import router from "../../router";
import { getPagesFromURL, getBase64, readPdfFile, getPermission } from '../../helpers/index'
import SelectBox from "../../components/common/SelectBox.vue";
import AlertForm from "../../components/modals/AlertForm.vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import NoPermission from "../../components/common/NoPermission.vue";

export default defineComponent({
  components: {
    SelectBox,
    AlertForm,
    Breadcrumb,
    NoPermission
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    isModalVisible: false,
    alertContent: "",
    siteId: null,
    siteLicenceTemplateId: null,
    siteLicenceDocumentId: null,
    licenceTemplateDetail: {},
    licenceDocumentDetail: {
      name: null,
      description: null,
      docUrl: null,
      isDocuSign: false,
      docuSignTemplateRef: null
    },
    licenceDocument: {},
    licenceDocumentId: null,
    filesSelected: null,
    blob: {
      title: null,
      content: null,
    },
    hasPermission: false
  }),
  setup() {
    const metaData = useMeta({
      title: 'AKARA'
    })
    return { getPermission, metaData }
  },
  created() {
    this.siteId = this.$route.params.siteId;
    this.siteLicenceTemplateId = this.$route.params.siteLicenceTemplateId;
    this.siteLicenceDocumentId = this.$route.params.siteLicenceDocumentId;
    this.hasPermission = this.getPermission(this.siteId)
    if (!this.hasPermission) {
      this.isLoading = false
    } else {
      this.$store.dispatch("sites/licenceTemplateDetail", {
        siteId: this.siteId,
        siteLicenceTemplateId: this.siteLicenceTemplateId,
      });
      this.$store.dispatch(
        "sites/licenceDocumentDetail",
        this.siteLicenceDocumentId
      );
    }
  },
  watch: {
    "$store.state.sites.licenceTemplateDetail": function () {
      this.licenceTemplateDetail = this.$store.state.sites.licenceTemplateDetail.licenceTemplateDetail;
      this.checkLoading();
    },
    "$store.state.sites.licenceDocumentDetail": function () {
      this.licenceDocumentDetail = this.$store.state.sites.licenceDocumentDetail.licenceDocumentDetail;
      if (this.licenceDocumentDetail && this.licenceDocumentDetail.docUrl) {
        getPagesFromURL(this.licenceDocumentDetail.docUrl)
          .then((pages: Array<object>) => {
            this.canvasPages = pages;
            this.totalPages = pages.length;
            this.renderPage(pages[0]);
          })
          .catch(() => {});
      }
      this.checkLoading();
    },
    "$store.state.sites.licenceDocument.licenceDocument": function () {
      if (this.$store.state.sites.licenceDocument.licenceDocument) {
        router.push(
          `/site/${this.siteId}/licence-template/${this.siteLicenceTemplateId}/edit`
        );
      }
    },
  },
  methods: {
    handleSubmit(e) {
      const { name, description, docUrl, isDocuSign, docuSignTemplateRef } = this.licenceDocumentDetail;
      if (name) {
        this.isLoading = true;
        this.$store.dispatch("sites/updateLicenceDocument", {
          siteLicenceDocumentId: this.siteLicenceDocumentId,
          siteLicenceTemplateId: this.siteLicenceTemplateId,
          name: name,
          description: description,
          docUrl: docUrl,
          isDocuSign: isDocuSign,
          docuSignTemplateRef: docuSignTemplateRef,
        });
      } else {
        this.openAlert("Insert required fields");
      }
    },
    checkLoading: function () {
      if (
        (this.$store.state.sites.licenceTemplateDetail.licenceTemplateDetail &&
          this.$store.state.sites.licenceDocumentDetail
            .licenceDocumentDetail) ||
        this.$store.state.sites.licenceDocumentDetail.error
      ) {
        this.linkItems = this.getLinkItems()
        this.metaData.meta.title = `Update Document | ${this.licenceTemplateDetail.name} | ${this.licenceTemplateDetail.site.brandName} | AKARA`
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: 'Sites',
          name: 'Sites',
          params: null
        },
        {
          index: 2,
          title: this.licenceTemplateDetail.site.brandName,
          name: 'SiteDetail',
          params: {
            siteId: this.licenceTemplateDetail.site.siteId,
          }
        },
        {
          index: 3,
          title: this.licenceTemplateDetail.name,
          name: 'LicenceTemplateDetail',
          params: {
            siteId: this.licenceTemplateDetail.site.siteId,
            siteLicenceTemplateId: this.licenceTemplateDetail.siteLicenceTemplateId,
          },
        },
      ]
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
          this.licenceDocumentDetail.docUrl = this.blob;
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
