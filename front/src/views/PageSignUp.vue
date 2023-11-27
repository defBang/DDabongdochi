<template>
  <div class="pagebody">
    <div class="SignUp" v-if="!isError">
      <b-form>
        <b-form-row class="signupform">
          <b-col class="text" sm="auto"> 이메일 </b-col>
          <b-col>
            <b-form-input
              content-cols="3"
              id="input-1"
              v-model="user.email"
              type="email"
              placeholder="email"
              required
              @blur="checkInfo(user.email, 'Email')"
            ></b-form-input>
          </b-col>
        </b-form-row>
        <b-form-row class="signupform">
          <b-col class="text" sm="auto"> 닉네임 </b-col>
          <b-col>
            <b-form-input
              content-cols="3"
              id="input-2"
              v-model="user.nickname"
              placeholder="nickname"
              required
              @blur="checkInfo(user.nickname, 'Nickname')"
            ></b-form-input>
          </b-col>
        </b-form-row>
        <b-form-row class="signupform">
          <b-col class="text" sm="auto"> 비밀번호 </b-col>
          <b-col>
            <b-form-input
              content-cols="3"
              id="input-3"
              v-model="user.password"
              placeholder="password"
              type="password"
              required
            ></b-form-input>
          </b-col>
        </b-form-row>
        <b-form-row class="signupform">
          <b-col class="text" sm="auto"> 비밀번호 확인 </b-col>
          <b-col>
            <b-form-input
              content-cols="3"
              id="input-4"
              v-model="user.pwVerify"
              placeholder="password"
              type="password"
              required
              @blur="checkPassword"
            ></b-form-input>
          </b-col>
        </b-form-row>
        <b-alert v-model="alertShow" variant="danger" dismissible>
          입력한 비밀번호가 서로 다릅니다.
        </b-alert>
        <b-button type="submit" class="signupbutton" @click="signUp"
          >회원가입</b-button
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
  data() {
    return {
      error: {
        status: 0,
        message: "",
      },
      isError: false,
      user: {
        email: "",
        nickname: "",
        password: "",
        pwVerify: "",
      },
      isVerify: false,
      alertShow: false,
      isEmailDuplicated: true,
      isNicknameDuplicated: true,
    };
  },
  methods: {
    checkInfo(info, checkmode) {
      var encodedInfo = encodeURIComponent(info);
      if (info == "") {
        return;
      }
      var url = `/user/signUp/check` + checkmode + `/${encodedInfo}`;
      this.axios
        .get(url)
        .then((response) => {
          switch (checkmode) {
            case "Email":
              if (response.data.isEmailDuplicated) {
                console.log("이메일 중복");
              } else {
                this.isEmailDuplicated = false;
              }
              break;
            case "Nickname":
              if (response.data.isNicknameDuplicated) {
                console.log("닉네임 중복");
              } else {
                this.isNicknameDuplicated = false;
              }
              break;
          }
        })
        .catch((error) => {
          if (error.response) {
            this.error.status = error.response.status;
            this.error.message = error.response.data.message;
            this.isError = true;
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
        })
        .finally(() => {});
    },
    checkPassword() {
      if (this.user.password == this.user.pwVerify) {
        this.isVerify = true;
        this.alertShow = false;
      } else {
        this.isVerify = false;
        this.alertShow = true;
      }
    },
    signUp() {
      const regexName = /^[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣0-9]{2,20}$/;
      const regexEmail =
        /^(?=.{1,100})([a-zA-Z0-9]+@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+))$/;
      const regexPassword =
        /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[`!@#$%^&*()\-_+=])[a-zA-Z0-9`!@#$%^&*()\-_+=]{8,16}$/;
      this.checkPassword();
      if (
        this.user.nickname == "" ||
        this.user.email == "" ||
        this.user.password == "" ||
        this.user.pwVerify == ""
      ) {
        window.alert("모든 정보를 입력해 주세요.");
      } else if (!regexName.test(this.user.nickname)) {
        window.alert(
          "닉네임은 2~20자의 특수문자를 제외한 영어,숫자,한글만 사용할 수 있습니다."
        );
      } else if (!regexEmail.test(this.user.email)) {
        window.alert(
          "이메일을 제대로 입력해 주세요. 이메일은 100자까지 입력 가능합니다."
        );
      } else if (!regexPassword.test(this.user.password)) {
        window.alert(
          "비밀번호는 영문, 숫자, 특수문자(~`!@#$%^&*()-_+=)를 하나 이상씩 사용해서 입력해주세요."
        );
      } else if (this.isEmailDuplicated) {
        window.alert("이미 가입된 이메일입니다.");
      } else if (this.isNicknameDuplicated) {
        window.alert("이 닉네임은 사용중 입니다.");
      } else if (this.user.password != this.user.pwVerify) {
        window.alert("입력한 비밀번호가 서로 다릅니다.");
      } else {
        this.axios
          .post("/user/signUp", this.user)
          .then((response) => {
            if (response.status == 200) {
              window.alert("회원가입 완료!");
              this.$router.push({ name: "home" });
            }
          })
          .catch((error) => {
            if (error.response) {
              window.alert(
                error.response.status +
                  " error!: " +
                  error.response.data.message
              );
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
@import "../assets/styles/body.css";
</style>
