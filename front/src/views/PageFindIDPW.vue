<template>
  <div class="pagebody">
    <div class="find" v-if="!isError">
      <b-form>
        <b-form-row class="findform">
          <b-col class="text" sm="auto">이메일</b-col>
          <b-col>
            <b-form-input
              content-cols="3"
              id="input-1"
              v-model="email"
              type="email"
              placeholder="email"
              required
            ></b-form-input>
          </b-col>
        </b-form-row>
        <b-button class="findbutton" type="submit" @click="findUserInfo"
          >찾기</b-button
        >
      </b-form>
    </div>
    <div v-else>
      <ErrorComponent
        :error="error"
        @routerpush="
          () => {
            this.isError = false;
          }
        "
      />
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      error: {
        status: 0,
        message: "",
      },
      isError: false,
      email: "",
    };
  },
  methods: {
    findUserInfo() {
      //내용 넣기
      this.axios
        .put(`/user/findPassword`, { email: this.email })
        .then((response) => {
          if (response.status == 200) {
            window.alert("비밀번호 찾기에 성공했습니다. 메일을 확인해 주세요.");
            this.$router.push({ name: "home" });
          }
        })
        .catch((error) => {
          if (error.response) {
            window.alert(
              error.response.status + " error!: " + error.response.data.message
            );
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
        })
        .finally(() => {});
    },
  },
};
</script>
<style>
@import "../assets/styles/body.css";
</style>
