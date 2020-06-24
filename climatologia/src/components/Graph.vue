<template>
  <div class="graphContainer">
    <div class="graphContent">
    <div class="chartContent">
      <canvas id="myChart" width="400" height="100"></canvas>
    </div>
    <div class="infoContent">
      <strong>ID de Estación: </strong>
      {{ stationID }}
      <br />
      <strong>Municipio: </strong>
      {{ municipality }}
      <br />
      <strong>Rango de Fecha: </strong>
      {{ rangeDateText }}
      <br />
      <strong v-if="varType === 'prcp'">
        Precipitación Promedio:
      </strong>
      <strong v-else-if="varType === 'tmax'">
        Temperatura Máxima Promedio:
      </strong>
      <strong v-else> Temperatura Mínima Promedio: </strong>
      {{ avg }}
      <span v-if="varType === 'prcp'">"</span><span v-else>ºF</span>
      <br />
      <strong>Máximo: </strong>
      {{ max }}
      <span v-if="varType === 'prcp'">"</span><span v-else>ºF</span>
      <br />
      <strong>Mínimo: </strong>
      {{ min }}
      <span v-if="varType === 'prcp'">"</span><span v-else>ºF</span>
      <br />
      <strong>Desviación Estándar: </strong>{{ des }}
      <span v-if="varType === 'prcp'">"</span><span v-else>ºF</span>
      <br />
      <strong>Error Estándar: </strong>{{ err }}
      <span v-if="varType === 'prcp'">"</span><span v-else>ºF</span>
    </div>

    <a class="downloadBtn" @click="objectToCsv()"
      ><v-icon color="white">mdi-download</v-icon>Descargar</a
    >
    </div>
  </div>
</template>

<style scoped>
.graphContainer{
  background: var(--main);
  display: flex;
  flex-direction: column;
  height: 100%;
}


</style>

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
