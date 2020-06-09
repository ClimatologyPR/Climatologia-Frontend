<template>
  <v-row class="text-center">
    <map-view> </map-view>
  </v-row>
</template>

<script>
// @ is an alias to /src
import MAP1 from "../components/maps/Map2";

export default {
  name: "Home",
  components: {
    "map-view": MAP1,
  },
};
</script>
