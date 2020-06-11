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
    </v-app-bar>
        <v-img
          aspect-ratio="7"
          :src="require('./assets/wenhao-ryan-jEUEpfjpe6Q-unsplash.jpg')"
          cover
        />
        <v-content class="ma-0 pa-0">
      <HomePage/>
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
import HomePage from './components/maps/Map2';

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
