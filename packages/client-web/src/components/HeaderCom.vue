<template>
  <div class="header-container">
    <el-menu :default-active="$route.path" mode="horizontal" :router="true" :ellipsis="false">
      <el-menu-item class="home" index="/">
        <img style="height: 100%" class="logo" src="/logo.svg" />Miao
      </el-menu-item>

      <template v-if="user">
        <el-sub-menu>
          <template #title>{{
            user.nickname + "(" + user.username + ")"
            }}</template>
          <el-menu-item index="/user"> 个人中心 </el-menu-item>
          <el-menu-item index="/settings"> 设置 </el-menu-item>
          <el-menu-item @click="handleLogout()" index="logout">
            退出登录
          </el-menu-item>
        </el-sub-menu>
      </template>
      <template v-else-if="user === null">
        <el-menu-item index="/login"> 登录 </el-menu-item>
        <el-menu-item index="/register"> 注册 </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import router from "../router";
import { userStore } from "../store/user";
import { setToken } from "../data";
const user = computed(() => userStore.user);
function handleLogout() {
  setToken("");
  userStore.updateUser(null);
  router.push("/login");
}
</script>

<style lang="less" scoped>
.header-container {
  user-select: none;
  background-color: #2f3138;
  padding-right: 10px;

  .el-menu--horizontal {
    --el-menu-horizontal-height: 40px;
  }

  .el-menu--horizontal>.el-menu-item {
    &:nth-child(1) {
      margin-right: auto;
    }

    &.home {
      border-bottom-width: 0;
    }
  }
}
</style>
