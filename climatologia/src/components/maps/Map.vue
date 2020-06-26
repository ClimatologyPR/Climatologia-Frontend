<template>
  <div class="mapContainer2">
    <SmallWindow />
    <div class="mapContainer">
      <div class="map">
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
                        date && selectedDateType === "Por Día"
                          ? SingleDateText
                          : rangeDateText
                      }}
                    </h2>
                  </div>
                  <div class="calendar" @mouseleave="calendarClose()">
                    <v-date-picker
                      dark
                      v-if="selectedDateType === 'Por Día'"
                      id="calendar"
                      locale="es-ES"
                      v-model="date"
                      color="#2bbbbb"
                      @input="calendarClose()"
                      no-title
                      :show-current="false"
                      scrollable
                      :min="minDate"
                      :max="maxDate"
                    >
                    </v-date-picker>
                    <v-date-picker
                      v-if="selectedDateType === 'Por Rango'"
                      id="calendar"
                      dark
                      locale="es-ES"
                      v-model="date"
                      color="#2bbbbb"
                      @input="calendarClose()"
                      no-title
                      :show-current="false"
                      scrollable
                      :min="minDate"
                      :max="maxDate"
                      range
                    >
                    </v-date-picker>
                  </div>
                </div>
              </div>

              <div class="centerContent">
                <a @click="recenter()" class="centerBtn" id="centerBtn"
                  ><v-icon color="white">mdi-map-marker-radius</v-icon></a
                >
              </div>

              <l-map
                id="map"
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
                  <div class="leyenda">
                    <h3>Leyenda</h3>
                    <div class="leyendaCol">
                      <span>
                        <img
                          :src="require('../../assets/nullIcon2.svg')"
                          height="32px"
                          width="32px"
                        />
                        <h4>Valor Nulo</h4>
                      </span>
                      <span>
                        <img
                          :src="require('../../assets/noaa2.svg')"
                          height="32px"
                          width="32px"
                        />
                        <h4>NOAA</h4>
                      </span>
                      <span>
                        <img
                          :src="require('../../assets/usgs2.svg')"
                          height="32px"
                          width="32px"
                        />
                        <h4>USGS</h4>
                      </span>
                    </div>
                  </div>
                </l-control>
                <l-control
                  position="bottomright"
                  style="pointer-events: none;margin-bottom:-10px;z-index:801;margin-right:10px"
                >
                  <v-card width="100%" class="legendImage">
                    <img
                      v-if="currentPinView === 'prcp'"
                      :src="
                        require('../../assets/horizontal_precipitation_legend_bar.svg')
                      "
                      style="width:450px; height: auto;"
                    />
                    <img
                      v-else
                      :src="
                        require('../../assets/horizontal_temperature_legend_bar.svg')
                      "
                      style="width: 500px; height:auto;"
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
                      :lat-lng="
                        coordinates(station.LATITUDE, station.LONGITUDE)
                      "
                      :icon="iconList[i]"
                      @popupclose="recenterPopup()"
                      :options="{}"
                    >
                      <l-popup class="popup" :options="{ closeButton: false }">
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
                        <div v-if="selectedDateType === 'Por Día'">
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
                            station.VALUE === null ||
                            station.VALUE === undefined
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
                            selectedDateType === 'Por Rango' &&
                              station.AVGVALUE != undefined
                          "
                        >
                          <strong v-if="currentPinView === 'prcp'">
                            Precipitación Promedio:
                          </strong>
                          <strong v-else-if="currentPinView === 'tmax'">
                            Temperatura Máxima Promedio:
                          </strong>
                          <strong v-else> Temperatura Mínima Promedio: </strong>
                          {{ station.AVGVALUE.toString() }}
                          <span v-if="currentPinView === 'prcp'">"</span
                          ><span v-else>ºF</span>
                          <br />
                          <strong>Máximo: </strong>
                          {{ station.MAXVALUE.toString() }}
                          <span v-if="currentPinView === 'prcp'">"</span
                          ><span v-else>ºF</span>
                          <br />
                          <strong>Mínimo: </strong>
                          {{ station.MINVALUE.toString() }}
                          <span v-if="currentPinView === 'prcp'">"</span
                          ><span v-else>ºF</span>
                          <br />
                          <strong>Desviación Estándar: </strong
                          >{{ station.STDDEVVALUE.toString() }}
                          <span v-if="currentPinView === 'prcp'">"</span
                          ><span v-else>ºF</span>
                          <br />
                          <strong>Error Estándar: </strong
                          >{{ station.STDERRVALUE.toString() }}
                          <span v-if="currentPinView === 'prcp'">"</span
                          ><span v-else>ºF</span>
                          <br />
                          <div class="popupBtns">
                            <v-btn
                              style="background:#2bbbbb;color:white;margin-bottom:10px"
                              @click="
                                recenter(),
                                  OpenChart(
                                    currentPinView,
                                    'rangeModal',
                                    'close',
                                    'line',
                                    currentPinView === 'prcp'
                                      ? 'Precipitación '
                                      : currentPinView === 'tmax'
                                      ? 'Temperatura Máxima'
                                      : 'Temperatura Mínima',
                                    station.STATIONID,
                                    station.MUNICIPALITY,
                                    startdate,
                                    enddate,
                                    station.MAXVALUE,
                                    station.MINVALUE,
                                    station.STDDEVVALUE,
                                    station.STDERRVALUE,
                                    station.AVGVALUE
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

                            <v-btn
                              style="background:#2bbbbb;color:white;"
                              @click="downloadToCsv(station.STATIONID)"
                            >
                              <v-icon color="white">mdi-download</v-icon
                              >Descargar
                            </v-btn>
                          </div>
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
                      <l-popup class="popup" :options="{ closeButton: false }"
                        >Interior oriental</l-popup
                      >
                    </l-polygon>
                  </v-container>
                  <v-container>
                    <l-polygon
                      v-if="NC"
                      :lat-lngs="NorthernCoastal.latlngs"
                      :color="NorthernCoastal.color"
                      :fillColor="NorthernCoastal.color"
                    >
                      <l-popup class="popup" :options="{ closeButton: false }"
                        >Costa del norte</l-popup
                      >
                    </l-polygon>
                  </v-container>
                  <v-container>
                    <l-polygon
                      v-if="NS"
                      :lat-lngs="NorthernSlopes.latlngs"
                      :color="NorthernSlopes.color"
                      :fillColor="NorthernSlopes.color"
                    >
                      <l-popup class="popup" :options="{ closeButton: false }"
                        >Laderas del norte</l-popup
                      >
                    </l-polygon>
                  </v-container>
                  <v-container>
                    <l-polygon
                      v-if="OI"
                      :lat-lngs="OutlyingIsland.latlngs"
                      :color="OutlyingIsland.color"
                      :fillColor="OutlyingIsland.color"
                    >
                      <l-popup class="popup" :options="{ closeButton: false }"
                        >Islas periféricas</l-popup
                      >
                    </l-polygon>
                  </v-container>
                  <v-container>
                    <l-polygon
                      v-if="OI"
                      :lat-lngs="OutlyingIsland1.latlngs"
                      :color="OutlyingIsland1.color"
                      :fillColor="OutlyingIsland1.color"
                    >
                      <l-popup class="popup" :options="{ closeButton: false }"
                        >Islas periféricas</l-popup
                      >
                    </l-polygon>
                  </v-container>
                  <v-container>
                    <l-polygon
                      v-if="OI"
                      :lat-lngs="OutlyingIsland2.latlngs"
                      :color="OutlyingIsland2.color"
                      :fillColor="OutlyingIsland2.color"
                    >
                      <l-popup class="popup" :options="{ closeButton: false }"
                        >Islas periféricas</l-popup
                      >
                    </l-polygon>
                  </v-container>
                  <v-container>
                    <l-polygon
                      v-if="OI"
                      :lat-lngs="OutlyingIsland3.latlngs"
                      :color="OutlyingIsland3.color"
                      :fillColor="OutlyingIsland3.color"
                    >
                      <l-popup class="popup" :options="{ closeButton: false }"
                        >Islas periféricas</l-popup
                      >
                    </l-polygon>
                  </v-container>
                  <v-container>
                    <l-polygon
                      v-if="OI"
                      :lat-lngs="OutlyingIsland4.latlngs"
                      :color="OutlyingIsland4.color"
                      :fillColor="OutlyingIsland4.color"
                    >
                      <l-popup class="popup" :options="{ closeButton: false }"
                        >Islas periféricas</l-popup
                      >
                    </l-polygon>
                  </v-container>
                  <v-container>
                    <l-polygon
                      v-if="SC"
                      :lat-lngs="SouthernCoastal.latlngs"
                      :color="SouthernCoastal.color"
                      :fillColor="SouthernCoastal.color"
                    >
                      <l-popup class="popup" :options="{ closeButton: false }"
                        >Costa del sur</l-popup
                      >
                    </l-polygon>
                  </v-container>
                  <v-container>
                    <l-polygon
                      v-if="SS"
                      :lat-lngs="SouthernSlopes.latlngs"
                      :color="SouthernSlopes.color"
                      :fillColor="SouthernSlopes.color"
                    >
                      <l-popup class="popup" :options="{ closeButton: false }"
                        >Laderas del sur</l-popup
                      >
                    </l-polygon>
                  </v-container>
                  <v-container>
                    <l-polygon
                      v-if="WI"
                      :lat-lngs="WesternInterior.latlngs"
                      :color="WesternInterior.color"
                      :fillColor="WesternInterior.color"
                    >
                      <l-popup class="popup" :options="{ closeButton: false }"
                        >Interior occidental</l-popup
                      >
                    </l-polygon>
                  </v-container>
                </v-container>
              </l-map>
              <v-overlay absolute :value="overlay">
                <v-progress-circular
                  indeterminate
                  size="128"
                ></v-progress-circular>
              </v-overlay>
            </v-card>

            <v-dialog
              v-model="dialog"
              fullscreen
              hide-overlay
              transition="dialog-bottom-transition"
            >
              <div
                style="z-index: 3; position: absolute; background:rgba(56, 56, 56, 0.96);height:100%;"
              >
                <div class="graphContainer">
                  <div class="toolbar">
                    <h2>
                      Grafica para rango de fecha seleccionado
                    </h2>
                    <v-btn
                      icon
                      dark
                      @click="(dialog = false), myChart.destroy()"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </div>
                  <div class="chartContent">
                    <canvas id="myChart" width="400" height="100"></canvas>
                  </div>
                  <div class="graphOptions">
                    <div class="extraInfo">
                      <div class="infoContent">
                        <strong>ID de Estación: </strong>
                        {{ estacion }}
                        <br />
                        <strong>Municipio: </strong>
                        {{ municipality }}
                        <br />
                        <strong>Rango de Fecha: </strong>
                        {{ fecha }}
                        <br />
                        <strong v-if="currentPinView === 'prcp'">
                          Precipitación Promedio:
                        </strong>
                        <strong v-else-if="currentPinView === 'tmax'">
                          Temperatura Máxima Promedio:
                        </strong>
                        <strong v-else> Temperatura Mínima Promedio: </strong>
                        {{ avg }}
                        <span v-if="currentPinView === 'prcp'">"</span
                        ><span v-else>ºF</span>
                        <br />
                        <strong>Máximo: </strong>
                        {{ max }}
                        <span v-if="currentPinView === 'prcp'">"</span
                        ><span v-else>ºF</span>
                        <br />
                        <strong>Mínimo: </strong>
                        {{ min }}
                        <span v-if="currentPinView === 'prcp'">"</span
                        ><span v-else>ºF</span>
                        <br />
                        <strong>Desviación Estándar: </strong>{{ des }}
                        <span v-if="currentPinView === 'prcp'">"</span
                        ><span v-else>ºF</span>
                        <br />
                        <strong>Error Estándar: </strong>{{ er }}
                        <span v-if="currentPinView === 'prcp'">"</span
                        ><span v-else>ºF</span>
                      </div>
                    </div>
                    <div class="download">
                      <h3>Descargar data de gráfica</h3>
                      <div class="downloadSettings">
                        <div>
                          <strong
                            >Información del archivo para descarga:</strong
                          >
                          <ul>
                            <li>
                              El contenido solo incluye los valores que están
                              reprecentados por la gráfica
                            </li>
                            <li>El archivo es de formato ".csv"</li>
                          </ul>
                        </div>
                      </div>
                      <div class="downloadBtnLocation">
                        <a class="downloadBtn" @click="objectToCsv()"
                          ><v-icon color="white">mdi-download</v-icon
                          >Descargar</a
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-dialog>
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
      </div>
    </div>
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
import SmallWindow from "../SmallWindow";
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
    SmallWindow,
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
      zoom: 9.9,
      minZoom: 8.0,
      center: latLng(18.213698, -66.348032),
      url:
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',

      currentZoom: 11.5,
      currentCenter: latLng(18.213698, -66.348032),
      isCentered: true,
      mapOptions: {
        zoomSnap: 0.01,
      },
      showMap: true, // This turns the map on or off
      dialog: false,
      disable: false,
      singleDatePicker: false,
      rangeDatePicker: false,
      selectedDateType: "Por Día",
      minDate: "2000-01-01",
      maxDate: "2020-06-24",
      date: "2020-06-01",
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
      estacion: null,
      municipality: null,
      fecha: null,
      max: null,
      min: null,
      des: null,
      er: null,
      avg: null,
      csv: null,
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
      if (!this.date && this.selectedDateType === "Por Día") return "";
      else if (this.date && this.selectedDateType === "Por Día") {
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
      if (this.selectedDateType === "Por Día") {
        this.dateType("singleDate");
        this.date = "2020-06-01";
      } else if (this.selectedDateType === "Por Rango") {
        this.dateType("rangeDate");
        this.date = ["2020-05-25", "2020-06-01"];
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
      if (
        this.selectedDateType === "Por Rango" &&
        this.date[0] &&
        this.date[1]
      ) {
        this.iconList = [];
        this.fetchStations(this.currentPinView, this.date[0], this.date[1]);
      } else if (this.selectedDateType === "Por Día") {
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
      if (this.currentPinView == "tmin" || this.currentPinView == "tmax") {
        // set the rgb value of the current station element using the average value for range date  or the value  single date type with a ternary operator
        this.getTemperaturePinColors(rgb, value);
      } else if (this.currentPinView == "prcp") {
        this.getPrecipitationPinColors(rgb, value);
      }

      if (value !== null || value === undefined) {
        var usgsIcon = `<svg width="100%" height="100%" viewBox="0 0 500 500" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g id="XMLID_1_" transform="matrix(1,0,0,1,113.68,13.4651)">
        <g transform="matrix(1.08778,0,0,1.75759,-181.142,-108.85)">
            <path d="M521.372,78.866C521.372,72.41 517.229,66.219 509.853,61.654C502.477,57.089 492.474,54.525 482.043,54.525L167.124,54.525C139.377,54.525 112.765,61.347 93.145,73.49C73.524,85.633 62.502,102.103 62.502,119.276L62.502,257.388C62.502,301.944 120.863,338.064 192.856,338.064L432.551,338.064C456.108,338.064 478.7,332.273 495.357,321.964C512.014,311.654 521.372,297.672 521.372,283.092L521.372,78.866Z"/>
        </g>
        <g id="XMLID_15_" transform="matrix(5.33438,0,0,5.15117,-465.915,-955.05)">
            <path style="fill:rgb( ${rgb.r.toString()},  ${rgb.g.toString()}, ${rgb.b.toString()});" d="M92.8,215.3L93.1,215.6C102.2,223.2 112.1,222.5 119.6,217.5C124.3,214.4 145.7,200.1 157.8,192.1L157.8,192.1C157.8,187.682 154.341,184.1 150.075,184.1L88.172,184.1C76.866,184.1 67.7,193.591 67.7,205.3L67.7,205.3C73.2,204.4 82.1,205.3 92.8,215.3M126.7,250.6L116.1,240.4C114.6,239 113.3,238 113.1,237.8C104.4,231.7 96.3,233.5 92.8,234.8C91.7,235.2 90.7,235.8 90,236.3L67.8,251.2L67.8,251.2C67.8,266.057 79.43,278.1 93.776,278.1L139.166,278.1C144.135,278.1 148.9,276.056 152.413,272.418C155.926,268.78 157.9,263.845 157.9,258.7L157.9,258.7C155.8,260 143.6,266.6 126.7,250.6M92,217.7C91.5,217.3 91,216.8 90.5,216.4C79.9,208.2 69.8,212.2 67.7,213.2L67.7,222.5L72.9,219C72.9,219 80.9,213 93.4,219.2L92,217.7M104.5,229.7C104,229.3 103.6,228.9 103.1,228.4C93.7,220.4 84.5,222.4 80.8,223.8C79.7,224.2 78.7,224.8 78,225.3L67.8,232.1L67.8,241.6L84.8,230.1C84.8,230.1 92.7,224.2 105.1,230.1L104.5,229.7M157.8,239.7C154.3,242.1 150.7,244.5 149.2,245.5C146,247.6 138.6,253 126.2,247.1L127.7,248.5C128.2,249 128.9,249.6 129.6,250.1C138.5,256.7 147.9,255.8 155,251.1C156,250.4 156.9,249.9 157.7,249.3L157.8,239.7M157.8,220.6C150,225.8 139.5,232.9 137.5,234.2C134.3,236.3 126.8,241.7 114.7,236L116.1,237.3C116.3,237.4 116.4,237.6 116.6,237.7C126,245.6 136.3,244.4 143.4,239.7C147.4,237 153.1,233.2 157.8,230L157.8,220.6M157.8,201.6C146.6,209.1 128.2,221.5 125.9,222.9C122.7,225.1 115,230.5 103.1,224.8L104.5,226.2C105.4,227 106.5,228 107.8,228.8C116.1,234.1 124.7,233.1 131.7,228.4C136.8,225 149.2,216.8 157.7,211.1L157.7,201.6" style="fill:rgb(0,113,80);fill-rule:nonzero;"/>
        </g>
    </g>
    </svg>`;

        var noaaIcon = `<svg width="100%" height="100%" viewBox="0 0 500 500" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g id="XMLID_1_" transform="matrix(1.59015,0,0,1.59015,-147.849,-147.258)">
        <g transform="matrix(1.20156,-0.00853273,0.00868847,1.2235,-160.533,-112.009)">
            <ellipse cx="339.015" cy="275.63" rx="125.064" ry="95.501" style="fill:rgb(2,0,0);"/>
        </g>
        <path style="fill:rgb( ${rgb.r.toString()},  ${rgb.g.toString()}, ${rgb.b.toString()});" id="XMLID_3_" d="M323.6,111.6C320.4,109.9 293.4,93.6 251.9,93C161.9,93.3 122.3,159.3 122.3,159.3C142.2,169.1 162.9,198.4 163.1,198.8C185.4,230 216.4,278.5 256.6,279.4C269.5,279.7 278,272 287.8,262.5C323.5,227.9 328.5,164 374.2,155C374.3,155.1 357.3,129.6 323.6,111.6Z" style="fill:rgb(38,63,120);fill-rule:nonzero;"/>
        <path style="fill:rgb( ${rgb.r.toString()},  ${rgb.g.toString()}, ${rgb.b.toString()});" id="XMLID_4_" d="M390.5,180.5C390.6,180.5 409.8,218.5 406.4,259C404.5,327 344.4,404.1 254.9,406.6L242.4,406.3C150.1,401.7 93.4,323.4 93.7,252.6C93.9,239.4 93.9,224.7 99.4,206.6L105.1,208.3C128.8,217.2 154.3,286.3 237.2,290.3C240.8,290.5 247.7,290.6 247.7,290.7C242.3,296.1 211.8,308.7 197.9,312C201.5,311.1 197.6,311.9 197.9,312C231.3,332.7 264.6,292.9 307.9,287L321.2,286.2C318.7,278.2 307.2,278.9 306.2,279C276.2,282 283.7,278.5 282.8,278.8C328.8,264.4 355.4,227.5 388.5,182.6L390.5,180.5Z" style="fill:rgb(0,126,198);fill-rule:nonzero;"/>
        <g transform="matrix(1.48051,0,0,1.63867,-199.999,-231.885)">
            <path d="M303.799,197.798C362.218,197.798 409.646,240.795 409.646,293.756C409.646,346.717 362.218,389.714 303.799,389.714C245.38,389.714 197.952,346.717 197.952,293.756C197.952,240.795 245.38,197.798 303.799,197.798ZM303.799,204.095C358.384,204.095 402.7,244.271 402.7,293.756C402.7,343.241 358.384,383.417 303.799,383.417C249.214,383.417 204.898,343.241 204.898,293.756C204.898,244.271 249.214,204.095 303.799,204.095Z" style="fill:rgb(2,0,0);"/>
        </g>
    </g>
    </svg>`;

        var selectedIcon = agency === "USGS" ? usgsIcon : noaaIcon;
        return L.divIcon({
          iconSize: new L.Point(20, 20),
          className: "my-div-icon",
          iconAnchor: [0, 0],
          html:
            "<div style='width: 15px; height: 15px;'>" +
            selectedIcon +
            "</div>",
        });
      } else if (value === null) {
        return L.divIcon({
          iconSize: new L.Point(20, 20),
          className: "my-div-icon",
          iconAnchor: [0, 0],
          html:
            "<div style=' height:15px; width:15px;'>" +
            "<img style='float: left; width: 100%; height: 100%; marging-bottom:-15px; margin-left: -1px; margin-top: -1px;' src='" +
            require("../../assets/nullIcon2.svg") +
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
      if (prcp >= 0 && prcp <= 0.75) {
        rgb.r = 255 - 255 * (prcp / 0.75);
        rgb.g = 255;
        rgb.b = 255;
      } else if (prcp > 0.75 && prcp <= 1.0) {
        rgb.r = 0;
        rgb.g = 255 - 230 * ((prcp - 0.75) / (1.0 - 0.75));
        rgb.b = 255;
      } else if (prcp > 1 && prcp <= 2) {
        rgb.r = 125 * ((prcp - 1.0) / (2.0 - 1.0));
        rgb.g = 125;
        rgb.b = 255;
      } else if (prcp > 2 && prcp <= 4) {
        rgb.r = 125;
        rgb.g = 125 - 125 * ((prcp - 2) / (4.0 - 2.0));
        rgb.b = 255;
      } else if (prcp > 4 && prcp <= 8) {
        rgb.r = 125;
        rgb.g = 0;
        rgb.b = 255 - 230 * ((prcp - 4.0) / (8.0 - 4.0));
      } else if (prcp > 8 && prcp <= 16) {
        rgb.r = 125 - 125 * ((prcp - 8.0) / (16.0 - 8.0));
        rgb.g = 0;
        rgb.b = 125;
      } else if (prcp > 16 && prcp <= 30) {
        rgb.r = 0;
        rgb.g = 0;
        rgb.b = 125 - 125 * ((prcp - 16.0) / (30.0 - 16.0));
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
            this.selectedDateType === "Por Día"
              ? this.stationsList[i].VALUE
              : this.selectedDateType === "Por Rango"
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
    downloadToCsv: async function(stationID) {
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

      var stationsDataSet = await dataSetResponse.json();

      var dataCsv = stationsDataSet.map((row) => ({
        //Name of the variable is the name that will be printed out in the csv file for the top row.
        Fecha: row.DATE,
        Valor: row.VALUE,
      }));

      dataCsv;

      const csvRows = [];

      //Get the headers.
      const headers = Object.keys(dataCsv[0]);
      csvRows.push(headers.join(","));

      //Loop over the rows.
      for (const row of dataCsv) {
        const values = headers.map((header) => {
          const escaped = ("" + row[header]).replace(/"/g, '\\"');
          return `"${escaped}"`;
        });
        //Form escaped comma separated values.
        csvRows.push(values.join(","));
      }

      //Now we create a download method for this newly created csv data format.
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", "DataGráfica.csv"); //The default name of the saved file.
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },

    setChart: async function(
      modalId,
      spanClass,
      charttype,
      labelName,
      stationID,
      municipality,
      fecha,
      max,
      min,
      des,
      er,
      avg
    ) {
      this.estacion = stationID;
      this.municipality = municipality;
      this.fecha = fecha;
      this.max = max;
      this.min = min;
      this.des = des;
      this.er = er;
      this.avg = avg;

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
                  backgroundColor: "#56ddd281",
                  borderColor: "#56ddd2",
                  borderWidth: 1,
                  data: formatedDataSet,
                },
              ],
            },
            options: {
              responsive: true,

              legend: {
                labels: {
                  fontColor: "white",
                  fontSize: 20,
                },
              },
              tooltips: {
                mode: "index",
                intersect: false,
              },
              animation: {
                duration: 0.3,
              },
              hover: {
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
                      fontColor: "white",
                      fontSize: 20,
                    },
                    ticks: {
                      source: "labels",
                      autoSkip: true,
                      fontColor: "white",
                      fontSize: 20,
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
                    ticks: {
                      fontColor: "white",
                      beginAtZero: true,
                      fontSize: 20,
                      steps: 1,
                      stepValue: 1,
                    },
                    display: true,
                    scaleLabel: {
                      display: true,
                      labelString: yLabel,
                      fontStyle: "bold",
                      fontColor: "white",
                      fontSize: 20,
                    },
                    gridLines: { color: "rgba(255, 255, 255, 0.3)" },
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
                  backgroundColor: "#56ddd281",
                  borderColor: "#56ddd2",
                  borderWidth: 3,
                  lineTension: 0.4,
                  data: formatedDataSet,
                  fill: false,
                },
              ],
            },
            options: {
              responsive: true,
              legend: {
                labels: {
                  fontColor: "white",
                  fontSize: 20,
                },
              },
              tooltips: {
                mode: "index",
                intersect: false,
              },
              animation: {
                duration: 0.3,
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
                      fontColor: "white",
                      fontSize: 20,
                    },
                    ticks: {
                      source: "labels",
                      autoSkip: true,
                      fontColor: "white",
                      fontSize: 20,
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
                    ticks: {
                      fontSize: 20,
                      fontColor: "white",
                      steps: 10,
                      stepValue: 10,
                      //max:100 <-- This will be the biggest the chart will get but does not show the full behavior of the chart.
                    },
                    scaleLabel: {
                      display: true,
                      labelString: yLabel,
                      fontStyle: "bold",
                      fontColor: "white",
                      fontSize: 20,
                    },
                    gridLines: { color: "rgba(255, 255, 255, 0.3)" },
                  },
                ],
              },
            },
          };
      }

      var ctx = document.getElementById("myChart").getContext("2d");
      this.myChart = new Chart(ctx, config);

      //This is an object with all of the data that is going to be placed in the csv file.
      var dataCsv = stationsDataSet.map((row) => ({
        //Name of the variable is the name that will be printed out in the csv file for the top row.
        Fecha: row.DATE,
        Valor: row.VALUE,
      }));

      this.csv = dataCsv; //This is the variable that will have the raw json data that needs to be converted.
    },
    objectToCsv: function() {
      const csvRows = [];

      //Get the headers.
      const headers = Object.keys(this.csv[0]);
      csvRows.push(headers.join(","));

      //Loop over the rows.
      for (const row of this.csv) {
        const values = headers.map((header) => {
          const escaped = ("" + row[header]).replace(/"/g, '\\"');
          return `"${escaped}"`;
        });
        //Form escaped comma separated values.
        csvRows.push(values.join(","));
      }

      //Now we create a download method for this newly created csv data format.
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", "DataGráfica.csv"); //The default name of the saved file.
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
      this.isCentered = false

      if (center !== this.center) {
        document.getElementById("centerBtn").style.opacity = 1;
        document.getElementById("centerBtn").style.pointerEvents = "all";
        document.getElementById("centerBtn").style.transform =
          "translateY(0px)";
      }
    },
    recenter: function() {
      this.mapChanged = this.mapChanged + 1;
      this.zoom = 9.9;
      this.center = latLng(18.213698, -66.348032);
      document.getElementById("centerBtn").style.transform = "translateY(10px)";
      document.getElementById("centerBtn").style.opacity = 0;
      document.getElementById("centerBtn").style.pointerEvents = "none";
    },

    recenterPopup: function() {
      if (this.selectedDateType === "Por Rango" && !this.isCentered) {
        console.log(this.center+' '+ this.currentCenter);
        this.mapChanged = this.mapChanged + 1;
        this.zoom = 9.9;
        this.center = latLng(18.213698, -66.348032);
        document.getElementById("centerBtn").style.transform =
          "translateY(10px)";
        document.getElementById("centerBtn").style.opacity = 0;
        document.getElementById("centerBtn").style.pointerEvents = "none";
        this.isCentered = true;
      }
    },

    calendarOpen: function() {
      document.getElementById("date2").style.display = "none";
      document.getElementById("calendar").style.display = "block";
    },
    calendarClose: function() {
      if (this.date.length === 2 || this.selectedDateType === "Por Día") {
        document.getElementById("calendar").style.display = "none";
        document.getElementById("date2").style.display = "block";
      }
    },
    OpenChart: function(
      varType,
      modalId,
      spanClass,
      chartType,
      labelName,
      stationID,
      municipality,
      startdate,
      enddate,
      max,
      min,
      des,
      err,
      avg
    ) {
      this.estacion = stationID;
      this.municipality = municipality;
      this.max = max;
      this.min = min;
      this.des = des;
      this.er = err;
      this.avg = avg;

      let routeData = this.$router.resolve({
        name: "routeName",
        path: `/graph/${varType}/${modalId}/${spanClass}/${chartType}/${labelName}/${stationID}/${municipality}/${startdate}/${enddate}/${max}/${min}/${des}/${err}/${avg}/`,
      });

      window.open(routeData.href, "_blank");
    },
  },
};
/* eslint-enable */
</script>
<style scoped>
.mapContainer2 {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
}
.mapContainer {
  display: flex;
  height: 80%;
  flex-direction: column;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  -webkit-box-shadow: inset 0px 0px 200px rgba(243, 243, 243, 0.1),
    0px 5px 25px rgba(24, 24, 24, 0.11);
  box-shadow: inset 0px 0px 200px rgba(243, 243, 243, 0.1),
    0px 5px 25px rgba(24, 24, 24, 0.11);
  padding-top: 20px;
  padding-bottom: 20px;
  padding: 20px;
}

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
  top: -60px;
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
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
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
  font-size: 20px;
}

.map {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
  padding: 0;
}

.centerContent {
  position: absolute;
  display: flex;
  text-align: center;
  justify-content: center;
  align-content: center;
  width: 100%;
  z-index: 1;
  pointer-events: none;
  cursor: none;
  bottom: 0px;
}

.centerBtn {
  padding-top: 20px;
  pointer-events: all;
  padding-bottom: 20px;
  padding-left: 25px;
  padding-right: 25px;
  margin-bottom: 20px;
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
  pointer-events: none;
  opacity: 0;
  transition: 0.2s;
  transform: translateY(10px);
}

.centerBtn:hover {
  background: #56ddd2;
  transform: translateY(-5px);
}

.leyenda {
  background-color: white;
  font-size: 1.5vh;
  width: 255px;
  background: inherit;
  backdrop-filter: blur(10px);
  box-shadow: inset 0px 0px 200px rgba(56, 56, 56, 0.836);
  color: white;
  border-radius: 10px;
  padding: 10px;
  font-family: "Lato", sans-serif;
  text-align: center;
}

.leyendaCol {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.leyendaCol span {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}

.leyendaCol img {
  width: 100%;
}

.leyendaCol h4 {
  font-weight: 400;
}
.leyenda h3 {
  font-weight: 700;
}

.legendImage {
  justify-content: center;
  display: flex;
  background: inherit;
  height: auto;
  backdrop-filter: blur(10px);
  box-shadow: inset 0px 0px 200px rgba(56, 56, 56, 0.836);
}

.popup {
  background: #2c2f33;
  box-shadow: 0px 3px 10px rgb(27, 27, 27);
  border-radius: 10px;
  color: white;
  padding: 20px;
  font-size: 1rem;
  margin: -20px;
  font-family: "Lato", sans-serif;
}
.popup strong {
  color: #56ddd2;
}
.popupBtns {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.graphContainer {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.toolbar {
  display: flex;
  background: #23272a;
  width: fit-content;
  border-bottom-right-radius: 100px;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 20px;
  color: #56ddd2;
  padding: 10px;
  padding-right: 30px;
}

.chartContent {
  padding-left: 10px;
  padding-right: 10px;
}

.graphOptions {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.extraInfo {
  display: flex;
  background: #23272a;
  padding: 20px;
  color: white;
  flex-direction: row;
  font-size: 2.7vh;
  border-radius: 10px;
  justify-content: center;
  height: fit-content;
}

.infoContent {
  width: fit-content;
  height: fit-content;
}
.graphOptions strong {
  color: #56ddd2;
}

/*
This witll be the end of the nav bar
*/

@media only screen and (max-height: 719px) {
  .extraInfo {
    font-size: 2vh;
  }
}

@media only screen and (max-width: 1023px), (max-height: 549px) {
  .mapContainer {
    display: none;
  }
}
</style>
