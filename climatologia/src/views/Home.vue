<template>
  <v-row class="text-center">
    <map-view> </map-view>
  </v-row>
</template>

<script>
// @ is an alias to /src
import MAP from "../components/maps/Map";

export default {
  name: "Home",
  components: {
    "map-view": MAP,
  },
};
</script>
