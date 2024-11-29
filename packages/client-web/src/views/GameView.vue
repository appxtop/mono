<template>
  <div ref="comRef" class="game-container">
    <template v-for="item in cards" :key="item._id">
      <CardCom :model="item" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, useTemplateRef, watch } from "vue";
import CardCom from "../components/game/CardCom.vue";
import { ws } from "../sigleton/ws";
import { userStore } from "../store/user";
import _ from "lodash";
import { cardStore } from "../store/card";
const cards = computed(() => cardStore.subData.cards);
// const loadding = ref(true);
const comRef = useTemplateRef("comRef");
onMounted(() => {
  const com = comRef.value;
  if (!com) {
    return;
  }
});

onUnmounted(() => {
  if (userStore.user) {
    const channel = 'cards:' + userStore.user._id;
    console.log('取消订阅');
    ws.unSubscribe(channel);
  }
})

</script>

<style lang="less" scoped></style>

<style lang="less" scoped>
.game-container {
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>
