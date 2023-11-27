<template>
  <VueHeader ref="header" />
  <!-- 헤더 컴포넌트 -->
  <div id="routerviewWrapper">
    <router-view :key="$route.fullPath" @signInRequired="signInModalShow" />
  </div>
  <!-- 페이지 이동이 표시될 곳 -->
  <VueFooter class="footer" />
  <!-- 푸터 컴포넌트 -->
</template>

<script>
import VueHeader from "@/components/VueHeader";
import VueFooter from "@/components/VueFooter";
export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    VueFooter,
    VueHeader,
  },
  methods: {
    signInModalShow() {
      this.$refs.header.signInModal = true;
    },
  },
};
</script>

<style>
@import "./assets/styles/main.css";
</style>
