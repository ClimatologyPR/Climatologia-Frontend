<template>
  <v-app style="overflow-x:hidden;">
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
          max-height="300px"
          :src="require('./assets/wenhao-ryan-jEUEpfjpe6Q-unsplash.jpg')"
        />
        <v-content class="ma-0 pa-0">
      <HomePage/>
        </v-content>
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
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@700;900&display=swap');
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
</style>
