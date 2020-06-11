<template>
  <v-row no-gutters style="height: 100%; width: 80%;">
    <v-col cols="12">
      <v-card  height="auto" width="auto" color="rgba(255,255,255,0.85)">
        <v-col cols="12">
          <h3 class="fontsz">Zonas Climáticas:</h3>
          <v-combobox
            v-model="selectedFilters"
            :items="filters"
            :disabled="disable"
            label="Filtros"
            prepend-icon="mdi-layers"
            multiple
            small-chips
            clearable
            chips
            solo
          ></v-combobox>
          <hr />
        </v-col>
        <v-col cols="12">
          <h3 class="fontsz">Fecha:</h3>
          <v-row class="pl-3 pr-3">
            <v-col cols="5">
              <v-select
                v-model="selectedDateType"
                :items="['Día', 'Rango']"
                prepend-icon="mdi-menu"
                label="Fecha"
                dense
                solo
                outlined
                :disabled="disable"
              ></v-select>
            </v-col>
            <v-col v-if="selectedDateType === 'Día'" cols="5">
              <v-dialog
                ref="dialog"
                v-model="singleDatePicker"
                width="200px"
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
                <v-date-picker
                  locale="es-ES"
                  v-model="date"
                  color="#82ada9"
                  @input="validate('single')"
                  no-title
                  :show-current="false"
                  scrollable
                  min="2000-08-15"
                  max="2019-03-20"
                >
                </v-date-picker>
              </v-dialog>
            </v-col>
            <v-col v-else-if="selectedDateType === 'Rango'" cols="11">
              <v-dialog
                ref="dialog"
                v-model="rangeDatePicker"
                width="290px"
                style="z-index: 1000;"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="rangeDateText"
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
                <v-date-picker
                  v-model="date"
                  :locale="calendarLng"
                  :min="minDate"
                  :max="maxDate"
                  @input="validate('range')"
                  :color="calendarColor"
                  no-title
                  scrollable
                  range
                >
                </v-date-picker>
              </v-dialog>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="col-12 pt-0 pb-0">
          <h3 class="fontsz">Variables:</h3>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                id="btn1"
                v-on="on"
                :class="buttons.btn1.class"
                :disabled="disable"
                @click="
                  setButtonPressed('btn1'),
                    fetchStations(
                      'prcp',
                      rangeDate ? date[0] : date,
                      rangeDate ? date[1] : date
                    )
                "
              >
                <v-icon> mdi-weather-pouring</v-icon>
              </v-btn>
            </template>
            <span>Precipitación</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                id="btn2"
                v-on="on"
                :class="buttons.btn2.class"
                :disabled="disable"
                @click="
                  setButtonPressed('btn2'),
                    fetchStations(
                      'tmax',
                      selectedDateType === 'Rango' ? date[0] : date,
                      rangeDate ? date[1] : date
                    )
                "
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
                :class="buttons.btn3.class"
                :disabled="disable"
                @click="
                  setButtonPressed('btn3'),
                    fetchStations(
                      'tmin',
                      rangeDate ? date[0] : date,
                      rangeDate ? date[1] : date
                    )
                "
              >
                <v-icon>mdi-thermometer-lines</v-icon>
              </v-btn>
            </template>
            <span>Temperatura Mínima</span>
          </v-tooltip>
        </v-col>
      </v-card>
    </v-col>
    <v-overlay absolute :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-row>
</template>

<script>
import { eventBus } from "../../main.js";
export default {
  data() {
    return {
      buttons: {
        btn1: { class: "ma-2 btn1" },
        btn2: { class: "ma-2 btn2" },
        btn3: { class: "ma-2 btn3" },
      },
      selectedDateType: "Día",
      singleDatePicker: false,
      rangeDatePicker: false,
      date: "2018-04-13",
      selectedFilters: [
        "Interior oriental",
        "Costa del norte",
        "Laderas del norte",
        "Islas periféricas",
        "Costa del sur",
        "Laderas del sur",
        "Interior occidental",
      ],
      hideMenu: false,
    };
  },
  props: [
    "defaultDate",
    "minDate",
    "maxDate",
    "calendarLng",
    "calendarColor",
    "filters",
    "disable",
    "rangeDate",
    "SingleDateText",
    "rangeDateText",
    "overlay",
    // 'hideMenu'
  ],
  created() {
    eventBus.$on("defaultDate", (value) => {
      this.date = value;
    });
  },
  async mounted() {
    //
    this.setButtonPressed("btn1");
    await this.fetchStations(
      "prcp",
      this.rangeDate ? this.date[0] : this.date,
      this.rangeDate ? this.date[1] : this.date
    );
  },
  watch: {
    selectedDateType: function() {
      // this.date = this.defaultDate
      // console.log(defaultDate)
      eventBus.$emit("dateTypeChange", this.selectedDateType);
    },
    date: function() {
      eventBus.$emit("dateChange", this.date);
    },
    selectedFilters: function() {
      eventBus.$emit("selectedFiltersChange", this.selectedFilters);
    },
    hideMenu: function() {
      eventBus.$emit("hideMenuChange", this.hideMenu);
    },
  },
  methods: {
    validate: function(picker) {
      if (
        this.date[0] &&
        this.date[1] &&
        this.date.length === 2 &&
        picker === "range"
      ) {
        this.rangeDatePicker = false;
      } else if (this.date && picker === "single") {
        this.singleDatePicker = false;
      }
    },
    /**
     * change the styling of the most recent pressed button saved on the variable
     * currentPressButton
     */
    setButtonPressed: function(id) {
      this.setButtonUnpressed(); // unpress the current pressed button
      this.buttons[id].class = `ma-2 ${id} selectedbtn`; // set te class of the new pressed button to the selected button class
      this.currentPressButton = id; // set the variable to the recent pressed button
    },
    /**
     * unpress the most resent pressed button saved on the
     * currentPressButton variable
     */
    setButtonUnpressed: function() {
      if (this.currentPressButton) {
        this.buttons[
          this.currentPressButton
        ].class = `ma-2 ${this.currentPressButton}`;
      }
    },
    fetchStations: function(type, start, end) {
      eventBus.$emit("fetchStationRequest", type, start, end);
    },
  },
};
</script>

<style scoped>
.btn1 {
  background-color: rgb(82, 164, 211) !important;
}
.btn2 {
  background-color: rgb(248, 79, 79) !important;
}
.btn3 {
  background-color: rgb(93, 185, 93) !important;
}
.selectedbtn {
  /* background-color: grey; 
  */
  background-color: rgb(255, 255, 255) !important;
  box-shadow: 0px 0px 5px rgba(108, 110, 109, 0.836),
    0px 0px 10px 0 rgba(67, 68, 67, 0.678) !important;
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
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
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
