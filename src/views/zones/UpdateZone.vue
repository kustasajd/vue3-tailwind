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
    <div v-if="hasPermission">
      <breadcrumb :linkItems="linkItems" />
      <div class="flex items-center justify-between" v-if="!isLoading">
        <h3 class="text-gray-700 text-3xl font-semibold">
          Update {{ zone.friendlyName }}
        </h3>
        <div class="flex items-center">          
          <div class="text-center" v-if="zone.floorplanPosition">
            <button
              type="button"
              @click="editPolygon()"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >
              Change Zone
            </button>
          </div>
          <div class="text-center ml-2" v-if="!zone.floorplanPosition">
            <button
              type="button"
              @click="addPolygon()"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >
              Add Zone
            </button>
          </div>
          <div class="text-center ml-2" v-if="zone.floorplanPosition">
            <button
              type="button"
              @click="cancelPolygon()"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
          <div class="text-center ml-2">
            <button
              type="button"
              @click="handleSubmit()"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >
              Update
            </button>
          </div>
        </div>
      </div>     
      <div class="grid gap-4 grid-cols-1 min-3xl:grid-cols-2">
        <!-- Zone Detail -->
        <form class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex" @submit.prevent="handleSubmit" v-if="!isLoading">
          <div>
            <div class="mb-4">
              <div class="text-gray-900 font-bold text-lg mb-2">
                Zone Type
              </div>
              <select-box
                nameField="name"
                valueField="zoneTypeId"
                :options="zoneTypes"
                :selectedValue="zone.zoneTypeId"
                @onSelect="(value) => changeZoneTypeId(value)"
              ></select-box>
            </div>
            <div class="mb-4">
              <label
                class="text-gray-900 font-bold text-lg mb-2"
                for="buildingLevel"
                >Building Level</label
              >
              <input
                class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                type="number"
                v-model="zone.buildingLevel"
              />
            </div>
            <div class="mb-4">
              <label
                class="text-gray-900 font-bold text-lg mb-2"
                for="friendlyName"
                >Friendly Name</label
              >
              <input
                class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                type="text"
                v-model="zone.friendlyName"
              />
            </div>
            <div class="mb-4">
              <label
                class="text-gray-900 font-bold text-lg mb-2"
                for="squareMeters"
                >Square Meters</label
              >
              <input
                class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                type="number"
                step="0.01"
                v-model="zone.squareMeters"
              />
            </div>
            <div class="mb-4">
              <label
                class="text-gray-900 font-bold text-lg mb-2"
                for="squareMeters"
                >Workstations</label
              >
              <input
                class="form-input w-full mt-2 rounded-md focus:border-indigo-600"
                type="number"
                v-model="zone.workstations"
              />
            </div>
            <div class="mb-4">
              <input
                type="checkbox"
                class="form-checkbox h-5 w-5"
                v-model="zone.exclusive"
              /><span class="ml-2 text-gray-700">Exclusive (Only one client licence at a time)</span>
            </div>
            <div class="mb-4">
              <input
                type="checkbox"
                class="form-checkbox h-5 w-5"
                v-model="zone.availableForClients"
              /><span class="ml-2 text-gray-700">Available For client hire</span>
            </div>
          </div>
        </form>
        <!-- Zone Floorplans -->
        <div
          class="zone-polygon rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex justify-center items-center flex-1" v-bind:class="isLoading === true ? 'hidden' : ''"
        >
          <canvas
            class="border border-akara-orange"
            ref="can"
            :width="canvasWidth"
            :height="canvasHeight"
          ></canvas>
        </div>
      </div>
      <!-- Rack Rates -->
      <div class="mt-8 pb-8" v-if="!isLoading">
        <h3 class="text-gray-700 text-3xl font-semibold">Rack Rates</h3>
        <div class="flex items-end justify-between mb-4">
          <div>
            <div class="text-gray-900 font-bold text-lg mb-2">
              Charge Type
            </div>
            <select-box
              nameField="type"
              valueField="productChargeTypeId"
              :options="productChargeTypes"
              :selectedValue="productChargeTypeId"
              @onSelect="(value) => changeProductChargeTypeId(value)"
            ></select-box>
          </div>
          <div>
            <div class="text-gray-900 font-bold text-lg mb-2">Rack Rate ({{this.zone.site.currency.symbol}})</div>
            <input
              class="form-input w-full rounded-md focus:border-indigo-600 max-w-xs mr-2"
              type="number"
              step="0.01"
              placeholder="Rack Rate"
              v-model="rackRate"
            />
          </div>            
          <div>
            <div class="text-gray-900 font-bold text-lg mb-2">
              Tax Rate
            </div>
            <select-box
              nameField="tax"
              valueField="taxRateId"
              :options="taxRates"
              :selectedValue="taxRateId"
              @onSelect="(value) => changeTaxRateId(value)"
            ></select-box>
          </div>
          <button
            class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            type="button"
            @click="addItem()"
          >
            Add
          </button>
        </div>

        <div
          class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto"
          v-if="zone.siteZoneRates && zone.siteZoneRates.length > 0"
        >
          <div
            class="inline-block min-w-full shadow rounded-lg overflow-hidden"
          >
            <table class="min-w-full leading-normal">
              <thead>
                <tr>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Rack Rate
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Charge Type
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Tax Rate
                  </th>
                  <th
                    class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in zone.siteZoneRates" :key="index">
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <p class="text-gray-900 whitespace-no-wrap">
                      {{this.zone.site.currency.symbol}}{{ parseFloat(item.rackRate).toFixed(2) }}
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <p class="text-gray-900 whitespace-no-wrap">
                      {{ item.productChargeType.type }}
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <p class="text-gray-900 whitespace-no-wrap">
                      {{ item.taxRate.tax }} - %{{ item.taxRate.taxPercentage }}
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    <button
                      class="text-indigo-600 hover:text-indigo-900 mr-4"
                      type="button"
                      @click="deleteItem(index)"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useToast } from "vue-toastification";
import router from "../../router";
import SelectBox from "../../components/common/SelectBox.vue";
import AlertForm from "../../components/modals/AlertForm.vue";
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import NoPermission from "../../components/common/NoPermission.vue";
import { getPermission } from "../../helpers/index"
import { fabric } from "fabric";
import {
  polygonPositionHandler,
  anchorWrapper,
  actionHandler,
} from "../../helpers/index";

export default defineComponent({
  components: {
    SelectBox,
    AlertForm,
    Breadcrumb,
    NoPermission
  },
  setup() {
    const toast = useToast();
    return { toast, getPermission }
  },
  mounted() {
    const ref = this.$refs.can;
    this.canvas = new fabric.Canvas(ref, { objectCaching: false });
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    isModalVisible: false,
    alertContent: "",
    siteId: null,
    siteZoneId: null,
    zone: {},
    updatedZone: {},
    zoneTypes: [],
    productChargeTypes: [],
    taxRates: [],
    selSiteId: null,
    hasPermission: false,
    ptsGroup: [],
    polyType: "Polygon",
    poly: false,
    bgColor: "transparent",
    canvasWidth: 1200,
    canvasHeight: 1000,
    grid: 50,
  }),
  created() {
    this.siteId = this.$route.params.siteId;
    this.siteZoneId = this.$route.params.siteZoneId;
    this.hasPermission = this.getPermission(this.siteId)
    if (!this.hasPermission) {
      this.isLoading = false
    } else {
      this.$store.dispatch("zones/getById", { siteZoneId: this.siteZoneId });
      this.$store.dispatch("zones/getZoneTypes");
      this.$store.dispatch("sites/getAllProductChargeType");
      this.$store.dispatch("sites/getAllTaxRate");
    }
  },
  watch: {
    "$store.state.zones.zoneTypes": function () {
      this.zoneTypes = this.$store.state.zones.zoneTypes.zoneTypes;
      this.checkLoading();
    },
    "$store.state.sites.productChargeTypes": function () {
      this.productChargeTypes = this.$store.state.sites.productChargeTypes.productChargeTypes;
      this.checkLoading();
    },
    "$store.state.zones.zone": function () {
      this.zone = this.$store.state.zones.zone.zone;
      if (this.zone) {
        this.drawGrid();
        if (this.zone.site.floorplanPolygons) {
          this.drawPolygons(this.zone.site.floorplanPolygons, "site");
          if (this.zone.floorplanPolygon && this.zone.floorplanPosition) {
            this.drawPolygons(this.zone.floorplanPolygon, `zone${this.zone.siteZoneId}`, this.zone.floorplanPosition);
          }
          this.stopMovement();
        }
        this.checkLoading();
      }
    },
    "$store.state.sites.taxRates": function () {
      this.taxRates = this.$store.state.sites.taxRates.taxRates;
      this.checkLoading();
    },
    "$store.state.zones.updatedZone.updatedZone": function () {
      this.updatedZone = this.$store.state.zones.updatedZone.updatedZone;
      if (this.updatedZone && this.updatedZone.siteZoneId) {
        router.push(`/site/${this.siteId}/zone/${this.updatedZone.siteZoneId}`);
      }
    },
  },
  methods: {
    handleSubmit(e) {
      this.updateFloorplan()
      const {
        siteZoneId,
        zoneTypeId,
        buildingLevel,
        friendlyName,
        squareMeters,
        workstations,
        availableForClients,
        exclusive,
        floorplanPolygon,
        floorplanPosition
      } = this.zone;
      if (!zoneTypeId || workstations === undefined) {
        this.openAlert("Insert required fields");
      } else {
        this.$store.dispatch("zones/update", {
          siteId: this.siteId,
          siteZoneId: siteZoneId,
          zoneTypeId: zoneTypeId,
          buildingLevel: buildingLevel,
          friendlyName: friendlyName,
          squareMeters: squareMeters,
          workstations: workstations,
          availableForClients: availableForClients,
          exclusive: exclusive,
          floorplanPolygon: floorplanPolygon,
          floorplanPosition: floorplanPosition
        });
      }
    },    
    checkLoading: function () {
      if (
        this.$store.state.zones.zoneTypes.zoneTypes &&
        this.$store.state.zones.zone.zone &&
        this.$store.state.sites.productChargeTypes.productChargeTypes && 
        this.$store.state.sites.taxRates.taxRates
      ) {
        this.linkItems = this.getLinkItems();
        this.isLoading = false;
      }
    },
    getLinkItems: function () {
      return [
        {
          index: 1,
          title: this.zone.site.brandName + " - zones",
          name: "Zones",
          params: {
            siteId: this.zone.site.siteId,
          },
        },
      ];
    },
    changeZoneTypeId(value) {
      this.zone.zoneTypeId = value;
    },
    addItem() {
      if (this.rackRate && this.productChargeTypeId && this.taxRateId) {
        this.$store.dispatch("zones/createSiteZoneRate", {
          siteZoneId: this.zone.siteZoneId,
          rackRate: this.rackRate,
          productChargeTypeId: this.productChargeTypeId,
          taxRateId: this.taxRateId
        });
      } else {
        this.openAlert("Insert required fields");
      }
    },
    deleteItem(index) {
      this.$store.dispatch(
        "zones/deleteSiteZoneRate",
        this.zone.siteZoneRates[index]
      );
    },
    changeProductChargeTypeId(value) {
      this.productChargeTypeId = value;
    },
    changeTaxRateId(value) {
      this.taxRateId = value;
    },
    onClose() {
      this.isModalVisible = false;
      this.alertContent = "";
    },
    openAlert(value) {
      this.alertContent = value;
      this.isModalVisible = true;
      return;
    },
    editPolygon: function () {
      const canvas = this.canvas;
      let polyObjs = canvas._objects.filter(object => { return object.id && object.id.includes(`zone${this.zone.siteZoneId}`) })
      let polyObj = polyObjs.find(obj => {return obj.points.length>0})
      if (!polyObj) {
        this.toast.info("Please select zone area");
        return;
      }
      canvas.setActiveObject(polyObj);
      polyObj.edit = !polyObj.edit;
      if (polyObj.edit) {
        var lastControl = polyObj.points.length - 1;
        polyObj.cornerStyle = "circle";
        polyObj.cornerColor = "rgba(0,0,255,0.5)";

        polyObj.controls = polyObj.points.reduce(function (acc, point, index) {
          acc["p" + index] = new fabric.Control({
            positionHandler: polygonPositionHandler,
            actionHandler: anchorWrapper(
              index > 0 ? index - 1 : lastControl,
              actionHandler
            ),
            actionName: "modifyPolygon",
            pointIndex: index,
          });

          return acc;
        }, {});
      } else {
        polyObj.cornerColor = "blue";
        polyObj.cornerStyle = "rect";
        polyObj.controls = fabric.Object.prototype.controls;
      }
      polyObj.hasBorders = !polyObj.edit;
      canvas.requestRenderAll();
    },

    cancelPolygon() {
      this.canvas.discardActiveObject().renderAll();
      this.canvas._objects = this.canvas._objects.filter(object => { 
        return !object.id || (object.id && !object.id.includes(`zone${this.zone.siteZoneId}`))
      });
      this.zone.floorplanPolygon = null
      this.zone.floorplanPosition = null
      this.canvas.requestRenderAll();
    },

    updateFloorplan() {
      this.canvas._objects.forEach(object => {
        if (object.id && object.id.includes("zone")) {
          const chars = object.id.split('-');
          if (this.zone.siteZoneId === parseInt(chars[0].substring(4, chars[0].length))) {
            let zoneFloorplanPolygon = JSON.parse(this.zone.floorplanPolygon)
            zoneFloorplanPolygon[chars[1]] = object.points
            this.zone.floorplanPolygon = JSON.stringify(zoneFloorplanPolygon)
            this.zone.floorplanPosition = JSON.stringify({
              "left": object.left,
              "top": object.top
            })
          }
        }
      });
    },

    drawPolygons: function (floorplanPolygons, type, position) {
      const obj = JSON.parse(floorplanPolygons);
      if (obj) {
        this.ptsGroup = Object.entries(obj).map(([key, value]) => ({
          key,
          value,
        }));
        const canvas = this.canvas;
        const { polyType, ptsGroup } = this;
        let bgColor = type === "site" ? "transparent" : "#78DE6D";
        canvas.forEachObject(function (obj) {
          if (obj.name == "temp") {
            canvas.remove(obj);
          }
        });
        if (ptsGroup && this.ptsGroup.length > 0) {
          ptsGroup.forEach((pts) => {
            if (position) {
              const polyObj = new fabric[polyType](pts.value, {
                objectCaching: false,
                id: `${type}-${pts.key}`,
                fill: bgColor,
                stroke: "black",
                strokeWidth: 1,
                originX: "center",
                originY: "center",
                selectable: true,
                left: JSON.parse(position).left,
                top: JSON.parse(position).top,
              });
              canvas.add(polyObj);
            } else {
              const polyObj = new fabric[polyType](pts.value.points, {
                objectCaching: false,
                id: `${type}-${pts.key}`,
                fill: bgColor,
                stroke: "black",
                strokeWidth: 1,
                originX: "center",
                originY: "center",
                selectable: false,
                left: pts.value.left,
                top: pts.value.top,
              });
              canvas.add(polyObj);
            }
          });
        }
        this.poly = false;
        this.ptsGroup = [];
      }
      
    },

    // create grid
    drawGrid: function () {
      const { canvas, canvasHeight, canvasWidth, grid } = this;
      for (var i = 0; i < canvasWidth / grid; i++) {
        canvas.add(
          new fabric.Line([i * grid, 0, i * grid, canvasHeight], {
            type: "line",
            stroke: "#ccc",
            selectable: false,
          })
        );
        canvas.add(
          new fabric.Line([0, i * grid, canvasWidth, i * grid], {
            type: "line",
            stroke: "#ccc",
            selectable: false,
          })
        );
      }
    },

    stopMovement: function () {
      const canvas = this.canvas;
      canvas.on({
        "object:moving": function (e) {
          e.target.lockScalingX = true;
          e.target.lockScalingY = true;
          e.target.lockRotation = true;
        },
      });      
    },

    addPolygon(polyType) {
      this.polyType = polyType;
      this.poly = true;
      this.drawCanvas(this.canvas);
      this.stopMovement();
    },
	
    drawCanvas(canvas) {
      let obj,
        polyline,
        mouseDown = false,
        pts = [],
        lastPt = 1,
        polyType = "Polygon",
        polyBtn,
        poly = true,
        bgColor = "#78DE6D";
      if (this.polyType) polyType = this.polyType;
      if (this.poly) poly = this.poly;

      let that = this

      canvas.on("mouse:down", function (e) {
        let mouse = canvas.getPointer(e.e);
        if (poly == true) {
          if (pts.length > 1) {
            pts.splice(-1, 1);
          } //remove duplicate start points
          polyline = new fabric.Polyline(pts, {
            objectCaching: false,
            name: "temp",
            fill: "",
            stroke: "black",
            originX: "center",
            originY: "center",
            selectable: false
          });
          canvas.add(polyline);
          polyline.points[pts.length] = { x: mouse.x, y: mouse.y };
          lastPt++;
          mouseDown = true;
          console.log(JSON.stringify(pts));
        }
      });

      canvas.on("mouse:move", function (e) {
        let mouse = canvas.getPointer(e.e);
        if (poly == true && mouseDown) {
          polyline.points[lastPt - 1] = { x: mouse.x, y: mouse.y };
          canvas.renderAll();
        }
      });

      canvas.on("mouse:dblclick", function (e) {
        canvas.forEachObject(function (obj) {
          if (obj.name == "temp") {
            canvas.remove(obj);
          }
        });
        const polyObj = new fabric[polyType](pts, {
          objectCaching: false,
          id: `zone${that.zone.siteZoneId}-zone`,
          fill: bgColor,
          stroke: "black",
          strokeWidth: 1,
          originX: "center",
          originY: "center",
          selectable: true,
        });
        canvas.add(polyObj);
        poly = false;
        polyBtn = "";
        lastPt = 1;
        mouseDown = false;
        pts = [];
        let obj = canvas._objects.filter(object => { return object.id && object.id.includes(`zone${that.zone.siteZoneId}`) })[0]
        that.updateZoneData(obj.points, obj.left, obj.top)
      }); //end dblclick
      
      canvas.on("selection:created", function () {
        obj = canvas.getActiveObject();
      });
      canvas.on("selection:cleared", function () {
        obj = "";
      });      
    },
	
    updateZoneData(points, left, top) {
      this.zone.floorplanPolygon = JSON.stringify({"zone": points})
      this.zone.floorplanPosition = JSON.stringify({"left": left, "top": top})
    }
  },
});
</script>
<style lang="scss">
  .zone-polygon {
    .canvas-container {
      overflow: scroll !important;
    }
  }
</style>
