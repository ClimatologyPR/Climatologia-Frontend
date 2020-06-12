<template>
  <div class="board">
    <div class="tab">
      <v-icon color="white">mdi-menu</v-icon>
    </div>
    <div class="container">
      <div class="content">
        <div class="zone">
          <p class="ztext">Zonas Climáticas</p>
          <v-combobox
          style="width:200px;"
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
        </div>
        <div class="date">
          <p class="dtext">Fecha</p>
          <div class="datef">
            <v-select
              v-model="selectedDateType"
              :items="['Día', 'Rango']"
              prepend-icon="mdi-menu"
              label="Fecha"
              dense
              solo
              outlined
              :disabled="disable"
              style="width:200px;"
            ></v-select>
            <v-dialog
              ref="dialog"
              v-model="singleDatePicker"
              width="290px"
              style="z-index: 1000;"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                style="width:200px;"
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
          </div>
        </div>
      </div>

      <div class="content2">
      <div>
        <p>Variables</p>
        </div>
        <div class="buttons">
            <a class="button btn1"><v-icon> mdi-weather-pouring</v-icon></a>
            <a class="button btn2"><v-icon>mdi-thermometer-lines</v-icon></a>
            <a class="button btn3"><v-icon>mdi-thermometer-lines</v-icon></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.board {
  top: 10%;
  left: 30%;
  border: 1px solid red;
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
}

.container p {
  font-weight: 900;
  font-family: "Lato", sans-serif;
}
.container {
  display: flex;
  flex-direction: row;
  background: white;
}
.content {
  background: white;
  height: 100%;
  width: auto;
  border-right: double 8px #2c2f33;
  padding-right: 20px;
  margin-right: 20px;
}
.content2 {
  background: white;
  display: flex;
  flex-direction: column;
}
.datef {
  display: flex;
  flex-direction: column;
}
.buttons{
    flex: 2;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
}
.button{
    padding: 10px;
    border-radius: 10px;
    width: 100%;
    text-align: center;
}
.btn1{
    background: rgb(82, 164, 211);
    box-shadow: 3px 2px rgb(59, 116, 150);
}
.btn2{
    background: rgb(248, 79, 79);
    box-shadow: 3px 2px rgb(165, 54, 54);
}
.btn3{
    background: rgb(93, 185, 93);
    box-shadow: 3px 2px rgb(59, 116, 59);
}
</style>
