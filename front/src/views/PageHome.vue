<!-- PageHome.vue -->
<template>
  <div>
    <div class="home" v-if="!isError">
      <div class="home_img">
        <img src="../assets/home.png" alt="homepage" />
      </div>
      <h2>따봉도치 개발 커뮤니티</h2>
      <div>공주대학교 소프트웨어학과<br>캡스톤 디자인 프로젝트</div>
      <div>Developer: 방어진, 박재영, 윤승식</div>
      <div>
        Github: <a href="https://github.com/defBang/DDabongdochi">https://github.com/defBang/DDabongdochi</a>
      </div>
      주니어 개발자가 모여 정보를 공유하는 커뮤니티입니다!<br>
      프로젝트의 소스코드와 산출물은 깃헙에 있습니다.
      <div>
      </div>
    </div>
    <div v-else>
      <ErrorComponent :error="error" @routerpush="
        () => {
          this.isError = false;
        }
      " />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  components: {},
  data() {
    return {
      error: {
        status: 0,
        message: "",
      },
      isError: false,
    };
  },
};
</script>
<style>
@import "../assets/styles/body.css";
</style>
