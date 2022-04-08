<template>
  <m-header></m-header>
  <tab></tab>
  <router-view v-slot="{ Component }">
    <transition appear name="slide">
      <component :is="Component" />
    </transition>
  </router-view>
</template>
<script>
import Header from "@/components/header/header";
import Tab from "@/components/tab/tab";
export default {
  name: "Welcome",
  components: {
    MHeader: Header,
    Tab,
  },
};
</script>

<style lang="less" scoped></style>
