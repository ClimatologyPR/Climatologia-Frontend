<template>
  <div class="graphContainer">
    <div class="graphContent">
      
      <div class="chartContent">
        <canvas id="myChart" width="400" height="100"></canvas>
        <div class='graphOff alert'><v-icon v-if="varType === 'prcp'" size="50px" color="white">mdi-chart-bar</v-icon><v-icon v-else size="50px" color="white">mdi-chart-line</v-icon><p> <i>El tamaño de la pantalla es demasiado pequeño para mostrar la gráfica</i></p></div>
      </div>
      
      <div class="options">
        <table class="content-table">
          <thead>
            <tr>
              <th>Información</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ID de Estación</td>
              <td>{{ stationID }}</td>
            </tr>
            <tr>
              <td>Municipio</td>
              <td>{{ municipality }}</td>
            </tr>
            <tr>
              <td>Rango de Fecha</td>
              <td>{{ rangeDateText }}</td>
            </tr>
            <tr>
              <td v-if="varType === 'prcp'">Precipitación Promedio</td>
              <td v-else-if="varType === 'tmax'">
                Temperatura Máxima Promedio
              </td>
              <td v-else>Temperatura Mínima Promedio</td>
              <td>
                {{ avg }} <span v-if="varType === 'prcp'">"</span
                ><span v-else>ºF</span>
              </td>
            </tr>
            <tr>
              <td>Máximo</td>
              <td>
                {{ max }} <span v-if="varType === 'prcp'">"</span
                ><span v-else>ºF</span>
              </td>
            </tr>
            <tr>
              <td>Mínimo</td>
              <td>
                {{ min }} <span v-if="varType === 'prcp'">"</span
                ><span v-else>ºF</span>
              </td>
            </tr>
            <tr>
              <td>Desviación Estándar</td>
              <td>
                {{ des }} <span v-if="varType === 'prcp'">"</span
                ><span v-else>ºF</span>
              </td>
            </tr>
            <tr>
              <td>Error Estándar</td>
              <td>
                {{ err }} <span v-if="varType === 'prcp'">"</span
                ><span v-else>ºF</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="download">
          <div class="dContent">
            <h3>Descargar data de gráfica</h3>
            <div class="downloadSettings">
              <div>
                <strong>Información del archivo para descarga:</strong>
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
                ><v-icon color="white">mdi-download</v-icon>Descargar</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js";
export default {
  data() {
    return {
      varType: null,
      modalId: null,
      spanClass: null,
      chartType: null,
      labelName: null,
      stationID: null,
      municipality: null,
      startdate: null,
      enddate: null,
      max: null,
      min: null,
      des: null,
      err: null,
      avg: null,
      csv: null,
    };
  },
  mounted() {
    this.varType = this.$route.params.varType;
    this.modalId = this.$route.params.modalId;
    this.spanClass = this.$route.params.spanClass;
    this.chartType = this.$route.params.chartType;
    this.labelName = this.$route.params.labelName;
    this.stationID = this.$route.params.stationID;
    this.municipality = this.$route.params.municipality;
    this.startdate = this.$route.params.startdate;
    this.enddate = this.$route.params.enddate;
    this.max = this.$route.params.max;
    this.min = this.$route.params.min;
    this.des = this.$route.params.des;
    this.err = this.$route.params.err;
    this.avg = this.$route.params.avg;
    this.setChart();
  },
  computed: {
    rangeDateText() {
      if (this.startdate && this.enddate) {
        const [year, month, day] = this.startdate.split("-");
        const [year1, month1, day1] = this.enddate.split("-");
        return `${month}/${day}/${year} ➜ ${month1}/${day1}/${year1}`;
      }
      return "";
    },
  },
  methods: {
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

    setChart: async function() {
      var config = null;
      var stationLabels = [];
      var dataSetResponse = await fetch(
        "http://climatologia.uprm.edu:8008/api?" +
          "q=data&" +
          "calc=none" +
          "&station=" +
          this.stationID +
          "&startdate=" +
          this.startdate +
          "&enddate=" +
          this.enddate +
          "&elem=" +
          this.varType
      ).catch(function(error) {
        alert(error);
      });
      var yLabel =
        this.varType === "prcp"
          ? "Precipitación (in)"
          : this.varType === "tmax"
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
      switch (this.varType) {
        case "prcp":
          config = {
            type: "bar",
            data: {
              labels: stationLabels,
              datasets: [
                {
                  label: this.labelName,
                  backgroundColor: "#56ddd281",
                  borderColor: "#56ddd2",
                  borderWidth: 1,
                  data: formatedDataSet,
                },
              ],
            },
            options: {
              responsive: true,
              title: {
                display: true,
                text:
                  this.labelName +
                  " - " +
                  this.municipality +
                  " ( " +
                  this.stationID +
                  " )",
                fontColor: "white",
                fontSize: 30,
              },

              legend: {
                display: false,
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
                    gridLines:{
                      zeroLineColor:'rgba(255, 255, 255, 0.3)',
                      display:true
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
                    gridLines: { color: "rgba(255, 255, 255, 0.3)",
                    zeroLineColor:'rgba(255, 255, 255, 0.3)' },
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
                  label: this.labelName,
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
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@300;400&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@700;900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Lato&display=swap");

.chartContent {
  border: 4px var(--strong) solid;
  background: var(--codeBackground);
  border-radius: 10px;
  padding: 10px;
}

.graphContainer {
  background: var(--main);
  color: var(--text) !important;
  font-family: "Lato", sans-serif;
  padding: 32px;
  font-size: 2vh;
  height: 100%;
}

.dContent {
  background: var(--codeBackground);
  border: 4px var(--strong) solid;
  padding: 20px;
  border-radius: 10px;
  margin-top: 24px;
}

.downloadBtnLocation {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.downloadBtn {
  padding: 10px;
  background: var(--strong);
  color: var(--h1) !important;
  border-radius: 10px;
  transition: 0.3s;
}

.downloadBtn:hover {
  background: var(--strongHover);
  text-decoration: none !important;
}

.options {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
}

.graphContent {
  max-width: 1440px;
  display: flex;
  flex: 2;
  flex-direction: column;
}

.graphContainer h1 {
  color: var(--h1);
  font-weight: 700;
  font-size: 4vh;
}

.graphContainer h2 {
  color: var(--h1);
  font-weight: 400;
  font-size: 3vh;
  margin-top: 35px;
  margin-bottom: 20px;
}

.graphContainer h3 {
  color: var(--h3);
}

.graphContainer h5 {
  color: var(--h3);
  margin-top: 24px;
  margin-bottom: 8px;
  font-size: 2vh;
}

.graphContainer h6 {
  color: var(--h3);
  margin-top: 20px;
  margin-bottom: 6px;
  font-size: 1.7vh;
}

.graphContainer strong {
  color: var(--strong);
}

.table {
  display: flex;
  justify-content: center;
}

.content-table {
  border-collapse: collapse;
  margin-top: 24px;
  font-size: 1em;
  border-radius: 5px 5px 0 0;
  overflow: hidden;
  color: black;
}

.content-table thead tr {
  background-color: var(--tableHeader);
  color: var(--h1);
  text-align: left;
  font-weight: bold;
}

.content-table th,
.content-table td {
  padding: 12px 15px;
}

.content-table tgraphContainer tr {
  border-bottom: 1px solid var(--tableRow);
  background: var(--tableRow);
  color: var(--text);
}

.content-table tgraphContainer tr:nth-of-type(even) {
  background-color: var(--tableRowEven);
}

.content-table tgraphContainer tr:last-of-type {
  border-bottom: 2px solid var(--tableHeader);
}
.content-table td {
  border-right: 1px solid var(--tableBorder);
}

.content-table tgraphContainer tr.active-row {
  font-weight: bold;
  color: var(--tableHeader);
}

.graphContainer b {
  color: var(--green);
}

.graphContainer a {
  cursor: pointer;
  color: var(--strong);
}
.graphContainer a:hover {
  transition: 0.1s;
  color: var(--strongHover);
  text-decoration: underline;
}

.graphContainer pre {
  overflow: auto !important;
  background: var(--codeBackground) !important;
  border-radius: 5px;
  color: var(--codeText) !important;
  padding: 16px;
}

.graphContainer p {
  margin-top: 18px;
}

.graphContainer i {
  font-size: 1.7vh;
  font-weight: 300;
}
.alert {
  background: var(--alertBackground);
  border: 2px solid var(--alertBorder);
  border-radius: 5px;
  padding: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.graphOff{
  display: none;
  text-align: center;
}

@media only screen and (max-width: 1200px) {
  #myChart{
    display: none!important;
    
  }
  .graphOff{
    display: block;
  }
}

@media only screen and (max-width: 1450px) {
  .options {
    flex-direction: column;
  }
}

@media only screen and (min-width: 1630px) {
  .graphContainer {
    display: flex;
    justify-content: center;
  }
}
</style>
