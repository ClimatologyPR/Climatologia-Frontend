<template>
    <div class="loader" :class="{'-hidden': !this.$store.getters.isPreloading}">
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
</template>
<style scoped>

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

.loader.-hidden {
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
  margin-bottom: 30px;
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
@media only screen and (max-width: 1024px) {
  .loader {
    display: none;
  }
}
</style>