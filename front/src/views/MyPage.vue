<template>
  <div class="pagebody">
    <div v-if="!isError && !passwordChange">
      <div class="pagename">마이 페이지</div>
      <div class="mypage_userinfo">
        <b-row class="mypage_info_img">
          <b-col sm="auto">
            <b-row class="mypage_info_row">
              <b-col class="mypage_info_keyvalue" sm="auto"> 이메일 </b-col>
              <b-col class="mypage_info_value" sm="auto">
                {{ userInfo.email }}
              </b-col>
            </b-row>
            <b-row class="mypage_info_row">
              <b-col class="mypage_info_keyvalue" sm="auto"> 닉네임 </b-col>
              <b-col class="mypage_info_value" sm="auto">
                {{ userInfo.nickname }}
              </b-col>
            </b-row>
            <b-row class="mypage_info_row">
              <b-col class="mypage_info_keyvalue" sm="auto"> 가입일 </b-col>
              <b-col class="mypage_info_value" sm="auto">
                {{ userInfo.createAt }}
              </b-col>
            </b-row>
            <b-row class="mypage_info_row">
              <b-col class="mypage_info_keyvalue" sm="auto">
                작성한 질문 수
              </b-col>
              <b-col class="mypage_info_value" sm="auto">
                {{ userInfo.questionCount }}
              </b-col>
            </b-row>
            <b-row class="mypage_info_row">
              <b-col class="mypage_info_keyvalue" sm="auto">
                작성한 답변 수
              </b-col>
              <b-col class="mypage_info_value" sm="auto">
                {{ userInfo.answerCount }}
              </b-col>
            </b-row>
            <b-row class="mypage_info_row">
              <b-col class="mypage_info_keyvalue" sm="auto">
                작성한 댓글 수
              </b-col>
              <b-col class="mypage_info_value" sm="auto">
                {{ userInfo.commentCount }}
              </b-col>
            </b-row>
            <b-row>
              <b-col class="change_pw_btn_div" sm="auto">
                <b-button class="change_pw_btn" @click="passwordChange = true"
                  >비밀번호 변경</b-button
                >
              </b-col>
              <b-col class="signout_btn_div" sm="auto">
                <b-button class="signout_btn" @click="signOut"
                  >로그아웃</b-button
                >
              </b-col>
            </b-row>
          </b-col>
          <b-col sm="auto">
            <div class="mypage_img_div">
              <img class="mypage_img" src="../assets/mypage.png" alt="mypage" />
            </div>
          </b-col>
        </b-row>
      </div>
      <b-tabs
        nav-class="mypage_outertabs"
        justified
        vertical
        @update:modelValue="activateOuterTab"
      >
        <b-tab title="추천한 게시글" active>
          <b-tabs
            class="mypage_innertabs"
            @update:modelValue="activateInnerTab"
          >
            <b-tab title="강의 정보"
              ><component
                :postsInfo="postsInfo"
                :is="presentComponent"
                v-if="presentComponent == `Lecture`"
                @movepage="recommendedPost"
            /></b-tab>
            <b-tab title="유튜브 채널"
              ><component
                :postsInfo="postsInfo"
                :is="presentComponent"
                v-if="presentComponent == `Channel`"
                @movepage="recommendedPost"
              />
            </b-tab>
            <b-tab title="자유 게시판"
              ><component
                :postsInfo="postsInfo"
                :isRecommended="true"
                :is="presentComponent"
                v-if="presentComponent == `FreeBoard`"
                @movepage="recommendedPost"
            /></b-tab>
            <b-tab title="질문 게시판"
              ><component
                :postsInfo="postsInfo"
                :isRecommended="true"
                :is="presentComponent"
                v-if="presentComponent == `Question`"
                @movepage="recommendedPost"
            /></b-tab>
            <b-tab title="답변"
              ><component
                :postsInfo="postsInfo"
                :isRecommended="true"
                :is="presentComponent"
                v-if="presentComponent == `Answer`"
                @movepage="recommendedPost"
            /></b-tab>
          </b-tabs>
        </b-tab>
        <b-tab title="내 자유 게시글"
          ><component
            :postsInfo="postsInfo"
            :isRecommended="false"
            :is="presentComponent"
            v-if="presentComponent == `FreeBoard`"
            @movepage="myPost"
        /></b-tab>
        <b-tab title="내 질문 게시글"
          ><component
            :postsInfo="postsInfo"
            :isRecommended="false"
            :is="presentComponent"
            v-if="presentComponent == `Question`"
            @movepage="myPost"
        /></b-tab>
        <b-tab title="내 답변"
          ><component
            :postsInfo="postsInfo"
            :isRecommended="false"
            :is="presentComponent"
            v-if="presentComponent == `Answer`"
            @movepage="myPost"
        /></b-tab>
        <b-tab title="내 댓글"
          ><component
            :postsInfo="postsInfo"
            :is="presentComponent"
            v-if="presentComponent == `Comment`"
            @movepage="myPost"
        /></b-tab>
      </b-tabs>
    </div>
    <div v-else-if="passwordChange">
      <ChangePW @changed="passwordChange = false" />
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
import Lecture from "./subViews/MyPageLecture.vue";
import Channel from "./subViews/MyPageChannel.vue";
import Question from "./subViews/MyPageQnA.vue";
import Answer from "./subViews/MyPageAnswer.vue";
import Comment from "./subViews/MyPageComment.vue";
import FreeBoard from "./subViews/MyPageFree.vue";
import ChangePW from "./subViews/MyPageChangePW.vue";
import { mapActions } from "vuex";
export default {
  components: {
    Lecture,
    Channel,
    Question,
    Answer,
    Comment,
    FreeBoard,
    ChangePW,
  },
  data() {
    return {
      error: {
        status: 0,
        message: "",
      },
      isError: false,
      userInfo: {},
      postsInfo: {
        pageInfo: {},
        posts: [],
      },
      passwordChange: false,
      presentInnerTab: 0,
      presentComponent: "Lecture",
    };
  },
  updated() {
    //쿠키 체크?
  },
  mounted() {
    this.axios
      .get("/mypage/recommended", { params: { board: "lecture" } })
      .then((response) => {
        if (response.status == 200) {
          var data = response.data;
          this.userInfo = data[1];
          this.postsInfo.pageInfo = data[0];
          this.postsInfo.posts = data[2];
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status == 403) {
            this.clearUserInfoAction();
          } else {
            this.error.status = error.response.status;
            this.error.message = error.response.data.message;
            this.isError = true;
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
      })
      .finally(() => {});
  },
  methods: {
    ...mapActions(["signOutAction", "clearUserInfoAction"]),
    signOut() {
      if (window.confirm("로그아웃 하시겠습니까?")) {
        this.signOutAction();
      }
    },
    activateOuterTab(value) {
      switch (value) {
        case 0:
          this.activateInnerTab(this.presentInnerTab);
          break;
        case 1:
          this.myPost({ category: "freeboard", p: 0 });
          break;
        case 2:
          this.myPost({ category: "question", p: 0 });
          break;
        case 3:
          this.myPost({ category: "answer", p: 0 });
          break;
        case 4:
          this.myPost({ category: "comment", p: 0 });
          break;
      }
    },
    activateInnerTab(value) {
      this.presentInnerTab = value;
      switch (value) {
        case 0:
          this.recommendedPost({ board: "lecture", p: 0 });
          break;
        case 1:
          this.recommendedPost({ board: "channel", p: 0 });
          break;
        case 2:
          this.recommendedPost({ board: "freeboard", p: 0 });
          break;
        case 3:
          this.recommendedPost({ board: "question", p: 0 });
          break;
        case 4:
          this.recommendedPost({ board: "answer", p: 0 });
          break;
      }
    },
    mountComponent(keyword) {
      switch (keyword) {
        case "lecture":
          this.presentComponent = "Lecture";
          break;
        case "channel":
          this.presentComponent = "Channel";
          break;
        case "question":
          this.presentComponent = "Question";
          break;
        case "answer":
          this.presentComponent = "Answer";
          break;
        case "comment":
          this.presentComponent = "Comment";
          break;
        case "freeboard":
          this.presentComponent = "FreeBoard";
          break;
      }
    },
    recommendedPost(info) {
      var queryString;
      if (info.p == 0) {
        queryString = { board: info.board };
      } else {
        queryString = { board: info.board, p: info.p };
      }
      this.axios
        .get("/mypage/recommended", { params: queryString })
        .then((response) => {
          if (response.status == 200) {
            var data = response.data;
            this.postsInfo.pageInfo = data[0];
            this.postsInfo.posts = data[2];
            this.mountComponent(info.board);
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status == 403) {
              this.clearUserInfoAction();
            } else {
              this.error.status = error.response.status;
              this.error.message = error.response.data.message;
              this.isError = true;
            }
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
        })
        .finally(() => {});
    },
    myPost(info) {
      var queryString;
      if (info.p == 0) {
        queryString = { category: info.category };
      } else {
        queryString = { category: info.category, p: info.p };
      }

      this.axios
        .get("/mypage/written", { params: queryString })
        .then((response) => {
          if (response.status == 200) {
            var data = response.data;
            this.postsInfo.pageInfo = data[0];
            this.postsInfo.posts = data[2];
            this.mountComponent(info.category);
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status == 403) {
              this.clearUserInfoAction();
            } else {
              this.error.status = error.response.status;
              this.error.message = error.response.data.message;
              this.isError = true;
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
};
</script>
<style>
@import "../assets/styles/bodymypage.css";
</style>
