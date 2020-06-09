<template>
  <v-app>
    <v-app-bar
      app
      color="#82ada9"
      dark
    >
    <div style=" width: 100%; text-align: center;">
        <h1 style=" color:white; font-weight: bold;" class="bar-title">Climatología de Puerto Rico</h1>

    </div>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src=""
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src=""
          width="100"
        />
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>
    <v-col  class="ma-0 pa-0 pb-2">
        <v-img
          aspect-ratio="4"
          :src="require('./assets/wenhao-ryan-jEUEpfjpe6Q-unsplash.jpg')"
          cover
        />
    </v-col>
    <v-content class="  pl-2 pr-2 pb-2 pt-0">
      <HomePage class=" ml-2 mr-2 pt-0"/>
    </v-content>
    <!-- <v-footer
      color="#00251a"
      padless
    >
      <v-row
        justify="center"
        no-gutters
      >
        <v-col
          class="#00251a py-4 text-center white--text"
          cols="12"
        >
          {{ new Date().getFullYear() }} — <strong>copyrigth</strong>
        </v-col>
      </v-row>
    </v-footer> -->
  </v-app>
</template>

<script>
import HomePage from './components/HomePage';

export default {
  name: 'App',

  components: {
    HomePage,
  },

  data: () => ({
    //
  }),
};
</script>
<style scoped>
@media only screen and (min-width: 360px) and (max-width: 768px ) {
  .bar-title {
    font-size: 2vh;
  }
}
@media only screen and (min-width: 1024px) and (max-width: 1440px) { 
.bar-title {
    font-size: 4vh;
  }
 }

@media only screen and (min-width: 1440px) and (max-width: 1680px) {
.bar-title {
    font-size: 5vh;
  }
 }
@media only screen and (min-width: 1680px) and (max-width: 1920px) {
 
 }
 @media only screen and (min-width: 1920px) and (max-width: 32560px) { 

 }
@media only screen and (min-width: 32560px)  { 

 }
</style>
