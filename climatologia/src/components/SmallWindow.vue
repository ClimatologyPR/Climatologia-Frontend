<template>
  <div class="smallWindow">
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
    <h1>We're Sorry!</h1>
    <hr>
    <p>
      The Climatology of Puerto Rico application requires a
      <strong>minimum screen width</strong>
      of 1024px and a <strong>minimum screen height</strong> of 550px .
    </p>
    <p>
      If you're visiting this website from a
      <strong>mobile device</strong> please revisit again from a tablet, laptop
      or desktop computer.
    </p>
    <p>
      If you're using a tablet device now, please make sure to view this website
      in <strong>landscape mode</strong> or if from a laptop or desktop computer
      use the <strong>full screen mode</strong>.
    </p>
    <p>Meanwhile you can <strong>learn more</strong> about this project here:</p>
    <div class="options">
      <router-link to="/about" class="aboutBtn">About Section</router-link>
      <router-link to="/api" class="aboutBtn">API</router-link>
    </div>
  </div>
</template>
<style scoped>

.options{
  display: flex;
  justify-content: space-evenly;
}
.aboutBtn{
    color: white;
    background: #47b6ad;
    padding: 10px;
    border-radius: 10px;
    text-shadow: 0px 0px 1px#23272a;
    user-select: none;
    text-decoration: none;
    min-width: 40%;
}

.aboutBtn:hover, .aboutBtn:active{
    transition: 0.3s;
    background: #56ddd2;
}

.smallWindow {
  position: absolute;
  z-index: 203;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #23272a;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: none;
  color: white;
  text-align: center;
  padding: 10px;
}

.smallWindow h1 {
  font-family: "Lato", sans-serif;
  font-weight: 900;
  font-size: 3.5vh;
  margin-bottom: 40px;
  color: white;
  user-select: none;
  
}

.smallWindow p{
    font-size: 2.2vh;
}

.smallWindow strong{
    color: #56ddd2;
}

#preloader {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}
#preloader span {
  width: 20px;
  height: 20px;
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
  animation-delay: 1.5s;
}
#preloader span:nth-child(8) {
  left: 80px;
  animation-delay: 1.75s;
}

@keyframes bounce {
  0% {
    transform: translateY(0px);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-30px);
    opacity: 1;
  }
  100% {
    transform: translateY(0px);
    opacity: 0.5;
  }
}

@media only screen and (max-width: 1023px), (max-height: 549px) {
  .smallWindow {
    display: block;
  }
}
</style>
