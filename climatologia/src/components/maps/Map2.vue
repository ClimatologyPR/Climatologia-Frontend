<template>
  <div style="height: 100%;display:flex;">
    <div
      style="background-color: #e1e2e1; display:flex; height:100%; width:100%;"
    >
      <v-card tile elevation="1" height="100%" width="100%">
        <div class="date">
          <div class="dateContent">
            <div class="date2" id="date2" @click="calendarOpen">
              <h2>
                {{
                  date && selectedDateType === "Día"
                    ? SingleDateText
                    : rangeDateText
                }}
              </h2>
            </div>
            <div class="calendar" @mouseleave="calendarClose()">
              <v-date-picker
                v-if="selectedDateType === 'Día'"
                id="calendar"
                locale="es-ES"
                v-model="date"
                color="#2bbbbb"
                @input="calendarClose()"
                no-title
                :show-current="false"
                scrollable
                min="2000-08-15"
                max="2019-03-20"
              >
              </v-date-picker>
              <v-date-picker
                v-if="selectedDateType === 'Rango'"
                id="calendar"
                locale="es-ES"
                v-model="date"
                color="#2bbbbb"
                @input="calendarClose()"
                no-title
                :show-current="false"
                scrollable
                min="2000-08-15"
                max="2019-03-20"
                range
              >
              </v-date-picker>
            </div>
          </div>
        </div>

        <a @click="recenter()" class="centerBtn"
          ><v-icon color="white">mdi-map-marker-radius</v-icon></a
        >

        <l-map
          :key="mapChanged"
          class="map"
          ref="map"
          v-if="showMap"
          :zoom="zoom"
          :center="center"
          :options="mapOptions"
          style="z-index: 0;"
          @update:center="centerUpdate"
          @update:zoom="zoomUpdate"
          :max-bounds="maxBounds"
          :min-zoom="minZoom"
        >
          <l-tile-layer :url="url" />
          <l-control position="bottomleft" style="pointer-events: none;">
            <v-card class="ml-0 pa-1 leyenda">
              <h3>Leyenda</h3>
              <v-row dense class="pl-2 pr-2">
                <v-col class="pa-0 pt-1 pr-1">
                  <v-img
                    class="ml-1"
                    style="float:left;"
                    :src="require('../../assets/nullicon.png')"
                    height="15px"
                    width="15px"
                  />
                </v-col>
                <h4 class="mr-1">Valor Nulo</h4>
                <v-col class="pl-1 pt-1 pr-1">
                  <v-img
                    style="float:left;"
                    :src="require('../../assets/noaa.png')"
                    height="15px"
                    width="15px"
                  />
                </v-col>
                <h4 class="mr-1">NOAA</h4>
                <v-col class="pl-1 pt-1 pr-1">
                  <v-img
                    style="float:left;"
                    :src="require('../../assets/usgs.png')"
                    height="15px"
                    width="15px"
                  />
                </v-col>
                <h4 class="mr-1">USGS</h4>
              </v-row>
            </v-card>
          </l-control>
          <l-control position="bottomleft" style="pointer-events: none;">
            <v-card
              width="60%"
              class="ml-0"
              style="background-colo:white; justify-content:center;display:flex;"
            >
              <img
                v-if="currentPinView === 'prcp'"
                :src="require('../../assets/precipitation_legend_bar.svg')"
                style="width:15vh; height: 40vh;"
              />
              <img
                v-else
                :src="require('../../assets/temperature_legend_bar.svg')"
                style="width:17vh; height:40vh;"
              />
            </v-card>
          </l-control>
          <v-container v-model="stationsList">
            <div
              v-for="(station, i) in stationsList"
              :key="
                `${station.DATE}-${Math.floor(
                  Math.random() * Math.floor(100000)
                )}-${station.STATIONID}`
              "
            >
              <l-marker
                :lat-lng="coordinates(station.LATITUDE, station.LONGITUDE)"
                :icon="iconList[i]"
              >
                <l-popup>
                  <strong> Agencia: </strong>
                  {{ station.AGENCYID }}
                  <br />
                  <strong>ID de Estación: </strong>
                  {{ station.STATIONID.toString() }}
                  <br />
                  <strong>Municipio: </strong>
                  {{ station.MUNICIPALITY.toString() }}
                  <br />
                  <strong>Zona Climática: </strong>
                  {{ station.CLIMATEZONE.toString() }}
                  <br />
                  <div v-if="selectedDateType === 'Día'">
                    <strong>
                      {{
                        currentPinView === "prcp"
                          ? "Precipitación:"
                          : currentPinView === "tmax"
                          ? "Temperatura Máxima"
                          : "Temperatura Mínima"
                      }}</strong
                    >
                    {{
                      station.VALUE === null || station.VALUE === undefined
                        ? "NULL"
                        : station.VALUE.toString()
                    }}
                    {{
                      currentPinView === "prcp" && station.VALUE !== null
                        ? '"'
                        : station.VALUE !== null
                        ? "°F"
                        : ""
                    }}
                    <br />
                  </div>
                  <div
                    v-else-if="
                      selectedDateType === 'Rango' &&
                        station.AVGVALUE != undefined
                    "
                  >
                    <strong v-if="currentPinView === 'prcp'">
                      Precipitación Promedio:
                    </strong>
                    <strong v-else-if="currentPinView === 'tmax'"> Temperatura Máxima Promedio: </strong>
                    <strong v-else> Temperatura Mínima Promedio: </strong>
                    {{ station.AVGVALUE.toString() }} <span v-if="currentPinView === 'prcp'">"</span><span v-else>ºF</span>
                    <br />
                    <strong>Máximo: </strong>
                    {{ station.MAXVALUE.toString() }} <span v-if="currentPinView === 'prcp'">"</span><span v-else>ºF</span>
                    <br />
                    <strong>Mínimo: </strong>
                    {{ station.MINVALUE.toString() }} <span v-if="currentPinView === 'prcp'">"</span><span v-else>ºF</span>
                    <br />
                    <strong>Desviación Estándar: </strong
                    >{{ station.STDDEVVALUE.toString() }} <span v-if="currentPinView === 'prcp'">"</span><span v-else>ºF</span>
                    <br />
                    <strong>Error Estándar: </strong
                    >{{ station.STDERRVALUE.toString() }} <span v-if="currentPinView === 'prcp'">"</span><span v-else>ºF</span>
                    <br />
                    <v-col>
                      <v-btn
                        @click="
                          setChart(
                            'rangeModal',
                            'close',
                            'line',
                            '  Estación: ' +
                              station.STATIONID +
                              ',  Municipio: ' +
                              station.MUNICIPALITY +
                              ',  Rango de Fecha: ' +
                              rangeDateText +
                              ',  Máximo: ' +
                              station.MAXVALUE +
                              (currentPinView == 'prcp' ? ' in' : ' ºF') +
                              ',  Mínimo: ' +
                              station.MINVALUE +
                              (currentPinView == 'prcp' ? ' in' : ' ºF') +
                              ',  Desviación Estándar: ' +
                              station.STDERRVALUE +
                              (currentPinView == 'prcp' ? ' in' : ' ºF') +
                              ',  Error Estándar: ' +
                              station.STDERRVALUE +
                              (currentPinView == 'prcp' ? ' in' : ' ºF'),
                            currentPinView === 'prcp'
                              ? 'Precipitación '
                              : currentPinView === 'tmax'
                              ? 'Temperatura Máxima'
                              : 'Temperatura Mínima',
                            station.STATIONID,
                            currentPinView === 'prcp'
                              ? '#191970 '
                              : currentPinView === 'tmax'
                              ? '#ad2121'
                              : '#52ad21'
                          )
                        "
                      >
                        <v-icon>{{
                          currentPinView === "prcp"
                            ? "mdi-chart-bar"
                            : "mdi-chart-line"
                        }}</v-icon>
                        Graficar
                      </v-btn>
                    </v-col>
                  </div>
                </l-popup>
              </l-marker>
            </div>
          </v-container>
          <v-container>
            <v-container>
              <l-polygon
                v-if="EI"
                :lat-lngs="EasternInterior.latlngs"
                :color="EasternInterior.color"
                :fillColor="EasternInterior.color"
              >
                <l-popup content="Interior oriental" />
              </l-polygon>
            </v-container>
            <v-container>
              <l-polygon
                v-if="NC"
                :lat-lngs="NorthernCoastal.latlngs"
                :color="NorthernCoastal.color"
                :fillColor="NorthernCoastal.color"
              >
                <l-popup content="Costa del norte" />
              </l-polygon>
            </v-container>
            <v-container>
              <l-polygon
                v-if="NS"
                :lat-lngs="NorthernSlopes.latlngs"
                :color="NorthernSlopes.color"
                :fillColor="NorthernSlopes.color"
              >
                <l-popup content="Laderas del norte" />
              </l-polygon>
            </v-container>
            <v-container>
              <l-polygon
                v-if="OI"
                :lat-lngs="OutlyingIsland.latlngs"
                :color="OutlyingIsland.color"
                :fillColor="OutlyingIsland.color"
              >
                <l-popup content="Islas periféricas" />
              </l-polygon>
            </v-container>
            <v-container>
              <l-polygon
                v-if="OI"
                :lat-lngs="OutlyingIsland1.latlngs"
                :color="OutlyingIsland1.color"
                :fillColor="OutlyingIsland1.color"
              >
                <l-popup content="Islas periféricas" />
              </l-polygon>
            </v-container>
            <v-container>
              <l-polygon
                v-if="OI"
                :lat-lngs="OutlyingIsland2.latlngs"
                :color="OutlyingIsland2.color"
                :fillColor="OutlyingIsland2.color"
              >
                <l-popup content="Islas periféricas" />
              </l-polygon>
            </v-container>
            <v-container>
              <l-polygon
                v-if="OI"
                :lat-lngs="OutlyingIsland3.latlngs"
                :color="OutlyingIsland3.color"
                :fillColor="OutlyingIsland3.color"
              >
                <l-popup content="Islas periféricas" />
              </l-polygon>
            </v-container>
            <v-container>
              <l-polygon
                v-if="OI"
                :lat-lngs="OutlyingIsland4.latlngs"
                :color="OutlyingIsland4.color"
                :fillColor="OutlyingIsland4.color"
              >
                <l-popup content="Islas periféricas" />
              </l-polygon>
            </v-container>
            <v-container>
              <l-polygon
                v-if="SC"
                :lat-lngs="SouthernCoastal.latlngs"
                :color="SouthernCoastal.color"
                :fillColor="SouthernCoastal.color"
              >
                <l-popup content="Costa del sur" />
              </l-polygon>
            </v-container>
            <v-container>
              <l-polygon
                v-if="SS"
                :lat-lngs="SouthernSlopes.latlngs"
                :color="SouthernSlopes.color"
                :fillColor="SouthernSlopes.color"
              >
                <l-popup content="Laderas del sur" />
              </l-polygon>
            </v-container>
            <v-container>
              <l-polygon
                v-if="WI"
                :lat-lngs="WesternInterior.latlngs"
                :color="WesternInterior.color"
                :fillColor="WesternInterior.color"
              >
                <l-popup content="Interior occidental" />
              </l-polygon>
            </v-container>
          </v-container>
        </l-map>
        <v-overlay absolute :value="overlay">
          <v-progress-circular indeterminate size="128"></v-progress-circular>
        </v-overlay>
      </v-card>
      <v-row justify="center">
        <v-dialog
          v-model="dialog"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <v-card style="z-index: 20000; position: absolute;">
            <v-toolbar dark color="#82ada9">
              <v-btn icon dark @click="(dialog = false), myChart.destroy()">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title
                >Grafica para rango de fecha seleccionado</v-toolbar-title
              >
              <!-- <v-spacer></v-spacer>
                                    <v-toolbar-items>
                                    <v-btn dark text @click="dialog = false">Save</v-btn>
                                    </v-toolbar-items> -->
            </v-toolbar>
            <v-col>
              <canvas id="myChart" width="400" height="150"></canvas>
            </v-col>
          </v-card>
        </v-dialog>
      </v-row>
    </div>
    <Menu
      :defaultDate="date"
      :minDate="minDate"
      :maxDate="maxDate"
      :calendarLng="calendarLng"
      :calendarColor="calendarColor"
      :selectedFilters="selectedFilters"
      :filters="filters"
      :disable="disable"
      :rangeDate="rangeDate"
      :singleDatePicker="singleDatePicker"
      :rangeDatePicker="rangeDatePicker"
      :SingleDateText="SingleDateText"
      :rangeDateText="rangeDateText"
      :overlay="overlay"
      :hideMenu="hideMenu"
    />
  </div>
</template>

<script>
import Menu from "../navigation/Menu";
/* eslint-disable */
import { eventBus } from "../../main.js";
import { latLngBounds, latLng } from "leaflet";
import {
  LPolygon,
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LControl,
} from "vue2-leaflet";
import leaflet from "leaflet";
import L from "leaflet";
import { EasternInterior } from "../layers/climatezones/EasternInterior.js";
import { NorthernCoastal } from "../layers/climatezones/NorthernCoastal.js";
import { NorthernSlopes } from "../layers/climatezones/NorthernSlopes.js";
import {
  OutlyingIsland,
  OutlyingIsland1,
  OutlyingIsland2,
  OutlyingIsland3,
  OutlyingIsland4,
} from "../layers/climatezones/OutlyingIslands.js";
import { SouthernCoastal } from "../layers/climatezones/SouthernCoastal.js";
import { SouthernSlopes } from "../layers/climatezones/SouthernSlopes.js";
import { WesternInterior } from "../layers/climatezones/WesternInterior.js";
import Chart from "chart.js";
export default {
  name: "Example",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LPolygon,
    LControl,
    Menu,
  },
  data() {
    return {
      calendarLng: "es-ES",
      calendarColor: "#562f",
      menuControl: true,
      hideMenu: false,
      overlay: false,
      bounds: latLngBounds([
        [18.453116, -64.987199],
        [18.097713, -68.029587],
      ]),
      maxBounds: latLngBounds([
        [23.402765, -74.227942],
        [12.46876, -54.878565],
      ]),
      zoom: 9.8,
      minZoom: 8.0,
      center: latLng(18.193869, -66.626308),
      url:
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',

      currentZoom: 11.5,
      currentCenter: latLng(18.193869, -66.626308),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.01,
      },
      showMap: true,
      dialog: false,
      disable: false,
      loader: null,
      loading: false,
      loading1: false,
      loading2: false,
      menu: false,
      modal1: false,
      modal2: false,
      modal3: false,
      modal4: false,
      singleDatePicker: false,
      rangeDatePicker: false,
      selectedDateType: "Día",
      minDate: "2000-01-01",
      maxDate: "2019-08-31",
      date: "2018-04-13",
      drawer: false,
      startdate: null,
      enddate: null,
      currentPinView: null,
      pins: null,
      tileLayer: null,
      singleDate: true,
      rangeDate: false,
      legend: null,
      rangeDialog: "close",
      currentPressButton: "",
      stationsList: [],
      iconList: [],
      // Layers
      EasternInterior,
      NorthernCoastal,
      NorthernSlopes,
      OutlyingIsland,
      OutlyingIsland1,
      OutlyingIsland2,
      OutlyingIsland3,
      OutlyingIsland4,
      SouthernCoastal,
      SouthernSlopes,
      WesternInterior,
      EI: true,
      NC: true,
      NS: true,
      OI: true,
      SC: true,
      SS: true,
      WI: true,

      selectedFilters: [
        "Costa del norte",
        "Laderas del norte",
        "Interior occidental",
        "Interior oriental",
        "Laderas del sur",
        "Costa del sur",
        "Islas periféricas",
      ],
      mychart: null,
      mapChanged: 0,
    };
  },
  computed: {
    /*
     * return: filter list of climate zones
     * can be use to return different filter lists
     */
    filters: function() {
      return [
        "Costa del norte",
        "Laderas del norte",
        "Interior occidental",
        "Interior oriental",
        "Laderas del sur",
        "Costa del sur",
        "Islas periféricas",
      ];
    },
    /*
     * return: the current selected range date in the format
     * mm/dd/yyyy~mm/dd/yyyy
     */
    rangeDateText() {
      if (this.date[0] && this.date[1]) {
        const [year, month, day] = this.date[0].split("-");
        const [year1, month1, day1] = this.date[1].split("-");
        return `${month}/${day}/${year} ➜ ${month1}/${day1}/${year1}`;
      }
    },
    /*
     * return: the current selected date in the format
     * mm/dd/yyyy
     */
    SingleDateText() {
      if (!this.date && this.selectedDateType === "Día") return "";
      else if (this.date && this.selectedDateType === "Día") {
        const [year, month, day] = this.date.split("-");
        return `${month}/${day}/${year}`;
      }
    },
  },
  created() {
    eventBus.$on("fetchStationRequest", (type, start, end) => {
      this.fetchStations(type, start, end);
    });
    eventBus.$on("dateTypeChange", (selectedDateType) => {
      //   console.log(`date type changed ${selectedDateType}`)
      this.selectedDateType = selectedDateType;
    });
    eventBus.$on("dateChange", (date) => {
      this.date = date;
    });
    eventBus.$on("selectedFiltersChange", (selected) => {
      this.selectedFilters = selected;
    });
    eventBus.$on("hideMenuChange", (newValue) => {
      this.hideMenu = newValue;
    });
  },
  mounted: async function() {},
  watch: {
    selectedDateType: function() {
      if (this.selectedDateType === "Día") {
        this.dateType("singleDate");
        this.date = "2018-04-04";
      } else if (this.selectedDateType === "Rango") {
        this.dateType("rangeDate");
        this.date = ["2018-04-01", "2018-04-07"];
      }
      eventBus.$emit("defaultDate", this.date);
    },
    hideMenu: function() {
      if (this.hideMenu) {
        this.menuControl = true;
        this.drawer = !this.drawer;
      } else {
        this.menuControl = false;
        this.drawer = !this.drawer;
      }
    },
    selectedFilters: function() {
      if (
        this.selectedFilters.includes("Eastern Interior") ||
        this.selectedFilters.includes("Interior oriental")
      ) {
        this.EI = true;
      } else if (
        !this.selectedFilters.includes("Eastern Interior") ||
        !this.selectedFilters.includes("Interior oriental")
      ) {
        this.EI = false;
      }
      if (
        this.selectedFilters.includes("Northern Coastal") ||
        this.selectedFilters.includes("Costa del norte")
      ) {
        this.NC = true;
      } else if (
        !this.selectedFilters.includes("Northern Coastal") ||
        !this.selectedFilters.includes("Costa del norte")
      ) {
        this.NC = false;
      }
      if (
        this.selectedFilters.includes("Northern Slopes") ||
        this.selectedFilters.includes("Laderas del norte")
      ) {
        this.NS = true;
      } else if (
        !this.selectedFilters.includes("Northern Slopes") ||
        !this.selectedFilters.includes("Laderas del norte")
      ) {
        this.NS = false;
      }
      if (
        this.selectedFilters.includes("Outlying Island") ||
        this.selectedFilters.includes("Islas periféricas")
      ) {
        this.OI = true;
      } else if (
        !this.selectedFilters.includes("Outlying Island") ||
        !this.selectedFilters.includes("Islas periféricas")
      ) {
        this.OI = false;
      }
      if (
        this.selectedFilters.includes("Southern Coastal") ||
        this.selectedFilters.includes("Costa del sur")
      ) {
        this.SC = true;
      } else if (
        !this.selectedFilters.includes("Southern Coastal") ||
        !this.selectedFilters.includes("Costa del sur")
      ) {
        this.SC = false;
      }
      if (
        this.selectedFilters.includes("Southern Slopes") ||
        this.selectedFilters.includes("Laderas del sur")
      ) {
        this.SS = true;
      } else if (
        !this.selectedFilters.includes("Southern Slopes") ||
        !this.selectedFilters.includes("Laderas del sur")
      ) {
        this.SS = false;
      }
      if (
        this.selectedFilters.includes("Western Interior") ||
        this.selectedFilters.includes("Interior occidental")
      ) {
        this.WI = true;
      } else if (
        !this.selectedFilters.includes("Western Interior") ||
        !this.selectedFilters.includes("Interior occidental")
      ) {
        this.WI = false;
      }
    },
    date: function() {
      if (this.selectedDateType === "Rango" && this.date[0] && this.date[1]) {
        this.iconList = [];
        this.fetchStations(this.currentPinView, this.date[0], this.date[1]);
      } else if (this.selectedDateType === "Día") {
        this.iconList = [];
        this.fetchStations(this.currentPinView, this.date, this.date);
      }
    },
  },
  methods: {
    remove(item) {
      this.selectedFilters.splice(this.selectedFilters.indexOf(item), 1);
      this.selectedFilters = [...this.selectedFilters];
    },
    icon: function(value, agency) {
      var rgb = { r: 0, g: 0, b: 0 };
      var nullIcon;
      if (this.currentPinView == "tmin" || this.currentPinView == "tmax") {
        // set the rgb value of the current station element using the average value for range date  or the value  single date type with a ternary operator
        this.getTemperaturePinColors(rgb, value);
      } else if (this.currentPinView == "prcp") {
        this.getPrecipitationPinColors(rgb, value);
      }

      if (value !== null || value === undefined) {
        var style =
          agency === "USGS"
            ? ` height:15px; width:15px;  marging-bottom:-15px; margin-left: -3px; border-radius:50%; border: 1px solid #ca6a1b; background-color:rgb( ${rgb.r.toString()},  ${rgb.g.toString()}, ${rgb.b.toString()});`
            : `width: 15px; height: 15px; border: 1px solid #ca6a1b; background-color:rgb( ${rgb.r.toString()},  ${rgb.g.toString()}, ${rgb.b.toString()});`;
        return L.divIcon({
          iconSize: new L.Point(20, 20),
          className: "my-div-icon",
          iconAnchor: [0, 0],
          html: "<div style='" + style + "'>" + "</div>",
        });
      } else if (value === null) {
        return L.divIcon({
          iconSize: new L.Point(20, 20),
          className: "my-div-icon",
          iconAnchor: [0, 0],
          html:
            "<div style=' height:15px; width:15px;  marging-bottom:-15px; margin-left: -3px; border-radius:50%; border: 1px solid #ca6a1b; background-color:rgb(" +
            rgb.r.toString() +
            "," +
            rgb.g.toString() +
            " ," +
            rgb.b.toString() +
            ");'>" +
            "<img style='float: left; width: 15px; height: 15px; marging-bottom:-15px; margin-left: -1px; margin-top: -1px;' src='" +
            require("../../assets/nullicon.png") +
            "' id='null-div-icon'/>" +
            "</div>",
        });
      }
    },
    coordinates: function(latitude, longitude) {
      return latLng(latitude, longitude);
    },
    /**
     * get pin colors rgb values for temperature
     * rgb: object instance consisting of key value of the rgb ({r,g,b})
     * temperature: int value of the temperature
     **/
    getTemperaturePinColors: function(rgb, temperature) {
      if (temperature == null) {
        rgb.r = 255;
        rgb.g = 255;
        rgb.b = 255;
      } else if (temperature >= 0 && temperature < 40) {
        rgb.r = 0;
        rgb.g = 100;
        rgb.b = 255;
      } else if (temperature >= 40 && temperature <= 70) {
        rgb.r = 125 * ((temperature - 40) / (70 - 40));
        rgb.g = 125 + (255 - 125) * ((temperature - 40) / (70 - 40));
        rgb.b = 255;
      } else if (temperature > 70 && temperature <= 80) {
        // 79 F
        rgb.r = 125 + (255 - 125) * ((temperature - 70) / (80 - 70)); // 129.5
        rgb.g = 255; // 255
        rgb.b = 255 + (125 - 255) * ((temperature - 70) / (80 - 70)); //-91.5
      } else if (temperature > 80 && temperature <= 90) {
        rgb.r = 255;
        rgb.g = 255 + (125 - 255) * ((temperature - 80) / (90 - 80));
        rgb.b = 125 + -125 * ((temperature - 80) / (90 - 80));
      } else if (temperature > 90 && temperature <= 120) {
        rgb.r = 255;
        rgb.g = 125 + -125 * ((temperature - 90) / (120 - 90));
        rgb.b = 0;
      }
    },
    /**
     * get pin colors rgb values for precipitation
     * rgb: object instance consisting of key value of the rgb ({r,g,b})
     * prcp: int value of the precipitation
     **/
    getPrecipitationPinColors: function(rgb, prcp) {
      if (prcp >= 0 && prcp <= 0.4) {
        rgb.r = ((255 - 0) * (0.4 - prcp)) / (0.4 - 0);
        rgb.g = 255;
        rgb.b = 255;
      } else if (prcp > 0.4 && prcp <= 4.0) {
        rgb.r = 0;
        rgb.g = ((255 - 0) * (4 - prcp)) / (4 - 0.4);
        rgb.b = 255;
      } else if (prcp > 4 && prcp <= 24) {
        rgb.r = 0;
        rgb.g = 0;
        rgb.b = ((255 - 100) * (24 - prcp)) / (24 - 4) + 100;
      } else if (prcp > 24) {
        rgb.r = 100;
        rgb.g = 0;
        rgb.b = 0;
      } else if (prcp == null) {
        rgb.r = 0;
        rgb.g = 0;
        rgb.b = 0;
      }
    },
    fetchStations: async function(type, start, end) {
      this.disable = !this.disable;
      this.overlay = !this.overlay;

      //removes the current pins instnace in the map instance
      this.iconList = [];
      // set the global startdate variable instance to the start date value send in the params, selected in the date picker
      this.startdate = start;
      // set the global startdate variable instance to the end date value send in the params, selected in the date picker
      this.enddate = end;
      // set the global variable currentPinView with the current type of pin display on map
      this.currentPinView = type;
      // array instance to hold the new values for the pins to be add to the map
      // let myPins = [];
      // response of the api call to be generated
      var response = null;
      // holds the json array of the api call response
      var stations = null;

      // change api call depending on the type of view if it is single date or range date, based on the global bool variables singleDate and rangeDate
      if (this.singleDate) {
        response = await fetch(
          "http://climatologia.uprm.edu:8008/api?" +
            "q=data&" +
            "startdate=" +
            this.startdate +
            "&enddate=" +
            this.enddate +
            "&elem=" +
            this.currentPinView
        ).catch(function(error) {
          alert(error);
        });
      } else if (this.rangeDate) {
        response = await fetch(
          "http://climatologia.uprm.edu:8008/api?" +
            "q=data&" +
            "calc=all" +
            "&startdate=" +
            this.startdate +
            "&enddate=" +
            this.enddate +
            "&elem=" +
            this.currentPinView
        ).catch(function(error) {
          alert(error);
        });
        // console.log('http://climatologia.uprm.edu:8008/api?' + 'q=data&' + 'calc=all' + '&startdate=' + this.startdate + '&enddate=' + this.enddate + '&elem=' + this.currentPinView)
      }
      stations = await response.json();
      this.overlay = !this.overlay;
      this.disable = !this.disable;
      this.stationsList = stations;
      for (var i = 0; i < this.stationsList.length; i++) {
        this.iconList.push(
          this.icon(
            this.selectedDateType === "Día"
              ? this.stationsList[i].VALUE
              : this.selectedDateType === "Rango"
              ? this.stationsList[i].AVGVALUE
              : null,
            this.stationsList[i].AGENCYID
          )
        );
      }
      return;
    },
    dateType: function(type) {
      if (type == "singleDate") {
        this.rangeDate = false;
        this.singleDate = true;
      } else if (type == "rangeDate") {
        this.singleDate = false;
        this.rangeDate = true;
      }
    },
    /**
     * close range modal
     **/
    closeRangeModal: function() {
      this.rangeModal.style.display = "none";
    },
    /**
     *
     **/
    openModal: function(modalId, spanClass) {
      var modal = document.getElementById(modalId);
      modal.style.display = "block";
      var span = document.getElementsByClassName(spanClass)[0];
      span.onclick = function() {
        modal.style.display = "none";
      };
      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      };
    },
    setChart: async function(
      modalId,
      spanClass,
      charttype,
      title,
      labelName,
      stationID,
      color
    ) {
      this.dialog = !this.dialog;
      var config = null;
      var stationLabels = [];
      var dataSetResponse = await fetch(
        "http://climatologia.uprm.edu:8008/api?" +
          "q=data&" +
          "calc=none" +
          "&station=" +
          stationID +
          "&startdate=" +
          this.startdate +
          "&enddate=" +
          this.enddate +
          "&elem=" +
          this.currentPinView
      ).catch(function(error) {
        alert(error);
      });
      var yLabel =
        this.currentPinView === "prcp"
          ? "Precipitación (in)"
          : this.currentPinView === "tmax"
          ? "Temperatura Máxima (ºF)"
          : "Temperatura Mínima (ºF)";
      var stationsDataSet = await dataSetResponse.json();

      const date1 = new Date(this.startdate);
      const date2 = new Date(this.enddate);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      var maxTickX = 20;
      if (diffDays / 7 <= 1) {
        maxTickX = diffDays;
      } else if (diffDays / 30 >= 1 && diffDays / 30 <= 12) {
        maxTickX = Math.ceil(diffDays / 30) * 12;
      } else if (diffDays / 365 >= 1) {
        maxTickX = Math.ceil(diffDays / 365) * 12 * 2;
      }
      var formatedDataSet = [];
      for (var i = 0; i < stationsDataSet.length; i++) {
        var temp = new Object();
        stationLabels.push(stationsDataSet[i].DATE.substring(0, 16));
        temp["y"] = stationsDataSet[i].VALUE;
        formatedDataSet.push(temp);
      }
      switch (this.currentPinView) {
        case "prcp":
          config = {
            type: "bar",
            data: {
              labels: stationLabels,
              datasets: [
                {
                  label: labelName,
                  backgroundColor: color,
                  borderColor: color,
                  data: formatedDataSet,
                  // backgroundColor: "rgba(25, 25, 112, 1)"
                },
              ],
            },
            options: {
              responsive: true,
              title: {
                display: true,
                text: title,
                fontColor: "#000",
                fontSize: 14,
              },
              tooltips: {
                mode: "index",
                intersect: false,
              },
              animation: {
                duration: 0,
              },
              hover: {
                // mode: 'nearest',
                // intersect: true
                animationDuration: 0,
              },
              responsiveAnimationDuration: 0,
              scales: {
                xAxes: [
                  {
                    display: true,
                    scaleLabel: {
                      display: true,
                      labelString: "Día",
                      fontStyle: "bold",
                      fontColor: "#000",
                    },
                    ticks: {
                      source: "labels",
                      autoSkip: true,
                      autoSkipPadding: 20,
                      maxRotation: 90,
                      maxTicksLimit: maxTickX,
                      // stepSize: diffDays / maxTickX,
                      callback: function(tick, index) {
                        // console.log(Math.ceil(diffDays / 10) % (index + 1));
                        // return ((index + 1) % (Math.ceil(diffDays / 10)))  ? '' : index + 1;
                        return index + 1;
                      },
                    },
                  },
                ],
                yAxes: [
                  {
                    display: true,
                    scaleLabel: {
                      display: true,
                      labelString: yLabel,
                      fontStyle: "bold",
                      fontColor: "#000",
                      ticks: {
                        beginAtZero: true,
                        steps: 10,
                        stepValue: 10,
                        max: 100,
                      },
                    },
                  },
                ],
              },
            },
          };
          break;
        default:
          config = {
            type: "line",
            data: {
              labels: stationLabels,
              datasets: [
                {
                  label: labelName,
                  backgroundColor: color,
                  borderColor: color,
                  data: formatedDataSet,
                  fill: false,
                },
              ],
            },
            options: {
              responsive: true,
              title: {
                display: true,
                text: title,
                fontColor: "#000",
                fontSize: 14,
              },
              tooltips: {
                mode: "index",
                intersect: false,
              },
              animation: {
                duration: 0,
              },
              hover: {
                // mode: 'nearest',
                // intersect: true
                animationDuration: 0,
              },
              responsiveAnimationDuration: 0,
              scales: {
                xAxes: [
                  {
                    display: true,
                    scaleLabel: {
                      display: true,
                      labelString: "Día",
                      fontStyle: "bold",
                      fontColor: "#000",
                    },
                    ticks: {
                      source: "labels",
                      autoSkip: true,
                      autoSkipPadding: 4,
                      maxRotation: 0,
                      maxTicksLimit: maxTickX,
                      stepSize: 3,
                      callback: function(value, index) {
                        return index + 1;
                      },
                    },
                  },
                ],
                yAxes: [
                  {
                    display: true,
                    scaleLabel: {
                      display: true,
                      labelString: yLabel,
                      fontStyle: "bold",
                      fontColor: "#000",
                      ticks: {
                        steps: 10,
                        stepValue: 10,
                        max: 100,
                      },
                    },
                  },
                ],
              },
            },
          };
      }

      var ctx = document.getElementById("myChart").getContext("2d");
      this.myChart = new Chart(ctx, config);
    },
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },
    recenter: function() {
      this.mapChanged = this.mapChanged + 1;
      this.zoom = 9.8;
      this.center = latLng(18.193869, -66.626308);
    },

    calendarOpen: function() {
      document.getElementById("date2").style.display = "none";
      document.getElementById("calendar").style.display = "block";
    },
    calendarClose: function() {
      if (this.date.length === 2 || this.selectedDateType === "Día") {
        document.getElementById("calendar").style.display = "none";
        document.getElementById("date2").style.display = "block";
      }
    },
  },
};
/* eslint-enable */
</script>
<style scoped>
.date {
  position: absolute;
  display: flex;
  text-align: center;
  justify-content: center;
  align-content: center;
  width: 100%;
  z-index: 1;
  pointer-events: none;
  cursor: none;
}
#calendar {
  margin-top: 5px;
  pointer-events: all;
  cursor: pointer;
  display: none;
}
.date2 {
  padding: 5px;
  padding-left: 50px;
  padding-right: 50px;
  background: inherit;
  backdrop-filter: blur(10px);
  box-shadow: inset 0px 0px 200px rgba(36, 36, 36, 0.911),
    0px 5px 10px rgba(0, 0, 0, 0.26);
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  color: white;
  pointer-events: stroke;
  cursor: pointer;
}
.date2:hover {
  box-shadow: inset 0px 0px 200px rgba(56, 56, 56, 0.836),
    0px 5px 10px rgba(0, 0, 0, 0.26);
  transition: 0.3s;
}

.date2 h2 {
  font-size: 2vh;
}

.map {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
  padding: 0;
}

.centerBtn {
  position: absolute;
  bottom: 40px;
  right: 60px;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 25px;
  padding-right: 25px;
  background: #2bbbbb;
  color: rgb(255, 255, 255);
  border-radius: 100px;
  text-align: center;
  font-weight: bold;
  font-style: normal;
  font-family: sans-serif;
  font-size: 20px;
  box-shadow: 0px 3px 5px rgb(95, 95, 95);
  z-index: 1;
}

.centerBtn:hover {
  transition: 0.3s;
  background: #56ddd2;
  transform: translateY(-5px);
}

.leyenda {
  background-color: white;
  font-size: 1.5vh;
}

/*
This witll be the end of the nav bar
*/

@media only screen and (min-width: 360px) and (max-width: 768px) {
  .map {
    margin: 0;
    padding: 0;
  }

  .my-div-icon {
    background-color: #fd8424;
    border-radius: 3px;
    border: 2px solid #ca6a1b;
  }
  .my-div-icon {
    height: 0;
    width: 0;
    background-color: rgba(0, 0, 0, 0);
    border-radius: 40%;
    border-style: none;
  }

  /* .input {
        width: 15vh;
     } */
  #selecteddate {
    float: right;
    position: absolute;
    z-index: 1001;
    top: 0;
    left: 25%;
    font-size: 5vh;
  }
  .fontsz {
    font-size: 2vh;
  }
}
@media only screen and (min-width: 1024px) and (max-width: 1440px) {
  .drawer-icon {
    border-radius: 8% !important;
    border: 2px solid #a6babc;
    background-color: #ffffff;
    float: right;
    position: absolute;
    z-index: 1001;
    top: 20%;
    left: 1.12%;
    font-size: 5vh;
  }
  .my-div-icon {
    background-color: #fd8424;
    border-radius: 3px;
    border: 2px solid #ca6a1b;
  }
  .my-div-icon {
    height: 0;
    width: 0;
    background-color: rgba(0, 0, 0, 0);
    border-radius: 40%;
    border-style: none;
  }

  /* .input {
        width: 15vh;
     } */
  #selecteddate {
    float: right;
    position: absolute;
    z-index: 1001;
    top: 0;
    left: 25%;
    font-size: 5vh;
  }
  .fontsz {
    font-size: 2vh;
  }
}

@media only screen and (min-width: 1440px) and (max-width: 1680px) {
  .drawer-icon {
    border-radius: 8% !important;
    border: 2px solid #a6babc;
    background-color: #ffffff;
    float: right;
    position: absolute;
    z-index: 1001;
    top: 20%;
    left: 1.12%;
    font-size: 5vh;
  }
  .my-div-icon {
    background-color: #fd8424;
    border-radius: 3px;
    border: 2px solid #ca6a1b;
  }
  .my-div-icon {
    height: 0;
    width: 0;
    background-color: rgba(0, 0, 0, 0);
    border-radius: 40%;
    border-style: none;
  }

  /* .input {
        width: 15vh;
     } */
  #selecteddate {
    float: right;
    position: absolute;
    z-index: 1001;
    top: 0;
    left: 25%;
    font-size: 5vh;
  }
  .fontsz {
    font-size: 2vh;
  }
}
@media only screen and (min-width: 1680px) and (max-width: 1920px) {
  drawer-icon {
    border-radius: 8% !important;
    border: 2px solid #a6babc;
    background-color: #ffffff;
    float: right;
    position: absolute;
    z-index: 1001;
    top: 20%;
    left: 1.12%;
    font-size: 5vh;
  }
  .my-div-icon {
    background-color: #fd8424;
    border-radius: 3px;
    border: 2px solid #ca6a1b;
  }
  .my-div-icon {
    height: 0;
    width: 0;
    background-color: rgba(0, 0, 0, 0);
    border-radius: 40%;
    border-style: none;
  }

  /* .input {
        width: 15vh;
     } */
  #selecteddate {
    float: right;
    position: absolute;
    z-index: 1001;
    top: 0;
    left: 25%;
    font-size: 5vh;
  }
  .fontsz {
    font-size: 2vh;
  }
}
@media only screen and (min-width: 1920px) and (max-width: 32560px) {
  .drawer-icon {
    border-radius: 8% !important;
    border: 2px solid #a6babc;
    background-color: #ffffff;
    float: right;
    position: absolute;
    z-index: 1001;
    top: 10%;
    left: 0.9%;
    font-size: 5vh;
  }
  .my-div-icon {
    background-color: #fd8424;
    border-radius: 3px;
    border: 2px solid #ca6a1b;
  }
  .my-div-icon {
    height: 0;
    width: 0;
    background-color: rgba(0, 0, 0, 0);
    border-radius: 40%;
    border-style: none;
  }

  #selecteddate {
    float: right;
    position: absolute;
    z-index: 1001;
    top: 0;
    left: 25%;
    font-size: 5vh;
  }
  .fontsz {
    font-size: 2vh;
  }
}
@media only screen and (min-width: 32560px) {
}

html,
body {
  height: 100%;
}
.btn1 {
  background-color: blue !important;
}
.btn2 {
  background-color: red !important;
}
.btn3 {
  background-color: green !important;
}
.selectedbtn {
  /* background-color: grey; */
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) !important;
  border: 2px solid grey !important; /* Green */
  /* color: white; */
}
.unselectedbtn {
  background-color: whitesmoke;
  color: black;
}
/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 10000; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */ /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}
/* Modal Content */
.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}
/* The Close Button */
.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}
.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
.triangle-left {
  width: 0;
  height: 0;
  border-top: 23px solid transparent;
  border-bottom: 23px solid transparent;
  border-right: 23px solid red;
}

.inner-triangle {
  position: relative;
  top: -20px;
  left: 2px;
  width: 0;
  height: 0;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-right: 20px solid blue;
}
.popup-tip-corrections {
  margin: 0 1 !important;
  position: absolute !important;
}
</style>
