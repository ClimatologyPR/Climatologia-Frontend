/* eslint-disable no-mixed-spaces-and-tabs */
<template>
  <div class="body">
    <div class="container">
        <h1>Climatology API</h1>
      <p>
        Climatology's API is based around
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.codecademy.com/articles/what-is-rest"
          >REST webservices</a
        >
        for general operations. This API sends real time weather data and
        events.
      </p>
      <h5>Base URL</h5>
      <pre>http://climatologia.uprm.edu:8008/api</pre>
      <p>This url has possible inputs of:</p>
      <pre>http://climatologia.uprm.edu:8008/api<b>?q=xxx[&additional partameters]</b></pre>

      <p>
        where "q" has default value of <strong>null</strong> but can be equal
        to:
      </p>
      <ul>
        <li>station</li>
        <li>data</li>
      </ul>
      <div class="alert">
        <i>Note: Additional parameters depend on the query</i>
      </div>

      <h2>Query Use</h2>
      <p>
        Each quary has its own parameters that can be used to filter what type
        of information you want to request.
      </p>
      <h5>Station:</h5>
      <p>
        In this query we have a default value of <strong>all</strong>. This
        means that it will return a list of every station in json format. To
        help filter out what type of station we want to be requested, we use the
        <strong>type</strong> parameter. This is then followed with the station
        that you wish to request.
      </p>
      <h6>Example:</h6>

      <pre>"type=" + stationtype (<b>rqc</b> | <b>rqw</b> | <b>rq1</b>)</pre><!--This needs to be changed in the future to better explain how you write the type.-->

      <h5>Data:</h5>

      <p>
        Data will return daily historic weather data entires grouped by
        stations. It includes all of the station information from the specified
        starting date until the final date. This data is received in json
        format. If you wish to retrieve data of only one specific date then only
        specify a starting date.
      </p>

      <div class="table">
        <table class="content-table">
          <thead>
            <tr>
              <th>Parameters</th>
              <th>Use</th>
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                "station=" + (station id)
              </td>
              <td>
                Brings data of this station
              </td>
              <td>
                all
              </td>
            </tr>
            <tr>
              <td>
                "elem=" + (prcp | tmax | tmin | tavg)
              </td>
              <td>
                Request the specific information of said station
              </td>
              <td>
                null
              </td>
            </tr>
            <tr>
              <td>
                "calc=" + (none | avg | max | min | stddev | stderr | all)
              </td>
              <td>
                Performs an operation with the available information
              </td>
              <td>
                none
              </td>
            </tr>
            <tr>
              <td>
                "startdate=" + ISOdate (YYYY-MM-DD)
              </td>
              <td>
                Is the starting date used to perform the request
              </td>
              <td>
                none
              </td>
            </tr>
            <tr>
              <td>
                "enddate=" + ISOdate (YYYY-MM-DD)
              </td>
              <td>
                Is the final date used to perform the request
              </td>
              <td>
                startdate
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Each parameter takes in values that affect the request's outcome. To
        help filter out what type of information is requested we created some
        values that they are expected to take. Each value has the job of
        specifying a piece of data or specific function the database must
        perform. Below you will find all the possible values and their use.
      </p>
      <div class="table">
        <table class="content-table">
          <thead>
            <tr>
              <td>Values</td>
              <td>Use</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>none</td>
              <td>Returns values of date interval</td>
            </tr>
            <tr>
              <td>avg</td>
              <td>Averaged values of date interval</td>
            </tr>
            <tr>
              <td>max</td>
              <td>Maximum values of date interval</td>
            </tr>
            <tr>
              <td>min</td>
              <td>Minimum values of date interval</td>
            </tr>
            <tr>
              <td>stddev</td>
              <td>Standard deviation of date interval</td>
            </tr>
            <tr>
              <td>stderr</td>
              <td>Standard error of date interval</td>
            </tr>
            <tr>
              <td>all</td>
              <td>Returns all previous calculations in a single json</td>
            </tr>
            <tr>
              <td>prcp</td>
              <td>Filters for precipitation</td>
            </tr>
            <tr>
              <td>tmax</td>
              <td>Filters for the max temperature</td>
            </tr>
            <tr>
              <td>tmin</td>
              <td>Filters for the minimum temperature</td>
            </tr>
            <tr>
              <td>tavg</td>
              <td>Returns the value of the average temperature</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Query Examples:</h2>
      <h6>Example 1:</h6>
      <pre>http://climatologia.uprm.edu:8008/api?<b>q</b>=<b>data</b>&<b>elem</b>=<strong>prcp</strong>&<b>startdate</b>=<strong>2018-03-01</strong>&<b>enddate</b>=<strong>2018-03-31</strong></pre>
      <p>
        This query will return all <strong>prcp</strong> entries from March 1,
        2018 to March 31, 2018. Here <b>q</b> was specified to be <b>data</b>,
        which allowed use of data's additional parameters. The <b>elem</b> was
        specified to be <strong>prcp</strong> which defined the element to be
        precipitation. The starting range <b>startdate</b> was specified to be
        2018-03-01 which defined the start of the date interval and the ending
        range <b>enddate</b> was specified to be 2018-03-31 which defined the
        end of the date interval. If only one specific date is desired only
        specify <b>startdate</b> and omit the <b>enddate</b>.
      </p>
      <h6>Example 2:</h6>
      <pre>http://climatologia.uprm.edu:8008/api?<b>q</b>=<b>data</b>&<b>elem</b>=<strong>prcp</strong>&<b>startdate</b>=<strong>2018-03-01</strong></pre>
      <p>
        Since <b>calc</b> was not specified, its default value was
        <strong>none</strong>, hence the query returns all recorded dates and
        their data. Specifying <b>calc</b> (i.e. avg) would result in one
        average prcp value across the date interval per station.
      </p>
      <h6>Example 3:</h6>
      <pre>http://climatologia.uprm.edu:8008/api?<b>q</b>=<b>data</b>&<b>elem</b>data&>=<strong>tmax</strong>&<b>calc</b>=<strong>avg</strong>&<b>startdate</b>=<strong>2018-03-01</strong>&<b>enddate</b>=<strong>2018-03-31</strong></pre>
      <p>
        This query is asking the data base to bring back data of the maximum
        temperature. Then it will calculate the average value from the date
        inverval. This date inteval starts <b>startdate</b> from March 1, 2018
        up to the end date <b>enddate</b> of March 31, 2018.
      </p>
    </div>
  </div>
</template>

<style>
      @import url("https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Lato:wght@300;400&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Lato:wght@700&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Lato:wght@700;900&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Lato&display=swap");

      :root {
        --main: #36393f;
        --text: #dcddde;
        --h1: white;
        --h3: #e3e5e8;
        --strong: #56ddd2;
        --green: #009879;
        --strongHover: #28b6aa;
        --tableHeader: #202225;
        --tableRow: #18191c;
        --tableBorder: #121315;
        --tableRowEven: #121315;
        --scrollBar: #202226;
        --codeText: #87909c;
        --codeBackground: #18191c;
        --alertBackground: rgba(240, 71, 71, 0.1);
        --alertBorder: rgba(240, 71, 71, 0.5);
      }

      .body {
        background: var(--main);
        color: var(--text);
        font-family: "Lato", sans-serif;
        padding: 32px;
        font-size: 2vh;
      }

      .container {
        max-width: 1440px;
        display: flex;
        flex-direction: column;
      }
      .body h1 {
        color: var(--h1);
        font-weight: 700;
        font-size: 4vh;
      }

      .body h2 {
        color: var(--h1);
        font-weight: 400;
        font-size: 3vh;
        margin-top: 35px;
        margin-bottom: 20px;
      }

      .body h3 {
        color: var(--h3);
      }

      .body h5 {
        color: var(--h3);
        margin-top: 24px;
        margin-bottom: 8px;
        font-size: 2vh;
      }

      .body h6 {
        color: var(--h3);
        margin-top: 20px;
        margin-bottom: 6px;
        font-size: 1.7vh;
      }

      .body strong {
        color: var(--strong);
      }

      .table {
        display: flex;
        justify-content: center;
      }

      .content-table {
        border-collapse: collapse;
        margin: 25px 0;
        font-size: 1em;
        min-width: 400px;
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

      .content-table tbody tr {
        border-bottom: 1px solid var(--tableRow);
        background: var(--tableRow);
        color: var(--text);
      }

      .content-table tbody tr:nth-of-type(even) {
        background-color: var(--tableRowEven);
      }

      .content-table tbody tr:last-of-type {
        border-bottom: 2px solid var(--tableHeader);
      }
      .content-table td {
        border-right: 1px solid var(--tableBorder);
      }

      .content-table tbody tr.active-row {
        font-weight: bold;
        color: var(--tableHeader);
      }

     .body b {
        color: var(--green);
      }

      /* width */
      ::-webkit-scrollbar {
        width: 30px;
        height: 30px;
        background: inherit;
      }

      ::-webkit-scrollbar-corner {
        background: inherit;
      }

      /* Track */
      ::-webkit-scrollbar-track {
        background: var(--main);
      }

      /* Handle */
      ::-webkit-scrollbar-thumb {
        background: var(--scrollBar);
        border-radius: 100px;
        background-clip: padding-box;
        border: solid 10px transparent;
      }
     .body a {
        cursor: pointer;
        color: var(--strong);
      }
     .body a:hover {
        transition: 0.1s;
        color: var(--strongHover);
        text-decoration: underline;
      }

     .body pre {
        overflow: auto !important;
        background: var(--codeBackground)!important;
        border-radius: 5px;
        color: var(--codeText) !important;
        padding: 16px;
       
      }

     .body p {
        margin-top: 18px;
      }

     .body i {
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

      @media only screen and (min-width: 1630px){
        .body{
          display: flex;
          justify-content: center;
        }
      }
    </style>