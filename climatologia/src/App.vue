<template>
  <v-app style="overflow:hidden !important;background:#23272a;z-index:-2;">
    <SmallWindow/>
    <Preloader/>
    <div class="main">
      <figure></figure>
      <figure></figure>
      <figure></figure>
      <figure></figure>
      <figure></figure>
      <div class="nav">
        <div class="navContent">
          <h1 class="logo">Climatología de Puerto Rico</h1>
          <div class="links">
            <a>About</a>
            <a>API</a>
            <a>Docs</a>
          </div>
        </div>
      </div>

      <div class="mapContainer">
        <div class="map"><Map/></div>
      </div>
    </div>
  </v-app>
</template>

<script>
import Map from "./components/maps/Map2";
import Preloader from './components/Preloader';
import SmallWindow from './components/SmallWindow';

export default {
  name: "app",

  components: {
    Preloader,
    Map,
    SmallWindow
  },

  data: () => ({}),
  mounted() {
    const loader = document.querySelector(".loader");
    loader.className += " hidden"; // class "loader hidden"
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@700;900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Lato&display=swap");

.main {
  width: 100%;
  height: 100%;
  font-family: "Lato", sans-serif;
  display: flex;
  flex-direction: column;
}

.main > figure{
  animation: imageAnimation 300s linear infinite 0s;
  background-size: cover;
  background-position: center center;
  height: 100%;
  left: 0px;
  opacity: 0;
  position: absolute;
  top: 0px;
  width: 100%;
  z-index: 0;
}

.main > figure:nth-child(1) { background-image: linear-gradient(#203b4a8a, #203b4a60),url('assets/trees.jpg'); }

.main > figure:nth-child(2) {
  animation-delay: 60s;
  background-image: linear-gradient(#203b4a8a, #203b4a60),url('assets/rainforest.jpg');
}

.main > figure:nth-child(3) {
  animation-delay: 120s;
  background-image:linear-gradient(#203b4a54, #203b4a54), url('assets/beach2.jpg');
}

.main > figure:nth-child(4) {
  animation-delay: 180s;
  background-image:linear-gradient(#203b4a8a, #203b4a60), url('assets/forest.jpg');
}

.main > figure:nth-child(5) {
  animation-delay: 240s;
  background-image:linear-gradient(#203b4a54, #203b4a54), url('assets/beach.jpg');
}

@keyframes 
imageAnimation {  0% {
 animation-timing-function: ease-in;
 opacity: 0;
}
 0.5% {
 animation-timing-function: ease-out;
 opacity: 1;
}
 2% {
 opacity: 1
}
 25% {
 opacity: 0
}
 100% {
 opacity: 0
}
}

.nav {
  display: grid;
  grid-template-rows: 100px 1fr;
  grid-column: 1 / span 9;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  z-index: 1;
  user-select: none;
}

.navContent {
  grid-column: 2 / span 7;
  display: flex;
  align-items: center;
}

.logo {
  color: white;
  cursor: pointer;
}

.links {
  margin-left: auto;
}

.links a {
  margin-right: 50px;
  text-decoration: none !important;
  color: white !important;
  font-size: 28px;
  font-weight: 400;
}
.links a:hover {
  color: #56ddd2 !important;
  transition: 0.3s;
}

.mapContainer {
  display: flex;
  flex: 2;
  align-items: center;
  justify-content: center;
}

.map {
  height: 80%;
  width: 100%;
  background: inherit;
   -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  -webkit-box-shadow: inset 0px 0px 200px rgba(243, 243, 243, 0.1),
    0px 5px 25px rgba(24, 24, 24, 0.11);
  box-shadow: inset 0px 0px 200px rgba(243, 243, 243, 0.1),
    0px 5px 25px rgba(24, 24, 24, 0.11);
  padding-top: 20px;
  padding-bottom: 20px;
  padding: 20px;
}

html {
  overflow-y: hidden !important;
}

@media only screen and (max-device-aspect-ratio: 9/16) {
  .nav {
    display: none;
  }
  .map {
    height: 100%;
    padding: 0px;
  }
  .loader h1{
    font-size: 30px;
     margin-top: 20%;
  }

  .loader{
    justify-content: flex-start;
  }
}

</style>
