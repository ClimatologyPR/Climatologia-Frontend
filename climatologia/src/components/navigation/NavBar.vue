<template>
  <div class="navbar">
      <MenuButton/>
      </div>
</template>

<script>
import MenuButton from './MenuButton';
export default {
components:{
    MenuButton
}
};
</script>
<style scoped>
.navbar {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100px;
  overflow: auto;

  z-index: 1;
  min-width: 80px;
  box-shadow: inset 0px 0px 200px rgba(10, 10, 10, 0.377),-5px 0px 25px rgba(0, 0, 0, 0.493);
  backdrop-filter: blur(10px);
}
</style>
