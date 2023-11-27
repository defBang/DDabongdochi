import Vuex from "vuex";
import axios from "axios";
import router from "./router";
//import createPersistedState from "vuex-persistedstate"
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

export default new Vuex.Store({
  state: {
    user: {
      userId: null,
      email: "",
      nickname: "",
      isSignIn: false,
    },
    mypage_pageinfo: {},
  },
  mutations: {
    clearUserInfo(state) {
      state.user.userId = null;
      state.user.email = "";
      state.user.nickname = "";
      state.user.isSignIn = false;
      localStorage.removeItem("PIC.user");
      cookies.remove("connect.sid");
    },
    readUserState(state) {
      var data;
      if (localStorage.getItem("PIC.user") !== null) {
        data = localStorage.getItem("PIC.user");
        state.user = JSON.parse(data);
      } else {
        state.user.isSignIn = false;
      }
    },
    signIn(state, userInfo) {
      axios
        .post("/user/signIn", userInfo)
        .then((res) => {
          if (res.status == 200) {
            state.user = res.data;
            state.user.isSignIn = true;
            localStorage.setItem("PIC.user", JSON.stringify(state.user));
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
    signOut(state, userEmail) {
      axios
        .get("/user/signOut", { params: userEmail })
        .then((res) => {
          if (res.status == 200) {
            cookies.remove("connect.sid");
            state.user.userId = null;
            state.user.email = "";
            state.user.nickname = "";
            state.user.isSignIn = false;
            localStorage.removeItem("PIC.user");
            router.push({ name: "home" });
          }
          //저장
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
  },
  actions: {
    signInAction({ commit }, userInfo) {
      commit("signIn", userInfo);
    },
    signOutAction({ commit }, userEmail) {
      commit("signOut", userEmail);
    },
    readUserStateAction({ commit }) {
      commit("readUserState");
    },
    clearUserInfoAction({ commit }) {
      commit("clearUserInfo");
    },
  },
});
