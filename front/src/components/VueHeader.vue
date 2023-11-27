<!-- PageHeader.vue -->
<template>
  <header id="topmenu">
    <b-row class="menu">
      <b-col id="logo">
        <router-link to="/">
          <img src="../assets/logo.png" alt="logo" />
        </router-link>
      </b-col>
      <b-col id="nav">
        <b-row class="board">
          <b-col sm="auto">
            <router-link to="/lecture">강의 정보</router-link>
          </b-col>
          <b-col sm="auto">
            <router-link to="/channel">유튜브 채널</router-link>
          </b-col>
          <b-col sm="auto">
            <router-link to="/devQnA">질문 게시판</router-link>
          </b-col>
          <b-col sm="auto">
            <router-link to="/free">자유 게시판</router-link>
          </b-col>
        </b-row>
      </b-col>
      <b-col id="member">
        <b-form-row>
          <b-col sm="auto">
            <b-button
              id="loginb"
              v-if="!this.$store.state.user.isSignIn"
              @click="signInModal = true"
              pill
            >
              로그인
            </b-button>
            <b-button id="loginb" v-else @click="routeMypage" pill>
              {{ this.$store.state.user.nickname }}
            </b-button>
          </b-col>
        </b-form-row>
        <b-modal
          v-model="signInModal"
          hide-footer
          hide-header
          @hidden="onReset"
        >
          <div>
            <b-form>
              <b-form-group id="userEmail" label="이메일" label-for="input-1">
                <b-form-input
                  id="input-1"
                  v-model="form.email"
                  type="email"
                  placeholder="Email"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group id="userPW" label="패스워드" label-for="input-2">
                <b-form-input
                  id="input-2"
                  v-model="form.password"
                  type="password"
                  placeholder="Password"
                  required
                  v-on:keyup.enter="funcSignIn"
                ></b-form-input>
              </b-form-group>
            </b-form>
          </div>
          <b-form-row id="loginoption">
            <b-col sm="auto" class="loginb">
              <b-button @click="funcSignIn" type="submit"> 로그인 </b-button>
            </b-col>
            <b-col sm="auto" class="otherb">
              <div>
                <b-button variant="link" @click="linkTo('signUp')">
                  회원가입
                </b-button>
                |
                <b-button variant="link" @click="linkTo('find')">
                  비밀번호 찾기
                </b-button>
              </div>
            </b-col>
          </b-form-row>
        </b-modal>
      </b-col>
    </b-row>
  </header>
</template>

<script>
import { mapActions } from "vuex";
export default {
  component: {},
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      signInModal: false,
    };
  },
  methods: {
    ...mapActions(["signInAction"]),
    linkTo(link) {
      if (this.signInModal == true) {
        this.signInModal = false;
      }
      this.$router.push({ name: link });
    },
    funcSignIn(event) {
      event.preventDefault();
      if (this.form.email == "" || this.form.password == "") {
        window.alert("이메일과 패스워드를 전부 입력해주세요.");
      } else {
        this.signInAction(this.form);
        this.signInModal = false;
      }
    },
    onReset(event) {
      event.preventDefault();
      this.form.email = "";
      this.form.password = "";
    },
    routeMypage() {
      if (this.$route.name == "mypage") {
        this.$router.go(0);
      } else {
        this.$router.push({ name: "mypage" });
      }
    },
  },
};
</script>

<style scoped>
@import "../assets/styles/header.css";
</style>
