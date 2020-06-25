<template>
  <v-app style="overflow:hidden !important;background:#23272a;z-index:-2;">
    <Preloader />
    <div class="main">
      <figure></figure>
      <figure></figure>
      <figure></figure>
      <figure></figure>
      <figure></figure>
      <div class="nav">
        <div class="navContent">
          <div class="logo">
            <router-link to="/">Climatología de Puerto Rico</router-link>
          </div>
          <div class="links">
            <router-link to="/about">About</router-link>
            <router-link to="/api">API</router-link>
            <a>Docs</a>
          </div>
        </div>
      </div>
      <transition name="fade" mode="out-in">
        <router-view class="router"/>
      </transition>
    </div>
  </v-app>
</template>

<script>
import Preloader from "./components/Preloader";

export default {
  name: "app",

  components: {
    Preloader,
  },

  data: () => ({}),
  methods:{
  },
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


.fade-enter-active,
.fade-leave-active{
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to{
  opacity: 0;
 
}

.router{
  z-index: 3;
}

.main {
  width: 100%;
  height: 100%;
  font-family: "Lato", sans-serif;
  display: flex;
  flex-direction: column;
}

.main > figure {
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



.main > figure:nth-child(1) {
  background-image: linear-gradient(#203b4a8a, #203b4a60),
    url("assets/trees.jpg");
}

.main > figure:nth-child(2) {
  animation-delay: 60s;
  background-image: linear-gradient(#203b4a46, #203b4a44),
    url("assets/rainforest.jpg");
}

.main > figure:nth-child(3) {
  animation-delay: 120s;
  background-image: linear-gradient(#203b4a2a, #203b4a21),
    url("assets/beach2.jpg");
}

.main > figure:nth-child(4) {
  animation-delay: 180s;
  background-image: linear-gradient(#203b4a8a, #203b4a60),
    url("assets/forest.jpg");
}

.main > figure:nth-child(5) {
  animation-delay: 240s;
  background-image: linear-gradient(#203b4a1e, #203b4a1f),
    url("assets/beach.jpg");
}

@keyframes imageAnimation {
  0% {
    animation-timing-function: ease-in;
    opacity: 0;
  }
  0.5% {
    animation-timing-function: ease-out;
    opacity: 1;
  }
  2% {
    opacity: 1;
  }
  25% {
    opacity: 0;
  }
  100% {
    opacity: 0;
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
  display: flex;
  flex-direction: row;
  width: auto;
  align-items: center;
}

.links {
  margin-left: auto;
}

.logo a {
  margin-right: 50px;
  text-decoration: none !important;
  color: white !important;
  font-size: 32px;
  font-weight: 900;
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





html {
  overflow-y: auto !important;
}

@media only screen and (max-device-aspect-ratio: 9/16) {
  .loader h1 {
    font-size: 30px;
    margin-top: 20%;
  }

  .loader {
    justify-content: flex-start;
  }
}

@media only screen and (max-width:1050px){
  .logo a{
    font-size: 2vh;
  }

  .links a{
    font-size: 3vh;
    margin-right: 3vw;
  }
}
</style>
