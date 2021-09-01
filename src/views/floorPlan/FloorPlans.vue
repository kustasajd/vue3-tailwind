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
    </div>
    <div v-bind:class="isLoading === true ? 'hidden' : 'block'">
      <div class="flex items-center justify-between">
        <h3 class="text-gray-700 text-3xl font-semibold">Floor Plan</h3>
        <div class="flex items-center">
          <div class="text-center">
            <router-link
              :to="{
                name: 'UpdateFloorplan',
                params: null,
              }"
              class="py-2 px-4 text-center bg-gray-900 rounded-md w-40 text-white text-sm hover:bg-gray-800"
              >Edit
            </router-link>
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
import Breadcrumb from "../../components/common/Breadcrumb.vue";
import { fabric } from "fabric";
import moment from "moment";

export default defineComponent({
  components: {
    Breadcrumb,
  },
  mounted() {
    const ref = this.$refs.can;
    this.canvas = new fabric.Canvas(ref, { objectCaching: false });
  },
  data: () => ({
    isLoading: true,
    linkItems: [],
    site: null,
    ptsGroup: [],
    polyType: "Polygon",
    poly: false,
    bgColor: "transparent",
    canvasWidth: 1200,
    canvasHeight: 1000,
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
    }
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
      if (this.site && this.site.floorplanPolygons) {
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
      }
      this.checkLoading();
    },
  },
  methods: {
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
              const polyObj = new fabric[polyType](pts.value, {
                objectCaching: false,
                id: `${type}-${pts.key}`,
                fill: bgColor || information.bgColor,
                stroke: information.bgColor.borderColor || 'gray',
                strokeWidth: 1,
                originX: "center",
                originY: "center",
                selectable: false,
                left: JSON.parse(position).left,
                top: JSON.parse(position).top,
              });
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
              const text = new fabric.Text(
                textContent,
                {
                  fontSize: 14,
                  fill: information.bgColor.color || '',
                  originX: "center",
                  originY: "center",
                  textAlign: "center",
                  selectable: false,
                  left: JSON.parse(position).left,
                  top: JSON.parse(position).top,
                }
              );
              polyObj.hoverCursor = 'pointer';
              polyObj.on('mousedown', function(e) { 
                const str = e.target.id.split('-')[0]
                const siteZoneId = parseInt(str.substring(4, str.length))
                router.push(`/site/${self.siteId}/zone/${siteZoneId}/edit`);
              });
              canvas.add(polyObj);
              canvas.add(text);
            } else {
              const polyObj = new fabric[polyType](pts.value.points, {
                objectCaching: false,
                id: `${type}-${pts.key}`,
                fill: bgColor,
                stroke: "gray",
                strokeWidth: 3,
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
    stopMovement: function () {
      const canvas = this.canvas;
      canvas.on({
        "object:moving": function (e) {
          e.target.lockMovementX = true;
          e.target.lockMovementY = true;
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
  },
});
</script>
<style lang="scss">
</style>
