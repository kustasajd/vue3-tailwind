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
    <div v-if="!isLoading && hasPermission">
      <breadcrumb :linkItems="linkItems" />
      <!-- Licence Document Detail -->
      <form @submit.prevent="handleSubmit">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-700 text-3xl font-semibold">
            {{ licenceTemplateDetail.name }} - Create Licence Document
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
                <input
                  type="checkbox"
                  class="form-checkbox h-5 w-5"
                  v-model="licenceDocument.isDocuSign"
                /><span class="ml-2 text-gray-700">Is this going to be a DocuSign template document?</span>
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
import { useMeta } from 'vue-meta'
import router from "../../router";
import { getBase64, readPdfFile, getPermission } from '../../helpers/index'
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
    licenceTemplateDetail: {},
    licenceDocument: {
      name: null,
      description: null,
      docUrl: null,
      isDocuSign: false
    },
    licenceDocumentId: null,
    filesSelected: null,
    blob: {
      title: null,
      content: null,
    },
    hasPermission: false,
  }),
  setup() {
    const metaData = useMeta({
      title: 'AKARA'
    })
    return { getPermission, metaData }
  },
  created() {
    this.siteId = this.$route.params.siteId;
    this.hasPermission = this.getPermission(this.siteId)
    this.siteLicenceTemplateId = this.$route.params.siteLicenceTemplateId;
    if (!this.hasPermission) {
      this.isLoading = false
    } else {
      this.$store.dispatch("sites/licenceTemplateDetail", {
        siteId: this.siteId,
        siteLicenceTemplateId: this.siteLicenceTemplateId,
      });
    }
    
  },
  watch: {
    "$store.state.sites.licenceTemplateDetail": function () {
      this.licenceTemplateDetail = this.$store.state.sites.licenceTemplateDetail.licenceTemplateDetail;
      this.checkLoading();
    },
    "$store.state.sites.licenceDocument.licenceDocument": function () {
      this.licenceDocument = this.$store.state.sites.licenceDocument.licenceDocument;
      if (this.licenceDocument && this.licenceDocument.siteLicenceDocumentId) {
        router.push(
          `/site/${this.siteId}/licence-template/${this.siteLicenceTemplateId}/edit`
        );
      }
    },
  },
  methods: {    
    checkLoading: function () {
      if (this.$store.state.sites.licenceTemplateDetail.licenceTemplateDetail) {
        this.linkItems = this.getLinkItems()
        this.metaData.meta.title = `Add Document | ${this.licenceTemplateDetail.name} | ${this.licenceTemplateDetail.site.brandName} | AKARA`
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: 'Licence Templates',
          name: 'LicenceTemplates',
          params: {
            siteId: this.siteId
          }
        },
        {
          index: 2,
          title: this.licenceTemplateDetail.name,
          name: 'LicenceTemplateDetail',
          params: {
            siteId: this.licenceTemplateDetail.site.siteId,
            siteLicenceTemplateId: this.licenceTemplateDetail.siteLicenceTemplateId,
          },
        },
        {
          index: 3,
          title: 'Edit',
          name: 'UpdateLicenceTemplate',
          params: {
            siteId: this.licenceTemplateDetail.site.siteId,
            siteLicenceTemplateId: this.licenceTemplateDetail.siteLicenceTemplateId,
          },
        },
        {
          index: 4,
          title: 'Create Document',
          name: 'CreateSiteLicenceDocument',
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
          this.licenceDocument.docUrl = this.blob;
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
    handleSubmit(e) {
      const { name, description, docUrl, isDocuSign } = this.licenceDocument;
      if (!name) {
        this.openAlert("Insert required fields");
      } else if (
        this.filesSelected &&
        this.filesSelected.type !== "application/pdf"
      ) {
        this.openAlert("Please select correct pdf file.");
      } else {
        this.isLoading = true
        const data = {
          siteLicenceTemplateId: this.siteLicenceTemplateId,
          name: name,
          description: description,
          docUrl: docUrl,
          isDocuSign: isDocuSign
        };
        this.$store.dispatch("sites/createLicenceDocument", data);
      }
    },
  },
});
</script>
