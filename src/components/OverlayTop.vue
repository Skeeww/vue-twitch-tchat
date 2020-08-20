<template>
  <div id="banner">
    <p>TCHAT</p>
  </div>
</template>

<script>
export default {
  name: 'OverlayTop'
}
</script>

<style scoped>
#banner{
  top: 0;
  left: 0;
  position: relative;
  background-color: brown;
  width: 100vw;
  height: 50px;
}
p{
  top: -40px;
  left: 50%;
  position: absolute;
  font-family: "Inter";
  font-weight: 800;
  color: #FFFFFF;
  font-size: 40px;
  transform: translateX(-50%);
}
</style>
