<template>
  <div class="pagebody">
    <div class="change_password_verify" v-if="step == 0">
      <b-form>
        <b-form-row class="change_password_form">
          <b-col class="text" sm="auto">현재 비밀번호</b-col>
          <b-col>
            <b-form-input
              content-cols="3"
              id="input-1"
              v-model="presentPassword"
              type="password"
              placeholder="password"
              required
            ></b-form-input>
          </b-col>
        </b-form-row>
        <b-button
          class="findbutton"
          type="submit"
          @click="checkPresentPassword"
        >
          비밀번호 변경
        </b-button>
      </b-form>
    </div>
    <div class="change_password" v-if="step == 1">
      <b-form>
        <b-form-row class="change_password_form">
          <b-col class="text" sm="auto">새 비밀번호</b-col>
          <b-col>
            <b-form-input
              content-cols="3"
              id="input-1"
              v-model="password"
              type="password"
              placeholder="password"
              required
            ></b-form-input>
          </b-col>
        </b-form-row>
        <b-form-row class="change_password_form">
          <b-col class="text" sm="auto">비밀번호 확인</b-col>
          <b-col>
            <b-form-input
              content-cols="3"
              id="input-2"
              v-model="passwordVerify"
              type="password"
              placeholder="password"
              required
            ></b-form-input>
          </b-col>
        </b-form-row>
        <b-alert v-model="alertShow" variant="danger" dismissible>
          입력한 비밀번호가 서로 다릅니다.
        </b-alert>
        <b-button class="findbutton" type="submit" @click="changePassword">
          비밀번호 변경
        </b-button>
      </b-form>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      presentPassword: "",
      password: "",
      passwordVerify: "",
      isVerify: false,
      alertShow: false,
      step: 0,
    };
  },
  methods: {
    checkPresentPassword() {
      this.axios
        .post("/user/passwordCheck", { password: this.presentPassword })
        .then((res) => {
          if (res.status == 200) {
            this.step = 1;
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status == 403) {
              this.clearUserInfoAction();
            } else {
              window.alert(
                error.response.status +
                  " error!: " +
                  error.response.data.message
              );
            }
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
        })
        .finally(() => {});
    },
    checkPassword() {
      if (this.password == this.passwordVerify) {
        this.isVerify = true;
        this.alertShow = false;
      } else {
        this.isVerify = false;
        this.alertShow = true;
      }
    },
    changePassword() {
      this.checkPassword();
      const regexPassword =
        /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[`!@#$%^&*()\-_+=])[a-zA-Z0-9`!@#$%^&*()\-_+=]{8,16}$/;
      if (!regexPassword.test(this.password)) {
        window.alert(
          "비밀번호는 영문, 숫자, 특수문자(~`!@#$%^&*()-_+=)를 하나 이상씩 사용해서 입력해주세요."
        );
        this.alertShow = false;
      } else if (this.password != this.passwordVerify) {
        window.alert("입력한 비밀번호가 서로 다릅니다.");
      } else {
        var newPassword = {
          newPassword: this.password,
          passwordCheck: this.passwordVerify,
        };
        this.axios
          .put(`/user/changePassword`, newPassword)
          .then((response) => {
            if (response.status == 200) {
              this.$emit("changed");
            }
          })
          .catch((error) => {
            if (error.response) {
              if (error.response.status == 403) {
                this.clearUserInfoAction();
              } else {
                window.alert(
                  error.response.status +
                    " error!: " +
                    error.response.data.message
                );
              }
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log("Error", error.message);
            }
          })
          .finally(() => {});
      }
    },
  },
};
</script>
<style>
@import "../../assets/styles/bodymypage.css";
</style>
