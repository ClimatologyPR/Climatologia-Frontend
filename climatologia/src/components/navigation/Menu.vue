<template>
  <div class="menuSlide" id="menuSlide">
    <div class="board">
      <div class="tab" @mouseover="menuOpen" @click="menuClose">
        <v-icon color="white">mdi-menu</v-icon>
      </div>

      <div class="container">
        <div class="content">
          <div class="zone">
            <p class="ztext">Zonas Climáticas</p>
            <v-select
              class="picker"
              v-model="selectedFilters"
              :items="filters"
              :disabled="disable"
              label="Filtros"
              prepend-icon="mdi-layers"
              multiple
              clearable
            >
              <template v-slot:selection="{ item, index }">
                <span v-if="index === 0" class="grey--text caption"
                  >{{ selectedFilters.length }} selected</span
                >
              </template>
            </v-select>
          </div>
          <div class="date">
            <p class="dtext">Fecha</p>
            <div class="datef">
              <v-select
                v-model="selectedDateType"
                :items="['Día', 'Rango']"
                prepend-icon="mdi-white-balance-sunny"
                label="Fecha"
                dense
                solo
                :disabled="disable"
                class="picker"
              ></v-select>
              <v-dialog
                v-if="selectedDateType === 'Día'"
                ref="dialog"
                v-model="singleDatePicker"
                width="290px"
                style="z-index: 1000;"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    class="picker"
                    v-model="SingleDateText"
                    label="Fecha"
                    prepend-icon="mdi-calendar"
                    v-on="on"
                    dense
                    solo
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
              <v-dialog
                v-else-if="selectedDateType === 'Rango'"
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
                    dense
                    solo
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
            </div>
          </div>
        </div>

        <div class="content2">
          <div>
            <p>Variables</p>
          </div>
          <div class="buttons">
            <a
              class="button btn1"
              id="btn1"
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
              ><v-icon> mdi-weather-pouring</v-icon></a
            >
            <a
              class="button btn2"
              id="btn2"
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
              ><v-icon>mdi-thermometer-lines</v-icon></a
            >
            <a
              class="button btn3"
              id="btn3"
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
              ><v-icon>mdi-thermometer-lines</v-icon></a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
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
    menuOpen: function() {
      document.getElementById('menuSlide').style.transition = '0.3s';
      document.getElementById('menuSlide').style.transform = 'translateX(-280px)';
    },
    menuClose: function() {
      document.getElementById('menuSlide').style.transition = '0.3s';
      document.getElementById('menuSlide').style.transform = 'translateX(0px)';
      
    },
  },
};
</script>

<style scoped>
.board {
  top: 10%;
  left: 30%;
  width: auto;
  height: auto;
  position: absolute;
  display: flex;
}
.tab {
  height: auto;
  width: 50px;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  background: #2c2f33;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 3px 0px 5px rgb(133, 133, 133);
  z-index: 1;
}

.tab:hover{
  cursor: pointer;
}

.container p {
  font-weight: 900;
  font-family: "Lato", sans-serif;
  font-size: 2vh;
  height: 2vh;
}
.container {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.8);
}
.content {
  height: 100%;
  width: auto;
}
.content2 {
  display: flex;
  flex-direction: column;
}
.datef {
  display: flex;
  flex-direction: column;
}
.buttons {
  flex: 2;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: row;
}
.button {
  padding: 10px;
  border-radius: 10px;
  text-align: center;
}
.btn1 {
  background: rgb(82, 164, 211);
  box-shadow: 3px 2px rgb(59, 116, 150);
}
.btn1:hover {
  background: rgb(92, 183, 236);
}
.btn2 {
  background: rgb(248, 79, 79);
  box-shadow: 3px 2px rgb(165, 54, 54);
}
.btn2:hover {
  background: rgb(248, 110, 110);
}
.btn3 {
  background: rgb(93, 185, 93);
  box-shadow: 3px 2px rgb(59, 116, 59);
}
.btn3:hover {
  background: rgb(118, 230, 118);
}

.selectedbtn {
  /* background-color: grey; 
  */
  background-color: rgb(255, 255, 255) !important;
  transition: 0.2s;
  transform: translate(2px,3px);
  box-shadow: inset 3px 2px 5px rgb(139, 139, 139) !important;
  pointer-events: none;
  /* color: white; */
}

.picker {
  width: 260px;
  height: auto;
}

.menuSlide {
  position: absolute;
  top: 20%;
  right: 44px;
  z-index: 2;
}
</style>
