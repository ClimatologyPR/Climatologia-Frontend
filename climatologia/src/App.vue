<template>
  <v-app style="overflow:hidden !important;">
    <div class="loader">
      <h1>Climatología de Puerto Rico</h1>
      <div id="preloader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <div class="main">
      <div class="nav">
        <div class="navContent">
          <h1 class="logo">Climatología de Puerto Rico</h1>
          <div class="links">
            <a>About</a>
            <a>Help</a>
            <a>Docs</a>
          </div>
        </div>
      </div>

      <div class="mapContainer">
        <div class="map"><HomePage /></div>
      </div>
    </div>
  </v-app>
</template>

<script>
import HomePage from "./components/maps/Map2";

export default {
  name: "App",

  components: {
    HomePage,
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

.loader {
  position: absolute;
  z-index: 99;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #23272a;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loader h1 {
  font-family: "Lato", sans-serif;
  font-weight: 900;
  font-size: 40px;
  margin-bottom: 50px;
  color: white;
}

.loader.hidden {
  animation: fadeOut 1s;
  animation-fill-mode: forwards;
}

@keyframes fadeOut {
  100% {
    opacity: 0;
    visibility: hidden;
  }
}

#preloader {
	position:relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#preloader span {
	
	width:20px;
	height:20px;
	background: #56ddd2;
	border-radius: 999px;
	animation: bounce 1.2s infinite linear;
}
#preloader span:nth-child(1) {
	left: 0px;
	animation-delay: 0s;
}
#preloader span:nth-child(2) {
	left: 20px;
	animation-delay: 0.25s;
}
#preloader span:nth-child(3) {
	left: 40px;
	animation-delay: 0.5s;
}
#preloader span:nth-child(4) {
	left: 60px;
	animation-delay: 0.75s;
}
#preloader span:nth-child(5) {
	left: 80px;
	animation-delay: 1s;
}
#preloader span:nth-child(6) {
	left: 80px;
	animation-delay: 1.25s;
}
#preloader span:nth-child(7) {
	left: 80px;
	animation-delay: 1.50s;
}
#preloader span:nth-child(8) {
	left: 80px;
	animation-delay: 1.75s;
}

@keyframes bounce {
	0% {transform: translateY(0px); opacity: 0.5;}
	50% {transform: translateY(-30px); opacity: 1;}
	100% {transform: translateY(0px); opacity: 0.5;}
}

.main {
  animation: slide 1200s ease-in 0.4s infinite alternate;
  background-image: linear-gradient(#203b4a65, #203b4a60),
    url("assets/rainforest.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
  font-family: "Lato", sans-serif;
  display: flex;
  flex-direction: column;
}

@keyframes slide {
  20% {
    background-image: linear-gradient(#203b4a8a, #203b4a60),
      url("assets/rainforest.jpg");
  }
  20% {
    background-image: linear-gradient(#203b4a65, #203b4a60),
      url("assets/beach.jpg");
  }
  20% {
    background-image: linear-gradient(#203b4a65, #203b4a60),
      url("assets/forest.jpg");
  }
  20% {
    background-image: linear-gradient(#203b4a65, #203b4a60),
      url("assets/beach2.jpg");
  }
  20% {
    background-image: linear-gradient(#203b4a88, #203b4a60),
      url("assets/trees.jpg");
  }
}

.nav {
  display: grid;
  grid-template-rows: 100px 1fr;
  grid-column: 1 / span 9;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
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
@media only screen and (max-width: 600px) {
  .loader h1{
    font-size: 30px;
     margin-top: 20%;
  }

  .loader{
    justify-content: flex-start;
  }
}

@media only screen and (max-width: 450px) {
  .loader h1{
    font-size: 20px;
     margin-top: 20%;
  }

  .loader{
    justify-content: flex-start;
  }

  #preloader span{
    height: 10px;
    width: 10px;
  }
}
</style>
