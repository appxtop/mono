<template>
  <div class="app">
    <div class="header">
      <HeaderCom />
    </div>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderCom from "./components/HeaderCom.vue";
</script>

<style lang="less" scoped>
.app {
  touch-action: none;

  height: 100%;
  background-color: yellow;
  display: flex;
  flex-direction: column;

  & > .header {
    background-color: green;
  }

  & > .content {
    background-color: #282828;
    flex: 1;
  }
}
</style>
