<template>
  <div class="pagebody">
    <b-row class="err_page">
      <b-col class="err_window" sm="auto">
        <b-row class="err_info">
          <b-col class="err_status"> {{ error.status }} Error!</b-col>
        </b-row>
        <b-row class="err_info">
          <b-col class="err_msg"> {{ error.message }} </b-col>
        </b-row>
        <b-row class="back_btn">
          <div>
            <b-button @click="backTo"> 홈 화면으로 돌아가기 </b-button>
          </div>
        </b-row>
      </b-col>
      <b-col class="errorimg" sm="auto">
        <img src="../assets/error.png" alt="error" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: {
        status: 404,
        message: "페이지를 찾을 수 없습니다.",
      },
    };
  },
  mounted() {},
  methods: {
    backTo() {
      this.$router.push({ name: "home" });
    },
  },
};
</script>
<style>
@import "../assets/styles/body.css";
</style>
