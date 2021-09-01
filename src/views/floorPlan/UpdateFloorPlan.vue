<template>
  <div class="h-full">
    <modal-confirm 
      :showConfirmModal="showConfirmModal" 
      :alertContent="alertContent" 
      @onCloseConfirmModal="() => onCloseConfirmModal()"
      @onDelete="() => onDelete()"
    >
    </modal-confirm>
    <div
      class="h-full my-auto flex items-center justify-center"
      v-if="isLoading"
    >
      <img class="w-20 h-20" src="../../assets/icons/spinner.gif" alt="" />
    </div>
    <div v-if="!isLoading">
      <breadcrumb :linkItems="linkItems" />
    </div>
    <div v-bind:class="isLoading === true ? 'hidden' : 'block'">
      <div class="flex items-center justify-between">
        <h3 class="text-gray-700 text-3xl font-semibold">Update Floor Plan</h3>
        <div class="flex items-center"> 
          <div class="text-center">
            <button
              type="button"
              @click="addPolygon()"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >
              Add floorplan
            </button>
          </div>     
          <div class="text-center ml-2" v-if="site && site.floorplanPolygons && showBtn">
            <button
              type="button"
              @click="deletePolygon()"
              class="py-2 px-4 text-center bg-gray-900 rounded-md text-white text-sm hover:bg-gray-800"
            >
              Delete floorplan
            </button>
          </div>    
          <div class="text-center ml-2" v-if="showZoneBtn">
            <button
              type="button"
              @click="editPolygon()"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >
              Change Zone Shape
            </button>
          </div>
          <div class="text-center ml-2" v-if="showBtn">
            <button
              type="button"
              @click="editPolygon()"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >
              Change floorplan
            </button>
          </div>
          <div class="text-center ml-2">
            <button
              type="button"
              @click="UpdateFloorplan()"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
            >
              Save
            </button>
          </div>
        </div>
      </div>
      <div>
        <a-tag color="green">Active licences</a-tag>
        <a-tag color="orange">Active licence expiring soon</a-tag>
        <a-tag color="red">No active licence</a-tag>
        <a-tag color="cyan">Coworking, meeting room or conference room</a-tag>
        <a-tag color="blue">Common Area</a-tag>
        <a-tag color="purple">Month-by-Month</a-tag>
      </div>
      <div class="mt-4 mb-3">
        <div
          class="rounded bg-white overflow-hidden shadow-lg mt-6 px-6 py-4 flex justify-center"
        >
          <canvas
            class="border border-akara-orange"
            ref="can"
            :width="canvasWidth"
            :height="canvasHeight"
          ></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "../../router";
import moment from "moment";
import { useToast } from "vue-toastification";
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import ModalConfirm from "../../components/modals/ModalConfirm.vue";
import { fabric } from "fabric";
import {
  polygonPositionHandler,
  anchorWrapper,
  actionHandler,
} from "../../helpers/index";

export default defineComponent({
  setup() {
    const toast = useToast();
    return {
      toast,
    };
  },

  components: {
    Breadcrumb,
    ModalConfirm
  },

  mounted() {
    const ref = this.$refs.can;
    this.canvas = new fabric.Canvas(ref, { objectCaching: false });
  },

  data: () => ({
    isLoading: true,
    linkItems: [],
    submitted: false,
    site: null,
    showConfirmModal: false,
    alertContent: "",
    ptsGroup: [],
    polyType: "Polygon",
    poly: false,
    bgColor: "transparent",
    canvasWidth: 1200,
    canvasHeight: 1000,
    grid: 50,
    activeColor: {
      color: '#389E0D',
      backgroud: '#F6FFED',
      borderColor: '#B7EB8F'
    },
    noActiveColor: {
      color: '#CF1322',
      backgroud: '#FFF1F0',
      borderColor: '#FFA39E'
    },
    activeExpiringColor: {
      color: '#D46B08',
      backgroud: '#FFF7E6',
      borderColor: '#FFD591'
    },
    roomColor: {
      color: '#08979C',
      backgroud: '#E6FFFB',
      borderColor: '#87E8DE'
    },
    commonColor: {
      color: '#096DD9',
      backgroud: '#E6F7FF',
      borderColor: '#91D5FF'
    },
    monthColor: {
      color: '#531DAB',
      backgroud: '#F9F0FF',
      borderColor: '#D3ADF7'
    },
    showBtn: false,
    showZoneBtn: false
  }),

  created() {
    this.siteId = JSON.parse(
      localStorage.getItem("user")
    ).user.selectedSite.siteId;
    this.$store.dispatch("floorplans/getById", { id: this.siteId });
  },

  watch: {
    "$store.state.floorplans.site": function () {
      this.site = this.$store.state.floorplans.site.site;
      if (this.submitted === false && this.site) {
        this.drawGrid();
        if (this.site.floorplanPolygons) {
          this.drawPolygons(this.site.floorplanPolygons, "site");
          if (this.site.siteZones && this.site.siteZones.length > 0) {
            this.site.siteZones.forEach((zone) => {
              if (zone.floorplanPolygon && zone.floorplanPosition) {
                zone.licenceZones = zone.licenceZones.filter((licenceZone) => {
                  return licenceZone.active === true && licenceZone.licence.active === true;
                })
                zone.info = {
                  zoneName: zone.friendlyName,
                  clientName:
                    zone.licenceZones && zone.licenceZones.length === 1
                      ? zone.licenceZones[0].licence.client.tradingName
                      : null,
                  licencePrice:
                    zone.licenceZones && zone.licenceZones.length === 1
                      ? `${this.site.currency.symbol}${zone.licenceZones[0].rate}`
                      : null,
                  licenceExpiryDate:
                    zone.licenceZones && zone.licenceZones.length === 1
                      ? moment(zone.licenceZones[0].licence.validUntil).format(
                          "YYYY-MM-DD"
                        )
                      : null,
                  licenceNum: zone.licenceZones.length > 1 ? `${zone.licenceZones.length} Licences` : null,
                  bgColor: this.getBgColor(zone),
                };
                this.drawPolygons(
                  zone.floorplanPolygon,
                  `zone${zone.siteZoneId}`,
                  zone.floorplanPosition,
                  zone.info
                );
              }
            });
          }
          this.stopMovement();
          this.selectPolygon();
        }
        this.checkLoading();
      } else if (this.submitted === true && this.site) {
        this.isLoading = false
        router.push(`/floorplan`);
      }
    },
  },

  methods: {
    addPolygon() {
      this.poly = true;
      this.drawCanvas(this.canvas);
      this.stopMovement();
      this.selectPolygon();
    },
	
    drawCanvas(canvas) {
      let addedId = 'area1'
      if (this.site.floorplanPolygons) {
        const objects = JSON.parse(this.site.floorplanPolygons);
        const ptsGroup = Object.entries(objects).map(([key, value]) => ({
          key,
          value,
        }));
        
        if (ptsGroup) {
          const keyString = ptsGroup[ptsGroup.length-1].key
          addedId = `area${parseInt(keyString.slice(4, keyString.length))+1}`
        }
      }
      let obj,
        polyline,
        mouseDown = false,
        pts = [],
        lastPt = 1,
        polyType = "Polygon",
        poly = true,
        bgColor = "transparent";
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
            selectable: true,
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
          id: `site-${addedId}`,
          fill: bgColor,
          stroke: "black",
          strokeWidth: 1,
          originX: "center",
          originY: "center",
          selectable: true,
        });
        canvas.add(polyObj);
        poly = false;
        lastPt = 1;
        mouseDown = false;
        pts = [];
        let obj = canvas._objects.filter(object => { return object.id && object.id.includes(addedId) })[0]
        that.updateSiteData(obj.points, obj.left, obj.top, addedId)
      }); //end dblclick
      
      canvas.on("selection:created", function () {
        obj = canvas.getActiveObject();
      });
      canvas.on("selection:cleared", function () {
        obj = "";
      });
    },
    updateSiteData(points, left, top, addedId) {
      let areas = JSON.parse(this.site.floorplanPolygons);
      if (!areas) {
        areas = {}
      }
      areas[addedId] = {points: points, left: left, top: top}
      this.site.floorplanPolygons = JSON.stringify(areas)
    },
    editPolygon: function () {
      const canvas = this.canvas;
      let polyObj = canvas.getActiveObject();
      if (!polyObj || (polyObj && !polyObj.points)) {
        this.toast.info("Please select area");
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

    UpdateFloorplan() {
      let floorplanPolygons = JSON.parse(this.site.floorplanPolygons)
      this.canvas._objects.forEach(object => {
        if (object.id && object.id.includes("site-")) {
          floorplanPolygons[object.id.substring(5, object.id.length)].points = object.points
          floorplanPolygons[object.id.substring(5, object.id.length)].left = object.left
          floorplanPolygons[object.id.substring(5, object.id.length)].top = object.top
        } else if (object && object.id && object.id.includes("zone")) {
          const chars = object.id.split('-');
          this.site.siteZones.forEach(zone => {
            if (zone.siteZoneId === parseInt(chars[0].substring(4, chars[0].length))) {
              let zoneFloorplanPolygon = JSON.parse(zone.floorplanPolygon)
              zoneFloorplanPolygon[chars[1]] =object.points
              zone.floorplanPolygon = JSON.stringify(zoneFloorplanPolygon)
              zone.floorplanPosition = JSON.stringify({
                "left": object.left,
                "top": object.top
              })
            }
          });
        }
      });
      this.site.floorplanPolygons = JSON.stringify(floorplanPolygons)
      this.submitted = true
      this.isLoading = true
      this.$store.dispatch("floorplans/update", this.site);
    },

    drawPolygons: function (floorplanPolygons, type, position, information) {
      const obj = JSON.parse(floorplanPolygons);
      if (obj) {
        this.ptsGroup = Object.entries(obj).map(([key, value]) => ({
          key,
          value,
        }));
        const canvas = this.canvas;
        const { polyType, ptsGroup } = this;
        let bgColor = type === "site" ? "transparent" : information.bgColor.backgroud;
        canvas.forEachObject(function (obj) {
          if (obj.name == "temp") {
            canvas.remove(obj);
          }
        });
        let self = this;
        if (ptsGroup && this.ptsGroup.length > 0) {
          ptsGroup.forEach((pts) => {
            if (position) {
              let textContent
              if (information.clientName && information.licenceExpiryDate !== 'Invalid date') {
                textContent = `${information.zoneName}\n${information.clientName}\n${information.licencePrice}\n${information.licenceExpiryDate}`
              } else if(information.clientName && information.licenceExpiryDate === 'Invalid date') {
                textContent = `${information.zoneName}\n${information.clientName}\n${information.licencePrice}`
              } else if(!information.clientName && information.licenceNum) {
                textContent = `${information.zoneName}\n${information.licenceNum}`
              } else if(!information.clientName && !information.licenceNum) {
                textContent = `${information.zoneName}`
              }
              const polyObj = new fabric[polyType](pts.value, {
                objectCaching: false,
                id: `${type}-${pts.key}`,
                fill: bgColor || information.bgColor,
                stroke: information.bgColor.borderColor || 'gray',
                strokeWidth: 1,
                originX: "center",
                originY: "center",
                selectable: true,
                left: JSON.parse(position).left,
                top: JSON.parse(position).top,
              });    
              const text = new fabric.Text(
                textContent,
                {
                  objectCaching: false,
                  lockScalingX: true,
                  lockScalingY: true,
                  lockRotation: true,
                  fontSize: 14,
                  fill: information.bgColor.color || '',
                  originX: "center",
                  originY: "center",
                  textAlign: "center",
                  selectable: true,
                  left: JSON.parse(position).left,
                  top: JSON.parse(position).top,
                }
              );          
              // const group = new fabric.Group([polyObj, text], {
              //   subTargetCheck: true,
              //   selectable: true,
              //   left: JSON.parse(position).left,
              //   top: JSON.parse(position).top,
              // });
              canvas.add(polyObj)
              canvas.add(text)
              // canvas.add(group);
            } else {
              const polyObj = new fabric[polyType](pts.value.points, {
                objectCaching: false,
                id: `${type}-${pts.key}`,
                fill: bgColor,
                stroke: "gray",
                strokeWidth: 3,
                originX: "center",
                originY: "center",
                selectable: true,
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

    selectPolygon: function () {
      const canvas = this.canvas;
      let self = this
      canvas.on({
        'selection:created': function (e) {
          self.onShowBtn()
        },
        'selection:updated': function (e) {
          self.onShowBtn()
        },
        'selection:cleared': function (e) {
          self.onShowBtn()
        }
      });
    },

    onShowBtn: function () {
      let obj = this.canvas.getActiveObject()
      if (obj && obj.id && obj.id.includes(`site-`)) {
        this.showBtn = true
      } else if(obj && obj.id && obj.id.includes(`-zone`)) {
        this.showZoneBtn = true
      } else {
        this.showBtn = false
        this.showZoneBtn = false
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

    getBgColor: function (zone) {
      if (
        zone.zoneTypeId === 3 ||
        zone.zoneTypeId === 6 ||
        zone.zoneTypeId === 7
      )
        //light blue
        return this.roomColor;
      else if (
        zone.zoneTypeId === 2 ||
        zone.zoneTypeId === 4 ||
        zone.zoneTypeId === 5
      )
        //blue
        return this.commonColor;
      else if (
        !zone.licenceZones ||
        (zone.licenceZones && zone.licenceZones.length === 0)
      )
        return this.noActiveColor;
      else if (zone.licenceZones && zone.licenceZones.length > 0) {
        if (
          zone.licenceZones.filter((licenceZone) => {
            return licenceZone.licence.active === true;
          }).length > 0
        ) {
          let bgColor = this.activeColor
          let licenceStatusType16 = 0
          let expirein3monthNum = 0
          let activeNum = 0
          let inActiveNum = 0
          zone.licenceZones.forEach((licenceZone) => {
            if (licenceZone.licence.licenceStatusTypeId === 16) {
              licenceStatusType16++
            }
            const now = new Date();
            const validUntil = moment(licenceZone.licence.validUntil).format(
              "YYYY-MM-DD"
            );            
            const diffMonth = moment(validUntil).diff(moment(now), "months");
            const diffDays = moment(validUntil).diff(moment(now), "days");
            if (diffDays > 0 && diffMonth < 3) {
              expirein3monthNum++
            } else if (diffDays <=0) {
              inActiveNum++
            } else if (diffDays>0 && diffMonth >= 3) {
              activeNum++
            }
          });
          if (licenceStatusType16 > 0) {
            bgColor = this.monthColor
          } else if (expirein3monthNum > 0) {
            bgColor = this.activeExpiringColor;
          } else if(activeNum > 0) {
            bgColor = this.activeColor;
          } else if(inActiveNum > 0) {
            bgColor = this.noActiveColor;
          }
          return bgColor
        } else {
          return "#78DE6D";
        }
      } else return "#78DE6D";
    },

    checkLoading: function () {
      if (this.$store.state.floorplans.site.site) {
        this.linkItems = this.getLinkItems();
        this.isLoading = false;
      }
    },

    getLinkItems: function () {
      return [
        {
          index: 1,
          title: "Floorplans",
          name: "Floorplans",
          params: null,
        },
      ];
    },
    deletePolygon: function () {
      this.showConfirmModal = true
      this.alertContent = "Are you sure you want to delete this shape?"
    },
    onDelete() {
      this.showConfirmModal = false
      this.alertContent = ""
      let obj = this.canvas.getActiveObject()
      if (!obj) {
        this.toast.info("Please select polygon");
      } else {
        if (obj.id && obj.id.includes(`site-`)) {
          if (this.site.floorplanPolygons) {
            let objects = JSON.parse(this.site.floorplanPolygons);
            delete objects[obj.id.split('-')[1]];
            this.site.floorplanPolygons = JSON.stringify(objects)
            this.canvas.discardActiveObject().renderAll();
            this.canvas._objects = this.canvas._objects.filter(object => { 
              return !object.id || (object.id && !object.id.includes(obj.id))
            });
            this.canvas.requestRenderAll();
            this.$store.dispatch("floorplans/updateSite", {
              floorplanPolygons: this.site.floorplanPolygons,
              siteId: this.site.siteId
            });
          }
        } else {
          this.toast.info("Please select polygon");
        }
      }
    },
    onCloseConfirmModal() {
      this.showConfirmModal = false
      this.alertContent = ""
    },
  },
});
</script>
<style lang="scss">
</style>
