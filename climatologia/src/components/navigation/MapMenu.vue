<template>
  <v-navigation-drawer
    v-model="drawer"
    absolute
    bottom
    temporary
    right
    class="menu-drawer pt-0 pb-0"
  >
    <v-row no-gutters style="height: 100%;">
      <v-col cols="12" class="pa-3">
        <v-card hover height="100%" width="100%" color="#f5f5f6">
          <v-col cols="12">
            <hr />
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
            <hr />
          </v-col>
          <v-col cols="12">
            <h3 class="fontsz">Fecha:</h3>
            <v-row class="pl-3 pr-3">
              <v-col cols="5">
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
              <v-col v-if="selectedDateType === 'Día'" cols="5">
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
                  <v-date-picker
                    locale="es-ES"
                    v-model="date"
                    color="#82ada9"
                    @input="validate('modal1')"
                    no-title
                    :show-current="false"
                    scrollable
                    min="2000-08-15"
                    max="2019-03-20"
                  >
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
                  <v-date-picker
                    locale="es-ES"
                    @input="validate('modal2')"
                    no-title
                    color="#82ada9"
                    v-model="date"
                    scrollable
                    range
                    :min="minDate"
                    :max="maxDate"
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
                  :class="btnPrcpClass"
                  :loading="loading"
                  :disabled="disable"
                  @click="
                    setButtonPressed('btn1'),
                      (overlay = !overlay),
                      fetchStations(
                        'prcp',
                        rangeDate ? date[0] : date,
                        rangeDate ? date[1] : date
                      )
                  "
                >
                  <v-icon> mdi-weather-pouring</v-icon>
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
                  @click="
                    setButtonPressed('btn2'),
                      (overlay = !overlay),
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
                  :class="btnTminClass"
                  :loading="loading2"
                  :disabled="disable"
                  @click="
                    setButtonPressed('btn3'),
                      (overlay = !overlay),
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
            <hr />
          </v-col>
          <v-col cols="12">
            <v-checkbox
              dense
              :disabled="disable"
              v-model="hideMenu"
              label="Menu Oculto"
              hide-details
            ></v-checkbox>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>
<script>
export default {};
</script>
<style scoped>
template {
  position: absolute;
}
</style>
