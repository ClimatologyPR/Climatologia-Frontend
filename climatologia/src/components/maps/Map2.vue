<template>
  <v-row no-gutters style="height: 100%;">
        <v-col cols="12"   style="background-color:#ecfffd;">
            <v-navigation-drawer
                v-model="drawer"
                absolute
                bottom
                temporary
                right
                class="menu-drawer pt-0 pb-0"        
            >
                <v-row no-gutters style="height: 100%;">
                    <v-col cols="12"  class="pa-3" >
                        <v-card hover  height="100%" width="100%" color="#f5f5f6">
                        <v-col cols="12" >
                            <hr>
                            <h3 class="fontsz">Zonas Climáticas:</h3>
                            <v-combobox
                                v-model="selectedFilters"
                                :items="filters"
                                label="Filtros"
                                prepend-icon="mdi-layers"
                                 multiple
                                small-chips
                                clearable
                                chips
                                solo
                                :disabled="disable"
                            ></v-combobox>
                            <hr>
                        </v-col>
                        <v-col cols="12" >
                            <h3 class="fontsz">Fecha:</h3>
                            <v-row class="pl-3 pr-3">
                                <v-col cols="5" >
                                    <v-select
                                        v-model="selectedDateType"
                                        prepend-icon="mdi-menu"
                                        :items="['Día', 'Rango']"
                                        label="Fecha"
                                        dense
                                        @change="overlay = !overlay"
                                        solo
                                        outlined
                                        :disabled="disable"
                                    ></v-select>
                                </v-col>
                                <v-col v-if="selectedDateType === 'Día'" cols="5" >
                                    <v-dialog
                                        ref="dialog"
                                        v-model="modal1"   
                                        width="290px"
                                        style="z-index: 1000;"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                v-model="SingleDateText"
                                                label="Fecha"
                                                prepend-icon="mdi-calendar"
                                                v-on="on"
                                                outlined
                                                solo
                                                dense
                                                :disabled="disable"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker locale="es-ES"  v-model="date" color="#82ada9" @input="validate('modal1')" no-title  :show-current="false" scrollable min="2000-08-15" max="2019-03-20">
                                        </v-date-picker>
                                    </v-dialog>
                                </v-col>
                                <v-col v-else-if="selectedDateType === 'Rango'" cols="7">
                                    <v-dialog
                                        ref="dialog"
                                        v-model="modal2"
                                        width="290px"
                                        style="z-index: 1000;"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                v-model="dateRangeText"
                                                label="Fecha"
                                                prepend-icon="mdi-calendar"
                                                v-on="on"
                                                solo
                                                dense
                                                outlined
                                                readonly
                                                :disabled="disable"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker  locale="es-ES" @input="validate('modal2')" no-title color="#82ada9"  v-model="date" scrollable range :min="minDate" :max="maxDate">
                                        </v-date-picker>
                                        </v-dialog>
                                </v-col>        
                            </v-row>
                        </v-col>
                        <v-col  class="col-12 pt-0 pb-0" >
                            <h3 class="fontsz">Variables:</h3>
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                        id="btn1"
                                        v-on="on"
                                        :class="btnPrcpClass"
                                        :loading="loading"
                                        :disabled="disable"
                                        @click="setButtonPressed('btn1'), overlay = !overlay, fetchStations('prcp', (rangeDate?   date[0] :  date ), (rangeDate? date[1] :   date ))"
                                    >
                                        <v-icon>  mdi-weather-pouring</v-icon>
                                            <!-- Precipitación -->
                                    </v-btn>
                                </template>
                                    <span>Precipitación</span>
                            </v-tooltip>
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                        id="btn2"
                                        v-on="on"
                                        :class="btnTmaxClass"
                                        :loading="loading1"
                                        :disabled="disable"
                                        @click="setButtonPressed('btn2'), overlay = !overlay, fetchStations('tmax', (selectedDateType === 'Rango'?   date[0] :   date ), (rangeDate? date[1] :   date ))"
                                    >
                                        <v-icon>mdi-thermometer-lines</v-icon>
                                    </v-btn>
                                </template>
                                    <span>Temperatura Máxima</span>
                            </v-tooltip>            
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                        id="btn3"
                                        v-on="on"
                                         :class="btnTminClass"
                                        :loading="loading2"
                                        :disabled="disable"
                                        @click="setButtonPressed('btn3'), overlay = !overlay, fetchStations('tmin', (rangeDate?  date[0] :  date ), (rangeDate? date[1] :  date ))"
                                    >
                                        <v-icon>mdi-thermometer-lines</v-icon>
                                    </v-btn>
                                </template>
                                    <span>Temperatura Mínima</span>
                            </v-tooltip>
                            <hr>
                        </v-col>
                        <v-col cols="12">
                            <v-checkbox dense :disabled="disable" v-model="hideMenu" label="Menu Oculto" hide-details></v-checkbox>
                        </v-col>
                        </v-card>
                    </v-col>
                </v-row>
            </v-navigation-drawer>
            <v-row style="background-color: #e1e2e1;">
                <v-col class="7" >
                    <v-card  tile  elevation="10" height="100%" width="100%">
                            <l-map
                                class="map"
                                ref="map"
                                v-if="showMap"
                                :zoom="zoom"
                                :center="center"
                                :options="mapOptions"
                                style="z-index: 0;"
                                @update:center="centerUpdate"
                                @update:zoom="zoomUpdate"
                            >
                                <l-tile-layer
                                    :url="url"
                                    :attribution="attribution"
                                />
                                <v-container >
                                    <l-control   class="example-custom-control">
                                        <v-btn v-if="menuControl" @click.stop="drawer = !drawer" ><v-icon dark>mdi-menu</v-icon></v-btn>
                                    </l-control>
                                </v-container>
                                <l-control position="bottomleft" >
                                            <v-card class="ml-4 " style="background-color: white;">
                                                 <h3>Leyenda</h3> 
                                            <v-row dense class="pl-2 pr-2" >
                                               
                                            <v-col class="pa-0 pt-1 pr-1">
                                            <v-img
                                            style="float:left;"
                                            :src="require('../../assets/nullicon.png')"
                                            height="10px"
                                            width='10px'
                                            />
                                            </v-col>
                                            <h4 class="mr-1">Valor Nulo </h4>
                                            <v-col class="pl-1 pt-1 pr-1">
                                            <v-img
                                            style="float:left;"
                                            :src="require('../../assets/noaa.png')"
                                            height="10px"
                                            width='10px'
                                            />
                                            </v-col>
                                            <h4 class="mr-1">NOAA </h4>
                                            <v-col class="pl-1 pt-1 pr-1">
                                            <v-img
                                            style="float:left;"
                                            :src="require('../../assets/usgs.png')"
                                            height="10px"
                                            width='10px'
                                            />
                                            </v-col>
                                            <h4>USGS </h4>
                                        </v-row>
                                        </v-card>
                                </l-control>    
                                <l-control
                                    :position="'bottomleft'"
                                    class="custom-control-watermark"
                                >
                                    <v-card class="ml-4 " style="background-color: white;">
                                        <v-row dense class="pl-2 pr-2" >
                                    <h2>{{(date && selectedDateType === 'Día'? SingleDateText : dateRangeText)}}</h2>
                                        </v-row>
                                    </v-card>
                                </l-control>
                                            
                                <v-container v-model="stationsList"> 
                                    <div v-for="(station, i) in stationsList" 
                                        :key="`${station.DATE}-${Math.floor(Math.random() * Math.floor(100000))}-${station.STATIONID}`"
                                    >
                                        <l-marker
                                            :visible ="markerOpacity"
                                            :lat-lng="coordinates(station.LATITUDE, station.LONGITUDE)"
                                            :icon="iconList[i]"
                                        >
                                            <l-popup >
                                                <strong> Agencia: </strong>
                                                {{station.AGENCYID}}
                                                <br>
                                                <strong>ID de Estación: </strong>
                                                {{(station.STATIONID).toString()}}
                                                <br>
                                                <strong>Municipio: </strong>
                                                {{(station.MUNICIPALITY).toString()}}
                                                <br>
                                                <strong>Zona Climática: </strong> 
                                                {{(station.CLIMATEZONE).toString()}}
                                                <br>
                                                <div v-if="selectedDateType === 'Día' "> 
                                                    <strong> {{(currentPinView === 'prcp'? 'Precipitación:' : currentPinView === 'tmax'? 'Temperatura Máxima' : 'Temperatura Mínima')}}</strong> 
                                                        {{(station.VALUE === null || station.VALUE === undefined  ? 'NULL' : (station.VALUE).toString())}}
                                                        {{(currentPinView === 'prcp' && station.VALUE !== null ? '\"' : station.VALUE !== null ? '°F' : '')}}
                                                    <br> 
                                                </div>
                                                <div v-else-if="selectedDateType === 'Rango' && station.AVGVALUE != undefined">
                                                    <strong> Precipitación Promedio: </strong> {{(station.AVGVALUE).toString()}} " 
                                                    <br> 
                                                    <strong>Máximo: </strong>  {{(station.MAXVALUE).toString()}}
                                                    <br>
                                                    <strong>Mínimo: </strong> {{(station.MINVALUE).toString()}}
                                                    <br>
                                                    <strong>Desviación Estándar: </strong>{{(station.STDDEVVALUE).toString()}} 
                                                    <br>
                                                    <strong>Error Estándar: </strong>{{(station.STDERRVALUE).toString()}}
                                                    <br>
                                                    <v-col>
                                                    <v-btn @click="setChart( 'rangeModal', 'close','line', '  Estación: ' + station.STATIONID + ',  Municipio: ' + station.MUNICIPALITY + ',  Rango de Fecha: ' + dateRangeText + 
                                                            ',  Máximo: ' + station.MAXVALUE + (currentPinView == 'prcp'? ' in' : ' ºF') + ',  Mínimo: ' + station.MINVALUE + (currentPinView == 'prcp'? ' in' : ' ºF') +',  Desviación Estándar: ' + station.STDERRVALUE + (currentPinView == 'prcp'? ' in' : ' ºF') + ',  Error Estándar: ' + station.STDERRVALUE + (currentPinView == 'prcp'? ' in' : ' ºF'),(currentPinView === 'prcp' ? 'Precipitación ' : currentPinView === 'tmax'? 'Temperatura Máxima' : 'Temperatura Mínima'), station.STATIONID , (currentPinView === 'prcp'? '#191970 ' :currentPinView === 'tmax'? '#ad2121' : '#52ad21'))">
                                                        <v-icon>{{(currentPinView === 'prcp'? 'mdi-chart-bar' : 'mdi-chart-line')}}</v-icon>
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
                            <v-overlay  absolute :value="overlay">
                                <v-progress-circular indeterminate size="64"></v-progress-circular>
                            </v-overlay>
                    </v-card> 
                    <v-row justify="center">
                        <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" >
                            <v-card style="z-index: 20000; position: absolute;">
                                <v-toolbar dark color="#82ada9">
                                    <v-btn icon dark @click="dialog = false, myChart.destroy()">
                                    <v-icon>mdi-close</v-icon>
                                    </v-btn>
                                    <v-toolbar-title>Grafica para rango de fecha seleccionado</v-toolbar-title>
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
                </v-col>
                <v-col v-if="!hideMenu" cols="12"  sm="12" md="4" lg="4" xl="4" style="background-color:#e1e2e1; ">
                    <v-card  hover  height="100%" width="100%" color="#f5f5f6">
                    <v-col cols="12" >
                        <hr>
                        <h3 class="fontsz">Zonas Climáticas:</h3>
                        <v-combobox
                            v-model="selectedFilters"
                            :items="filters"
                            label="Filtros"
                            prepend-icon="mdi-layers"
                            multiple
                            small-chips
                            clearable
                            chips
                            solo
                            :disabled="disable"
                        ></v-combobox>
                        <hr>
                    </v-col>
                    <v-col>
                        <h3 class="fontsz">Fecha:</h3>
                        <v-row class="pl-3 pr-3">
                            <v-col cols="12"  sm="5" md="5" lg="5" xl="5">
                                <v-select
                                    v-model="selectedDateType"
                                    prepend-icon="mdi-menu"
                                    :items="['Día', 'Rango']"
                                    label="Fecha"
                                    dense
                                    @change="overlay = !overlay"
                                    solo
                                    outlined
                                    :disabled="disable"
                                ></v-select>
                            </v-col>
                            <v-col v-if="selectedDateType === 'Día'" cols="12"  sm="5" md="5" lg="5" xl="5" >
                                <v-dialog
                                    ref="dialog"
                                    v-model="modal3"  
                                    width="290px"
                                    style="z-index: 1000;"
                                    persistent
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            v-model="SingleDateText"
                                            label="Fecha"
                                            prepend-icon="mdi-calendar"
                                            v-on="on"
                                            outlined
                                            solo
                                            dense
                                            readonly
                                            :disabled="disable"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker  locale="es-ES" @input="validate('modal3')" v-model="date" color="#82ada9"  no-title  :show-current="false" scrollable :min="minDate" :max="maxDate">
                                    </v-date-picker>
                                </v-dialog>
                            </v-col>
                            <v-col v-else-if="selectedDateType === 'Rango'" cols="12"  sm="7" md="7" lg="7" xl="7">
                                <v-dialog
                                    ref="dialog2"
                                    v-model="modal4"
                                    width="290px"
                                    persistent
                                    style="z-index: 1000;"
                                >
                                    <template v-slot:activator="{ on }">
                                          <v-text-field :disabled="disable" v-on="on" solo dense outlined v-model="dateRangeText" label="Date range" prepend-icon="mdi-calendar" readonly></v-text-field>
                                    </template>
                                    <v-date-picker locale="es-ES" no-title @input="validate('modal4')" color="#82ada9" v-model="date" range :min="minDate" :max="maxDate"></v-date-picker>
                                </v-dialog>
                            </v-col>     
                        </v-row>
                        <hr>
                    </v-col>    
                    <v-col  class="col-12 pt-0 pb-0" >
                        <h3 class="fontsz">Variables:</h3>
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    id="btn1"
                                    v-on="on"
                                    :class="btnPrcpClass"
                                    :loading="loading"
                                    :disabled="disable"
                                    @click="setButtonPressed('btn1'),  overlay = !overlay, fetchStations('prcp', (rangeDate?   date[0] :  date ), (rangeDate? date[1] :   date ))"
                                >
                                    <v-icon>  mdi-weather-pouring</v-icon>
                                </v-btn>
                            </template>
                                <span>Precipitación</span>
                        </v-tooltip>
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    id="btn2"
                                    v-on="on"
                                    :class="btnTmaxClass"
                                    :loading="loading1"
                                    :disabled="disable"
                                    @click="setButtonPressed('btn2'), overlay = !overlay, fetchStations('tmax', (selectedDateType === 'Rango'?   date[0] :   date ), (rangeDate? date[1] :   date ))"
                                >
                                    <v-icon>mdi-thermometer-lines</v-icon>
                                </v-btn>
                            </template>
                                <span>Temperatura Máxima</span>
                        </v-tooltip>            
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    id="btn3"
                                    v-on="on"
                                    :class="btnTminClass"
                                    :loading="loading2"
                                    :disabled="disable"
                                    @click="setButtonPressed('btn3'),  overlay = !overlay, fetchStations('tmin', (rangeDate?  date[0] :  date ), (rangeDate? date[1] :  date ))"
                                >
                                    <v-icon>mdi-thermometer-lines</v-icon>
                                </v-btn>
                            </template>
                                <span>Temperatura Mínima</span>
                        </v-tooltip>
                        <hr>
                    </v-col>
                    <v-col cols="12">
                        <v-checkbox :disabled="disable" dense v-model="hideMenu" @change="recenter()" label="Menu Oculto" hide-details></v-checkbox>
                    </v-col>
                    </v-card>
                </v-col>
            </v-row>
        </v-col>
  </v-row>
</template>

<script>

/* eslint-disable */
import { latLngBounds, latLng } from "leaflet";
import { LPolygon, LMap, LTileLayer, LMarker, LPopup, LControl } from "vue2-leaflet";
import leaflet from 'leaflet'
import L from 'leaflet';
// import { climateZones } from '../layers/ClimateZones.js'
// import { EasternInterior, NorthernCoastal, NorthernSlopes, OutlyingIsland, OutlyingIsland1, OutlyingIsland2, OutlyingIsland3, OutlyingIsland4, SouthernCoastal, SouthernSlopes, WesternInterior } from '../layers/ClimateZones2.js'
import { EasternInterior } from '../layers/climatezones/EasternInterior.js'
import { NorthernCoastal } from '../layers/climatezones/NorthernCoastal.js'
import { NorthernSlopes } from '../layers/climatezones/NorthernSlopes.js'
import { OutlyingIsland, OutlyingIsland1, OutlyingIsland2, OutlyingIsland3, OutlyingIsland4 } from '../layers/climatezones/OutlyingIslands.js'
import { SouthernCoastal } from '../layers/climatezones/SouthernCoastal.js'
import { SouthernSlopes } from '../layers/climatezones/SouthernSlopes.js'
import { WesternInterior} from '../layers/climatezones/WesternInterior.js'
import Chart from 'chart.js'
export default {
  name: "Example",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LPolygon,
    LControl
  },
  data() {
    return {
        btnPrcpClass: 'ma-2 btn1',
        btnTmaxClass: 'ma-2 btn2',
        btnTminClass: 'ma-2 btn3',
        
        menuControl: false,
        hideMenu: false,
        overlay: false,
      bounds: latLngBounds([
          [18.453116, -64.987199],
        [18.097713, -68.029587]
        
      ]),
      maxBounds: latLngBounds([
          [18.453116, -64.987199],
        [18.097713, -68.029587]
        
      ]),
      zoom: 9.2,
      center: latLng(18.135412,-66.450806),
      url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
      
    //   withPopup: latLng(18.135412,-66.450806),
    //   withTooltip: latLng(47.41422, -1.250482),
      currentZoom: 11.5,
      currentCenter: latLng(47.41322, -1.219482),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5
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
        menu2: false,
        selectedDateType: 'Día',
        // date: new Date().toISOString().substr(0, 10),
        // dateFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
        minDate:'2000-01-01',
        maxDate:'2019-08-31',
        date: '2018-04-13',
        dateFormatted: ['2018-04-13','2018-04-13'],
        drawer: false,
        // group: null,

        formatedDate: '13/04/2018',
        toogled:null,
        // calculation: null,
        startdate: null,
        enddate: null,
        showStations: false,
        markerOpacity: true,
        currentPinView: null,
        pins: null,
        map: null,
        tileLayer: null,
        singleDate: true,
        rangeDate:false,
        legend: null, 
        rangeDialog: 'close',
        currentPressButton: '',
        stationsList: [],
        iconList: [],
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
        selectedFilters: ['Interior oriental', 'Costa del norte', 'Laderas del norte', 'Islas periféricas', 'Costa del sur', 'Laderas del sur', 'Interior occidental'],
        // filters: ['Eastern Interior', 'Northern Coastal', 'Northern Slopes', 'Outlying Island', 'Southern Coastal', 'Southern Slopes', 'Western Interior'],
        // selectedFilters: ['Eastern Interior', 'Northern Coastal', 'Northern Slopes', 'Outlying Island', 'Southern Coastal', 'Southern Slopes', 'Western Interior'],
        // filters: ['Eastern Interior', 'Northern Coastal', 'Northern Slopes', 'Outlying Island', 'Southern Coastal', 'Southern Slopes', 'Western Interior'],
        mychart: null 
    };
  },
  computed: {
    //   selectedFilters: function () {
    //       return ['Interior oriental', 'Costa del norte', 'Laderas del norte', 'Islas periféricas', 'Costa del sur', 'Laderas del sur', 'Interior occidental']
    //   },
      filters: function () {
          return ['Interior oriental', 'Costa del norte', 'Laderas del norte', 'Islas periféricas', 'Costa del sur', 'Laderas del sur', 'Interior occidental']
      },
      computedDateFormatted () {
      return this.formatDate(this.date)
    },
    dateRangeText () {
        if (this.date[0] && this.date[1]) {
            const [year, month, day] = this.date[0].split('-')
          const [year1, month1, day1] = this.date[1].split('-')
        return `${month}/${day}/${year}~${month1}/${day1}/${year1}`
        }
        
    //   return this.date.join(' ~ ')
    },
    SingleDateText(){
        if (!this.date) return ''
        const [year, month, day] = this.date.split('-')
        return `${month}/${day}/${year}`
    }
  },
  mounted: async function () {
      this.overlay = !this.overlay
      this.setButtonPressed('btn1')
        await this.fetchStations('prcp', (this.rangeDate?   this.date[0] :   this.date ), (this.rangeDate? this.date[1] :   this.date ));
      this.$nextTick(() => {
      });
  },
  watch: {
    //   date (val) {
    //   this.dateFormatted = this.formatDate(this.date)
    // },
    // currentPinView: function () {
    //     if (this.currentPinView === 'prcp') {
    //         this.setButtonUnpressed(this.currentPressButton)
    //         this.setButtonPressed('btn1')
    //         this.currentPressButton = 'btn1'    
    //     } else if ( this.currentPinView === 'tmax') {
    //         this.setButtonUnpressed(this.currentPressButton)
    //         this.setButtonPressed('btn2')
    //         this.currentPressButton = 'btn2' 
    //     } else if (this.currentPinView === 'tmin') {
    //         this.setButtonUnpressed(this.currentPressButton)
    //         this.setButtonPressed('btn3')
    //         this.currentPressButton = 'btn3' 
    //     }
    // },
     hideMenu: function () {
         if (this.hideMenu) {
            this.menuControl = true
            this.drawer = !this.drawer
         } else {
             this.menuControl = false
             this.drawer = !this.drawer
         }
     },
      overlay (val) { 
        //   this.markerOpacity = false
        //   this.markerOpacity = true 
        this.disable = !this.disable   
      val && setTimeout(() => {
        this.overlay = false
        // this.markerOpacity = true\
        // this.setButtonUnpressed()
        // if (this.currentPinView === 'prcp' && this.currentPressButton != 'btn1') {
        //     this.setButtonPressed('btn1')   
        // } else if ( this.currentPinView === 'tmax' && this.currentPressButton != 'btn2') {
        //     this.setButtonPressed('btn2')
        // } else if (this.currentPinView === 'tmin' && this.currentPressButton != 'btn3') {
        //     this.setButtonPressed('btn3')
        // }
      }, 3500)
      
      
    },
    disable (val) {
        val && setTimeout(() => {
        this.disable = false
        // this.drawer = !this.drawer
        console.log('disable done waiting')
      }, 3500)
    },
    loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 3000)

        this.loader = null
    },
    //   group () {
    //     this.drawer = false
    //   },
        selectedFilters: function () {
                if (this.selectedFilters.includes("Eastern Interior") || this.selectedFilters.includes("Interior oriental")) {
                    this.EI = true
                    console.log('EI true')
                } else if (!this.selectedFilters.includes("Eastern Interior") || !this.selectedFilters.includes("Interior oriental")) {
                    console.log('EI false')
                    this.EI = false
                }

                if (this.selectedFilters.includes("Northern Coastal") || this.selectedFilters.includes("Costa del norte")) {
                    this.NC = true
                } else if (!this.selectedFilters.includes("Northern Coastal") || !this.selectedFilters.includes("Costa del norte")) {
                    this.NC = false
                }

                if (this.selectedFilters.includes("Northern Slopes") || this.selectedFilters.includes("Laderas del norte")) {
                    this.NS = true
                } else if (!this.selectedFilters.includes("Northern Slopes") || !this.selectedFilters.includes("Laderas del norte")) {
                    this.NS = false
                }

                if (this.selectedFilters.includes("Outlying Island") || this.selectedFilters.includes("Islas periféricas")) {
                    this.OI = true
                } else if (!this.selectedFilters.includes("Outlying Island") || !this.selectedFilters.includes("Islas periféricas")) {
                    this.OI = false
                }

                if (this.selectedFilters.includes("Southern Coastal") || this.selectedFilters.includes("Costa del sur")) {
                    this.SC = true
                } else if (!this.selectedFilters.includes("Southern Coastal") || !this.selectedFilters.includes("Costa del sur")) {
                    this.SC = false
                }

                if (this.selectedFilters.includes("Southern Slopes") || this.selectedFilters.includes("Laderas del sur")) {
                    this.SS = true
                } else if (!this.selectedFilters.includes("Southern Slopes") || !this.selectedFilters.includes("Laderas del sur")) {
                    this.SS = false
                }

                if (this.selectedFilters.includes("Western Interior") || this.selectedFilters.includes("Interior occidental")) {
                    this.WI = true
                } else if (!this.selectedFilters.includes("Western Interior") || !this.selectedFilters.includes("Interior occidental")) {
                    this.WI = false
                }
        },
        selectedDateType: function () {
            if (this.selectedDateType === 'Día') {
                this.dateType('singleDate')
                this.date = '2018-04-04'
            } else if (this.selectedDateType === 'Rango') {
                this.dateType('rangeDate')
                this.date = ['2018-04-01', '2018-04-07']
            }
        },
        date: function () {
            if (this.selectedDateType === 'Rango' && this.date[0] && this.date[1]) {
                this.iconList=[]
                this.fetchStations(this.currentPinView, this.date[0],  this.date[1]);
            } else if (this.selectedDateType === 'Día') {
                this.iconList=[]
                this.fetchStations(this.currentPinView, this.date , this.date);
            }
            
        },
    },
  methods: {
    formatDate (date) {
      if(date.length === 2 && date[0]!=null && date[1]!=null) {
          const [year, month, day] = date[0].split('-')
          const [year1, month1, day1] = date[1].split('-')
        return `${month}/${day}/${year}~${month1}/${day1}/${year1}`
      } 
    //   else {
    //     const [year, month, day] = date.split('-')
    //     return `${month}/${day}/${year}`
    //   }
      
    },
    formatSingleDate(date){
        if (!date) return ''
        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
    },
    parseDate (date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
      validate: function (modal) {
        if (this.date[0] && this.date[1] && this.date.length ===2 && modal === 'modal2') {
            this.overlay = !this.overlay
            this.modal2 = false
        } 
        else if (this.date[0] && this.date[1] && this.date.length ===2 && modal === 'modal4') {
          this.overlay = !this.overlay
          this.modal4 = false
        }
        else if (this.date && modal === 'modal1' ) {
            this.overlay = !this.overlay
          this.modal1 = false
        } else if (this.date && modal === 'modal3' ) {
          this.overlay = !this.overlay
          this.modal3 = false
        }
    },
    validate2: function () {
        this.disable = !this.disable
        this.overlay = !this.overlay

          this.modal = false 
    },
    remove (item) {
      this.selectedFilters.splice(this.selectedFilters.indexOf(item), 1)
      this.selectedFilters = [...this.selectedFilters]
    },
    icon: function (value, agency) {
        var rgb = { r: 0, g: 0, b: 0 }
        var nullIcon
        if (this.currentPinView == 'tmin') {
            // set the rgb value of the current station element using the average value for range date  or the value  single date type with a ternary operator 
            this.getTemperaturePinColors(rgb, value);
        } else if (this.currentPinView == "tmax") {
            this.getTemperaturePinColors(rgb, value);
        } else if (this.currentPinView == "prcp") {
            this.getPrecipitationPinColors(rgb, value);
        }
        
        if (value !== null || value === undefined){
            // nullIcon = "<img style='float: left; width: 11px; height: 11px; marging-bottom:-15px; margin-left: -1px; margin-top: -1px;' src='http://climatologia.uprm.edu/img/nullicon2.svg' id='null-div-icon'/>"
            // var style = (agency === 'USGS'? " height:10px; width:10px;  marging-bottom:-15px; margin-left: -3px; border-radius:50%; border: 1px solid #ca6a1b; background-color:rgb(" + rgb.r.toString() + "," + rgb.g.toString() + " ," + rgb.b.toString() + ");" : "width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 10px solid " +  "rgb(" + rgb.r.toString() + "," + rgb.g.toString() + " ," + rgb.b.toString() + ")" +";")
            var style = (agency === 'USGS'? ` height:10px; width:10px;  marging-bottom:-15px; margin-left: -3px; border-radius:50%; border: 1px solid #ca6a1b; background-color:rgb( ${rgb.r.toString()},  ${rgb.g.toString()}, ${rgb.b.toString()});` : `width: 10px; height: 10px; border: 1px solid #ca6a1b; background-color:rgb( ${rgb.r.toString()},  ${rgb.g.toString()}, ${rgb.b.toString()});`)
            
            return L.divIcon({ iconSize: new L.Point(20, 20), className: 'my-div-icon', iconAnchor: [0, 0], html: "<div style='"+ style +"'>"+ "</div>" })
        } 
        else if (value === null){      
        return L.divIcon({ iconSize: new L.Point(20, 20), className: 'my-div-icon', iconAnchor: [0, 0], html: "<div style=' height:10px; width:10px;  marging-bottom:-15px; margin-left: -3px; border-radius:50%; border: 1px solid #ca6a1b; background-color:rgb(" + rgb.r.toString() + "," + rgb.g.toString() + " ," + rgb.b.toString() + ");'>"+ "<img style='float: left; width: 11px; height: 11px; marging-bottom:-15px; margin-left: -1px; margin-top: -1px;' src='" +  require('../../assets/nullicon.png') +"' id='null-div-icon'/>" +"</div>" })
        }
        
    },
      coordinates: function (latitude, longitude) {
        return latLng(latitude,longitude)
    },
        /**
        * get pin colors rgb values for temperature 
        * rgb: object instance consisting of key value of the rgb ({r,g,b})
        * temperature: int value of the temperature 
        **/
        getTemperaturePinColors:function (rgb,temperature) {
            if(temperature==null){
                rgb.r=255;rgb.g=255;rgb.b=255;
            }else if (temperature>=0&&temperature<40) {
                rgb.r=0;rgb.g=100;rgb.b=255;
            }else if (temperature>=40&& temperature<=70) {
                rgb.r=((temperature-40)/(70-40))*(100)+0;rgb.g=((temperature-40)/(70-40))*(255-100)+100;rgb.b=((temperature-40)/(70-40))*(255-255)+255;
            }else if (temperature>70&&temperature<=80) {
                rgb.r=((temperature-70)/(80-70))*(255-100)+100;rgb.g =((temperature-70)/(80-70))*(255-255)+255;rgb.b=((temperature-70)/(70-40))*(255-0)+0;
            }else if (temperature>80&&temperature<=90) {
                rgb.r=((temperature-80)/(90-80))*(255-255)+255;rgb.g=((temperature-80)/(90-80))*(255-0)+0;rgb.b=((temperature-80)/(90-80))*(8-0)+0;
            }else if(temperature>90&&temperature<=120){
                rgb.r=((temperature-90)/(120-90))*(255-100)+100;rgb.g = 0;rgb.b = 0;
            }
        },
        /**
        * get pin colors rgb values for precipitation 
        * rgb: object instance consisting of key value of the rgb ({r,g,b})
        * prcp: int value of the precipitation
        **/
        getPrecipitationPinColors: function (rgb, prcp) {
            if (prcp >= 0 && prcp <= 0.4) {
                rgb.r=(((255-0)*(0.4-prcp))/(0.4-0));
                rgb.g=255;
                rgb.b = 255;
            }else if (prcp>0.4&&prcp <=4.0) {
                rgb.r=0;
                rgb.g=(((255-0)*(4-prcp))/(4-0.4));
                rgb.b=255;
            }else if (prcp > 4 && prcp <= 24) {
                rgb.r=0;
                rgb.g=0;
                rgb.b=(((255-100)*(24-prcp))/(24-4)) + 100;
            }else if (prcp > 24) {
                rgb.r = 100;
                rgb.g = 0;
                rgb.b = 0;
            }else if (prcp == null) {
                rgb.r = 0;
                rgb.g = 0;
                rgb.b = 0;
                }
        },

        fetchStations: async function (type, start, end) {
            //removes the current pins instnace in the map instance
            this.iconList = []  
            if (this.pins != null) {
                // console.log('removing pins')
                this.$refs.map.mapObject.removeLayer(this.pins);
            }
            // set the global startdate variable instance to the start date value send in the params, selected in the date picker 
            this.startdate = start;
            // set the global startdate variable instance to the end date value send in the params, selected in the date picker 
            this.enddate = end;
            // set the global variable currentPinView with the current type of pin display on map
            this.currentPinView = type;
            // array instance to hold the new values for the pins to be add to the map
            let myPins = [];
            // response of the api call to be generated
            var response = null;
            // holds the json array of the api call response 
            var stations = null;
            
            // change api call depending on the type of view if it is single date or range date, based on the global bool variables singleDate and rangeDate 
            if (this.singleDate) {
                response = await fetch('http://climatologia.uprm.edu:8008/api?' + 'q=data&' + 'startdate=' + this.startdate + '&enddate=' + this.enddate + '&elem=' + this.currentPinView).catch(function (error) { alert (error); });
            } else if (this.rangeDate) { 
                 response = await fetch('http://climatologia.uprm.edu:8008/api?' + 'q=data&' + 'calc=all' + '&startdate=' + this.startdate + '&enddate=' + this.enddate + '&elem=' + this.currentPinView).catch(function (error) { alert (error); });
                // console.log('http://climatologia.uprm.edu:8008/api?' + 'q=data&' + 'calc=all' + '&startdate=' + this.startdate + '&enddate=' + this.enddate + '&elem=' + this.currentPinView)
            }
                stations = await response.json();
                this.stationsList = stations

                for (var i =0; i < this.stationsList.length; i++) {
                    this.iconList.push(this.icon((this.selectedDateType === 'Día' ? this.stationsList[i].VALUE :this.selectedDateType === 'Rango' ? this.stationsList[i].AVGVALUE : null), this.stationsList[i].AGENCYID))
                }
            return;
        },
        /**
        * change a button propeties to make it look pressed
        **/
        // toogle: function (id,btnlist) {
        //     for(var i = 0; i< btnlist.length;i++){
        //     document.getElementById(btnlist[i]).classList.remove('selectedbtn');
        //     document.getElementById(btnlist[i]).classList.add(btnlist[i]);
        //     }
        //     document.getElementById(id).classList.remove(id);
        //     document.getElementById(id).classList.add('selectedbtn');
        // },
        /**
        * set the type of date to true 
        **/
        dateType: function(type) {
            // console.log('change: ' + type);
            if (type == 'singleDate') { 
                this.rangeDate = false
                this.singleDate = true
            }
            else if( type == 'rangeDate') { 
                this.singleDate= false
                this.rangeDate= true
            }
        },
        /**
        * close range modal
        **/
        closeRangeModal: function () {
            this.rangeModal.style.display = "none";
        },
        /**
        *
        **/
        openModal: function (modalId, spanClass) {
            var modal = document.getElementById(modalId);
            modal.style.display = 'block';
            var span = document.getElementsByClassName(spanClass)[0];
            span.onclick = function () {
              modal.style.display = 'none';
            }

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function (event) {
                if (event.target == modal) {
                    modal.style.display = 'none';
                }
            }
        },
    setChart: async function (modalId, spanClass, charttype, title, labelName, stationID, color) {
        this.dialog = !this.dialog
        //since the button is in the HTML dialog  intances are used instead of passing parameters throught a function call 
        // var modal = document.getElementById(modalId);
        // modal.style.display = 'block';
        // var span = document.getElementsByClassName(spanClass)[0];

        var config=null;
        var stationLabels =[]
        var dataSetResponse = await fetch('http://climatologia.uprm.edu:8008/api?' + 'q=data&' + 'calc=none' + '&station='+ stationID + '&startdate='  + this.startdate + '&enddate=' + this.enddate + '&elem=' + this.currentPinView).catch(function (error) { alert (error); });
        var yLabel = (this.currentPinView === 'prcp' ? 'Precipitación (in)' : this.currentPinView === 'tmax' ? 'Temperatura Máxima (ºF)' : 'Temperatura Mínima (ºF)')
        var stationsDataSet = await dataSetResponse.json();
            

        const date1 = new Date(this.startdate);
        const date2 = new Date(this.enddate);
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        var maxTickX = 20;

        if (diffDays/7 <= 1) {
                maxTickX = diffDays;
        } else if (diffDays/30 >= 1 && diffDays/30 <= 12) {
            maxTickX = Math.ceil(diffDays / 30) * 12;
        } else if (diffDays / 365 >= 1) {
            maxTickX = Math.ceil(diffDays / 365)*12*2;
        }
        var formatedDataSet = []

        for (var i = 0; i < stationsDataSet.length; i ++) {
            var temp = new Object();
            stationLabels.push(stationsDataSet[i].DATE.substring(0, 16));
            temp['y'] = stationsDataSet[i].VALUE;
            formatedDataSet.push(temp);
        }
        switch(this.currentPinView) {
            case 'prcp':
                config =  {
                    type: 'bar',
                    data: {
                        labels: stationLabels,
                        datasets: [{
                        label: labelName,
                        backgroundColor: color,
                        borderColor: color,
                        data: formatedDataSet,
                        // backgroundColor: "rgba(25, 25, 112, 1)"
                        }]
                    },
                    options: {
                        responsive: true,
                        title: {
                            display: true,
                            text: title,
                            fontColor: '#000',
                            fontSize: 14
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        animation: {
                            duration: 0 
                        },
                        hover: {
                            // mode: 'nearest',
                            // intersect: true
                            animationDuration: 0
                        },
                        responsiveAnimationDuration: 0,
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Día',
                                    fontStyle: 'bold',
                                    fontColor: '#000'
                                },
                                    ticks: {
                                        source: 'labels',
                                        autoSkip: true,
                                        autoSkipPadding: 20,
                                        maxRotation: 90,
                                        maxTicksLimit: maxTickX,
                                        // stepSize: diffDays / maxTickX,
                                        callback: function (tick, index) {
                                            // console.log(Math.ceil(diffDays / 10) % (index + 1));
                                            // return ((index + 1) % (Math.ceil(diffDays / 10)))  ? '' : index + 1;
                                             return index + 1;
                                        }
                                    }
                                }],
                                yAxes: [{ 
                                    display: true,
                                    scaleLabel: {
                                        display: true,
                                        labelString: yLabel,
                                        fontStyle: 'bold',
                                        fontColor: '#000',
                                        ticks: {
                                            beginAtZero: true,
                                            steps: 10,
                                            stepValue: 10,
                                            max: 100
                                        }
                                    }
                                }]
                            }
                        }
                    };
                    break;
                default: 
                config = {
                        type: 'line',
                        data: {
                            labels: stationLabels,
                            datasets: [{
                                label: labelName,
                                backgroundColor: color,
                                borderColor: color,
                                data: formatedDataSet,
                                fill: false
                            }]
                        },
                        options: {
                            responsive: true,
                            title: {
                                display: true,
                                text: title,
                                fontColor: '#000',
                                fontSize: 14
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false,
                            },
                            animation: {
                                duration: 0
                            },
                            hover: {
                                // mode: 'nearest',
                                // intersect: true
                                animationDuration: 0
                            },
                            responsiveAnimationDuration: 0,
                            scales: {
                                xAxes: [{
                                    display: true,
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Día',
                                        fontStyle: 'bold',
                                        fontColor: '#000'
                                    },
                                    ticks: {
                                        source: 'labels',
                                        autoSkip: true,
                                        autoSkipPadding: 4,
                                        maxRotation: 0,
                                        maxTicksLimit: maxTickX,
                                        stepSize: 3,
                                        callback: function (value, index) {
                                            return index + 1;
                                        }
                                    }
                                }],
                                yAxes: [{
                                    display: true,
                                    scaleLabel: {
                                        display: true,
                                        labelString: yLabel,
                                        fontStyle: 'bold',
                                        fontColor: '#000',
                                        ticks: {
                                            steps: 10,
                                            stepValue: 10,
                                            max: 100
                                        }
                                    }
                                }]
                            }
                        }
                    };

            }
            
            var ctx = document.getElementById('myChart').getContext('2d');
            this.myChart = new Chart(ctx, config);

            // span.onclick = function () {
            //   modal.style.display = 'none';
            //   myChart.destroy();
            // }
            // When the user clicks anywhere outside of the modal, close it
            // window.onclick = function (event) {
            //     if (event.target == modal) {
            //         modal.style.display = 'none';
            //         myChart.destroy();
            //     }
            // }
            // myChart.destroy();
        },
    setButtonPressed: function (id) {
        // this.toogled = id
        console.log(`pressed button with id '${id}'`)
        // if (this.currentPressButton !== id) {
        //     document.getElementById(id).classList.remove(id)
        // }
        // document.getElementById(id).classList.add('selectedbtn')
        this.setButtonUnpressed()
        if(id === 'btn1') {
            this.btnPrcpClass = 'ma-2 selectedbtn'
            this.currentPressButton = 'btn1'
        } else if (id === 'btn2') {
            this.btnTmaxClass = 'ma-2 selectedbtn'
            this.currentPressButton = 'btn2'
        } else if (id === 'btn3') {
            this.btnTminClass = 'ma-2 selectedbtn'
            this.currentPressButton = 'btn3'
        }
        
        this.currentPressButton = id
    },
    setButtonUnpressed: function () {
        if(this.currentPressButton === 'btn1') {
            this.btnPrcpClass = 'ma-2 btn1'
        } else if (this.currentPressButton === 'btn2') {
            this.btnTmaxClass = 'ma-2 btn2'
        } else if (this.currentPressButton === 'btn3') {
            this.btnTminClass = 'ma-2 btn3'
        }
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
    recenter: function () {
        this.currentCenter = this.center
        this.currentZoom = this.zoom
    }
  }
};
/* eslint-enable */
</script>
<style scoped>
@media only screen and (min-width: 360px) and (max-width: 768px ) {

    .map{
        height: 58vh;
        margin: 0;
        padding: 0;
    }
    .drawer-icon {
        border-radius: 8% !important;
        border: 2px solid #a6babc;
        background-color: #ffffff;
        float: right;
        position:absolute;
        z-index:1001; 
        top: 20%;
        left: 5.12%;
        font-size:5vh
    }
    .menu-drawer {
        width: 30% !important;
    }
    .my-div-icon{
        background-color:#fd8424;
        border-radius:3px;
        border:2px solid #ca6a1b;
        }
    .my-div-icon{
        height:0;
        width:0;
        background-color:rgba(0,0,0,0);
        border-radius:40%;
        border-style:none
    }
    
              
    /* .input {
        width: 15vh;
     } */
    #selecteddate{
        float: right;
        position:absolute;
        z-index:1001; 
        top: 0;
        left:25%;
        font-size:5vh;
    }
    .fontsz {
        font-size: 2vh;
    }
}
@media only screen and (min-width: 1024px) and (max-width: 1440px) { 

    .map{
        height: 68vh;
        margin: 0;
        padding: 0;
    }
    .drawer-icon {
        border-radius: 8% !important;
        border: 2px solid #a6babc;
        background-color: #ffffff;
        float: right;
        position:absolute;
        z-index:1001; 
        top: 20%;
        left:1.12%;
        font-size:5vh
        
    }
    .menu-drawer {
        width: 30% !important;
    }
    .my-div-icon{
        background-color:#fd8424;
        border-radius:3px;
        border:2px solid #ca6a1b;
        }
    .my-div-icon{
        height:0;
        width:0;
        background-color:rgba(0,0,0,0);
        border-radius:40%;
        border-style:none
    }
    
              
    /* .input {
        width: 15vh;
     } */
    #selecteddate{
        float: right;
        position:absolute;
        z-index:1001; 
        top: 0;
        left:25%;
        font-size:5vh;
    }
    .fontsz {
        font-size: 2vh;
    } 
 }

@media only screen and (min-width: 1440px) and (max-width: 1680px) {

    .map{
        height: 76vh;
        margin: 0;
        padding: 0;
    }
    .drawer-icon {
        border-radius: 8% !important;
        border: 2px solid #a6babc;
        background-color: #ffffff;
        float: right;
        position:absolute;
        z-index:1001; 
        top: 20%;
        left:1.12%;
        font-size:5vh
    }
    .menu-drawer {
        width: 30% !important;
    }
    .my-div-icon{
        background-color:#fd8424;
        border-radius:3px;
        border:2px solid #ca6a1b;
        }
    .my-div-icon{
        height:0;
        width:0;
        background-color:rgba(0,0,0,0);
        border-radius:40%;
        border-style:none
    }
    
              
    /* .input {
        width: 15vh;
     } */
    #selecteddate{
        float: right;
        position:absolute;
        z-index:1001; 
        top: 0;
        left:25%;
        font-size:5vh;
    }
    .fontsz {
        font-size: 2vh;
    }
 }
@media only screen and (min-width: 1680px) and (max-width: 1920px) {
 
    .map{
        height: 76vh;
        margin: 0;
        padding: 0;
    }
    .drawer-icon {
        border-radius: 8% !important;
        border: 2px solid #a6babc;
        background-color: #ffffff;
        float: right;
        position:absolute;
        z-index:1001; 
        top: 20%;
        left:1.12%;
        font-size:5vh
    }
    .menu-drawer {
        width: 30% !important;
    }
    .my-div-icon{
        background-color:#fd8424;
        border-radius:3px;
        border:2px solid #ca6a1b;
        }
    .my-div-icon{
        height:0;
        width:0;
        background-color:rgba(0,0,0,0);
        border-radius:40%;
        border-style:none
    }
    
              
    /* .input {
        width: 15vh;
     } */
    #selecteddate{
        float: right;
        position:absolute;
        z-index:1001; 
        top: 0;
        left:25%;
        font-size:5vh;
    }
    .fontsz {
        font-size: 2vh;
    } 
 }
 @media only screen and (min-width: 1920px) and (max-width: 32560px) { 
    .map{
        height: 68vh;
        margin: 0;
        padding: 0;
    }
    .drawer-icon {
        border-radius: 8% !important;
        border: 2px solid #a6babc;
        background-color: #ffffff;
        float: right;
        position:absolute;
        z-index:1001; 
        top: 10%;
        left:0.9%;
        font-size:5vh
    }
    .menu-drawer {
        width: 30% !important;
    }
    .my-div-icon{
        background-color:#fd8424;
        border-radius:3px;
        border:2px solid #ca6a1b;
        }
    .my-div-icon{
        height:0;
        width:0;
        background-color:rgba(0,0,0,0);
        border-radius:40%;
        border-style:none
    }
    
    #selecteddate{
        float: right;
        position:absolute;
        z-index:1001; 
        top: 0;
        left:25%;
        font-size:5vh;
    }
    .fontsz {
        font-size: 2vh;
    } 
 }
@media only screen and (min-width: 32560px)  { 

 }
 
    html,body {
        height:100%;
    }
    .btn1{
        background-color: blue !important;
    }
    .btn2{
        background-color: red !important;
    }
    .btn3{
        background-color: green !important;
    }
    .selectedbtn{
        /* background-color: grey; */
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19) !important;
        border: 2px solid grey !important; /* Green */
        /* color: white; */
    }
    .unselectedbtn{
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
        height: 100%; /* Full height */
        overflow: auto; /* Enable scroll if needed */
        background-color: rgb(0,0,0); /* Fallback color */
        background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
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